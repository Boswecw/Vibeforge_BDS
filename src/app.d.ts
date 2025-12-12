// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Vite environment variables
	interface ImportMetaEnv {
		readonly VITE_API_BASE_URL?: string;
		readonly PROD: boolean;
		readonly DEV: boolean;
		readonly MODE: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
