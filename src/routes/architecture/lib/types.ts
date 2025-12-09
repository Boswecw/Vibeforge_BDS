// Service definitions
export interface Service {
	name: string;
	port?: string;
	version: string;
	tier: 'provider' | 'intelligence' | 'consumer';
	category: string;
	status?: 'production' | 'beta' | 'planned';
	description?: string;
	hasContract?: boolean;
}

// Pipeline definitions
export interface PipelineStage {
	name: string;
	model?: string;
	color?: string;
}

export interface Pipeline {
	name: string;
	version: string;
	description: string;
	stages: PipelineStage[];
	invocation: string;
	contract?: {
		request: Record<string, unknown>;
		response: Record<string, unknown>;
		errors: string[];
	};
}

// Tier definitions
export interface Tier {
	id: string;
	name: string;
	subtitle: string;
	description: string;
	categories: Category[];
}

export interface Category {
	id: string;
	name: string;
	products: Product[];
	traits: string[];
}

export interface Product {
	name: string;
	version: string;
	port?: string;
	hasContract?: boolean;
}

// Contract types
export interface Contract {
	service: string;
	port: string;
	version: string;
	contract: {
		request: Record<string, unknown>;
		response: Record<string, unknown>;
		errors: string[];
	};
}
