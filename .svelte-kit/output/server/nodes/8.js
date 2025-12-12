

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/architecture/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.CKmbBXkk.js","_app/immutable/chunks/6oQqUEYU.js"];
export const stylesheets = ["_app/immutable/assets/8.BxAKnxW9.css"];
export const fonts = [];
