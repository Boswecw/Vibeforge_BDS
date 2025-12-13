

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/agents/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.WgzSjZly.js","_app/immutable/chunks/BiFJXEbU.js","_app/immutable/chunks/CS1oB8eq.js","_app/immutable/chunks/CMwj8c2F.js","_app/immutable/chunks/oHG5MZam.js","_app/immutable/chunks/BcpFO3YO.js"];
export const stylesheets = ["_app/immutable/assets/Alert.BjsHp1bl.css","_app/immutable/assets/Panel.Bpoj7Woh.css","_app/immutable/assets/5.Bvi0J8dq.css"];
export const fonts = [];
