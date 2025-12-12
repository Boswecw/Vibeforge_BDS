

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/agents/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DfSjkvnV.js","_app/immutable/chunks/BiFJXEbU.js","_app/immutable/chunks/CEBGzJg8.js","_app/immutable/chunks/x5TBZFzC.js","_app/immutable/chunks/BFaR4WWh.js"];
export const stylesheets = ["_app/immutable/assets/Alert.BjsHp1bl.css","_app/immutable/assets/Panel.Clt-M0I4.css","_app/immutable/assets/5.Bvi0J8dq.css"];
export const fonts = [];
