
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
		RouteId(): "/(billing)" | "/(auth)" | "/(admin)" | "/" | "/admin" | "/admin/agents" | "/library" | "/library/[id]";
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
			"/library": { id?: string };
			"/library/[id]": { id: string }
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/agents" | "/admin/agents/" | "/library" | "/library/" | `/library/${string}` & {} | `/library/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}