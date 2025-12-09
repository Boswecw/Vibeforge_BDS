
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(billing)" | "/(auth)" | "/(admin)" | "/" | "/admin" | "/admin/agents" | "/agents" | "/analytics" | "/architecture" | "/architecture/lib" | "/architecture/lib/components" | "/architecture/lib/utils" | "/coordinator" | "/evaluator" | "/execution" | "/history" | "/library" | "/library/[id]" | "/models" | "/planning" | "/settings" | "/test-api" | "/testing" | "/workflows";
		RouteParams(): {
			"/library/[id]": { id: string }
		};
		LayoutParams(): {
			"/(billing)": Record<string, never>;
			"/(auth)": Record<string, never>;
			"/(admin)": Record<string, never>;
			"/": { id?: string };
			"/admin": Record<string, never>;
			"/admin/agents": Record<string, never>;
			"/agents": Record<string, never>;
			"/analytics": Record<string, never>;
			"/architecture": Record<string, never>;
			"/architecture/lib": Record<string, never>;
			"/architecture/lib/components": Record<string, never>;
			"/architecture/lib/utils": Record<string, never>;
			"/coordinator": Record<string, never>;
			"/evaluator": Record<string, never>;
			"/execution": Record<string, never>;
			"/history": Record<string, never>;
			"/library": { id?: string };
			"/library/[id]": { id: string };
			"/models": Record<string, never>;
			"/planning": Record<string, never>;
			"/settings": Record<string, never>;
			"/test-api": Record<string, never>;
			"/testing": Record<string, never>;
			"/workflows": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/agents" | "/admin/agents/" | "/agents" | "/agents/" | "/analytics" | "/analytics/" | "/architecture" | "/architecture/" | "/architecture/lib" | "/architecture/lib/" | "/architecture/lib/components" | "/architecture/lib/components/" | "/architecture/lib/utils" | "/architecture/lib/utils/" | "/coordinator" | "/coordinator/" | "/evaluator" | "/evaluator/" | "/execution" | "/execution/" | "/history" | "/history/" | "/library" | "/library/" | `/library/${string}` & {} | `/library/${string}/` & {} | "/models" | "/models/" | "/planning" | "/planning/" | "/settings" | "/settings/" | "/test-api" | "/test-api/" | "/testing" | "/testing/" | "/workflows" | "/workflows/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/fonts/Cinzel-Light.woff2" | "/fonts/Inter-Medium.woff2" | "/fonts/Inter-Regular.woff2" | "/fonts/Inter-SemiBold.woff2" | "/fonts/JetBrainsMono-Bold.woff2" | "/fonts/JetBrainsMono-Regular.woff2" | string & {};
	}
}