use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct TokenData {
    #[serde(rename = "accessToken")]
    access_token: String,
    #[serde(rename = "refreshToken")]
    refresh_token: String,
    #[serde(rename = "expiresAt")]
    expires_at: String,
}

fn get_token_file_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    // Ensure directory exists
    fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;

    Ok(app_data_dir.join("tokens.json"))
}

#[tauri::command]
async fn load_tokens(app_handle: tauri::AppHandle) -> Result<Option<TokenData>, String> {
    let token_file = get_token_file_path(&app_handle)?;

    if !token_file.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(&token_file).map_err(|e| e.to_string())?;
    let token_data: TokenData = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    Ok(Some(token_data))
}

#[tauri::command]
async fn save_tokens(
    app_handle: tauri::AppHandle,
    access_token: String,
    refresh_token: String,
    expires_at: String,
) -> Result<(), String> {
    let token_file = get_token_file_path(&app_handle)?;

    let token_data = TokenData {
        access_token,
        refresh_token,
        expires_at,
    };

    let json = serde_json::to_string_pretty(&token_data).map_err(|e| e.to_string())?;
    fs::write(&token_file, json).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn clear_tokens(app_handle: tauri::AppHandle) -> Result<(), String> {
    let token_file = get_token_file_path(&app_handle)?;

    if token_file.exists() {
        fs::remove_file(&token_file).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_tokens,
            save_tokens,
            clear_tokens
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
