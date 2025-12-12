

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BxEEhMGr.js","_app/immutable/chunks/DkYuCCRR.js"];
export const stylesheets = ["_app/immutable/assets/1.056HIiOS.css"];
export const fonts = [];
