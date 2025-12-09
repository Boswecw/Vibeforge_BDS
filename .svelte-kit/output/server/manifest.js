export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BayASJuk.js",app:"_app/immutable/entry/app.B5hNYzkj.js",imports:["_app/immutable/entry/start.BayASJuk.js","_app/immutable/chunks/BQIdIXpe.js","_app/immutable/chunks/BK1-blpL.js","_app/immutable/chunks/DEg4SPyu.js","_app/immutable/entry/app.B5hNYzkj.js","_app/immutable/chunks/BK1-blpL.js","_app/immutable/chunks/BWn2BPgY.js","_app/immutable/chunks/ldDS4Rmg.js","_app/immutable/chunks/sVKvU543.js","_app/immutable/chunks/jNZ-FLqr.js","_app/immutable/chunks/DEg4SPyu.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/admin/agents",
				pattern: /^\/admin\/agents\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/library",
				pattern: /^\/library\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/library/[id]",
				pattern: /^\/library\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
