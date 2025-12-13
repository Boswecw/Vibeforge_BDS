

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/architecture/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.0ZfHSeM1.js","_app/immutable/chunks/CS1oB8eq.js","_app/immutable/chunks/CMwj8c2F.js"];
export const stylesheets = ["_app/immutable/assets/8.CoSoV0cF.css"];
export const fonts = [];
