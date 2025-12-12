

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/architecture/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BJbNwQPP.js","_app/immutable/chunks/C9wVddXz.js"];
export const stylesheets = ["_app/immutable/assets/2.xLs7X-AE.css"];
export const fonts = [];
