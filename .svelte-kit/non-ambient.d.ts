
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
		RouteId(): "/(billing)" | "/(auth)" | "/(admin)" | "/" | "/admin" | "/admin/agents" | "/coordinator" | "/planning" | "/workbench";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/(billing)": Record<string, never>;
			"/(auth)": Record<string, never>;
			"/(admin)": Record<string, never>;
			"/": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/agents": Record<string, never>;
			"/coordinator": Record<string, never>;
			"/planning": Record<string, never>;
			"/workbench": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/agents" | "/admin/agents/" | "/coordinator" | "/coordinator/" | "/planning" | "/planning/" | "/workbench" | "/workbench/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}