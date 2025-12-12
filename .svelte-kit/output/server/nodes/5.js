

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/agents/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.B4vkXpwB.js","_app/immutable/chunks/BiFJXEbU.js","_app/immutable/chunks/6oQqUEYU.js","_app/immutable/chunks/DVFTkJZ1.js","_app/immutable/chunks/CuaX3alS.js"];
export const stylesheets = ["_app/immutable/assets/Alert.BjsHp1bl.css","_app/immutable/assets/Panel.Clt-M0I4.css","_app/immutable/assets/5.Bvi0J8dq.css"];
export const fonts = [];
