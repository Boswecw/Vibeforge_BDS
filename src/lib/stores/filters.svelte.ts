/**
 * Advanced Filtering & Search Store
 * Manages filter state, URL sync, and saved presets
 */

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

/**
 * Filter Types
 */
export interface FilterState {
	// Search query
	query: string;

	// Multi-select filters
	categories: string[];
	tags: string[];
	accessLevels: string[];

	// Date range (for history filtering)
	dateFrom: Date | null;
	dateTo: Date | null;

	// Sort options
	sortBy: 'name' | 'date' | 'usage' | 'rating';
	sortOrder: 'asc' | 'desc';

	// Pagination
	page: number;
	pageSize: number;
}

export interface SavedPreset {
	id: string;
	name: string;
	filters: FilterState;
	createdAt: Date;
}

export interface SearchSuggestion {
	text: string;
	type: 'query' | 'category' | 'tag' | 'skill';
	count?: number;
}

/**
 * Query Parser for complex searches (AND, OR, NOT)
 */
export class QueryParser {
	/**
	 * Parse complex query string
	 * Examples:
	 * - "test AND debug" -> matches items with both "test" and "debug"
	 * - "test OR debug" -> matches items with either "test" or "debug"
	 * - "test NOT debug" -> matches items with "test" but not "debug"
	 * - Supports parentheses: "(test OR debug) AND typescript"
	 */
	static parse(query: string): ParsedQuery {
		const normalizedQuery = query.trim().toLowerCase();

		// Simple implementation for now
		// Full implementation would use a proper parser (e.g., recursive descent)

		if (!normalizedQuery) {
			return { type: 'empty', terms: [] };
		}

		// Check for operators
		if (normalizedQuery.includes(' and ')) {
			const terms = normalizedQuery.split(' and ').map(t => t.trim());
			return { type: 'and', terms };
		}

		if (normalizedQuery.includes(' or ')) {
			const terms = normalizedQuery.split(' or ').map(t => t.trim());
			return { type: 'or', terms };
		}

		if (normalizedQuery.includes(' not ')) {
			const parts = normalizedQuery.split(' not ');
			return {
				type: 'not',
				terms: [parts[0].trim()],
				exclude: parts.slice(1).map(t => t.trim())
			};
		}

		// Simple query (no operators)
		return { type: 'simple', terms: [normalizedQuery] };
	}

	/**
	 * Test if an item matches a parsed query
	 */
	static matches(item: any, parsedQuery: ParsedQuery, searchFields: string[] = ['name', 'description']): boolean {
		if (parsedQuery.type === 'empty') {
			return true;
		}

		// Get searchable text from item
		const searchText = searchFields
			.map(field => item[field] || '')
			.join(' ')
			.toLowerCase();

		switch (parsedQuery.type) {
			case 'simple':
				return parsedQuery.terms.some(term => searchText.includes(term));

			case 'and':
				return parsedQuery.terms.every(term => searchText.includes(term));

			case 'or':
				return parsedQuery.terms.some(term => searchText.includes(term));

			case 'not':
				const hasIncluded = parsedQuery.terms.some(term => searchText.includes(term));
				const hasExcluded = parsedQuery.exclude?.some(term => searchText.includes(term)) || false;
				return hasIncluded && !hasExcluded;

			default:
				return false;
		}
	}
}

interface ParsedQuery {
	type: 'empty' | 'simple' | 'and' | 'or' | 'not';
	terms: string[];
	exclude?: string[];
}

/**
 * Default filter state
 */
const defaultFilters: FilterState = {
	query: '',
	categories: [],
	tags: [],
	accessLevels: [],
	dateFrom: null,
	dateTo: null,
	sortBy: 'name',
	sortOrder: 'asc',
	page: 1,
	pageSize: 20
};

/**
 * Advanced Filter Store
 */
class AdvancedFilterStore {
	// Current filter state (reactive)
	filters = $state<FilterState>(structuredClone(defaultFilters));

	// Saved presets
	savedPresets = $state<SavedPreset[]>([]);

	// Search suggestions
	suggestions = $state<SearchSuggestion[]>([]);

	// Active filters count (derived)
	activeFiltersCount = $derived(
		this.filters.categories.length +
		this.filters.tags.length +
		this.filters.accessLevels.length +
		(this.filters.query ? 1 : 0) +
		(this.filters.dateFrom ? 1 : 0) +
		(this.filters.dateTo ? 1 : 0)
	);

	// Has active filters (derived)
	hasActiveFilters = $derived(this.activeFiltersCount > 0);

	// Parsed query (derived)
	parsedQuery = $derived(QueryParser.parse(this.filters.query));

	constructor() {
		// Load saved presets from localStorage
		if (browser) {
			this.loadPresets();
			this.loadFromURL();
		}
	}

	/**
	 * Update filter state
	 */
	setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
		this.filters[key] = value;
		this.syncToURL();
	}

	/**
	 * Set query
	 */
	setQuery(query: string) {
		this.filters.query = query;
		this.syncToURL();
	}

	/**
	 * Toggle category filter
	 */
	toggleCategory(category: string) {
		if (this.filters.categories.includes(category)) {
			this.filters.categories = this.filters.categories.filter(c => c !== category);
		} else {
			this.filters.categories = [...this.filters.categories, category];
		}
		this.syncToURL();
	}

	/**
	 * Toggle tag filter
	 */
	toggleTag(tag: string) {
		if (this.filters.tags.includes(tag)) {
			this.filters.tags = this.filters.tags.filter(t => t !== tag);
		} else {
			this.filters.tags = [...this.filters.tags, tag];
		}
		this.syncToURL();
	}

	/**
	 * Toggle access level filter
	 */
	toggleAccessLevel(level: string) {
		if (this.filters.accessLevels.includes(level)) {
			this.filters.accessLevels = this.filters.accessLevels.filter(l => l !== level);
		} else {
			this.filters.accessLevels = [...this.filters.accessLevels, level];
		}
		this.syncToURL();
	}

	/**
	 * Set date range
	 */
	setDateRange(from: Date | null, to: Date | null) {
		this.filters.dateFrom = from;
		this.filters.dateTo = to;
		this.syncToURL();
	}

	/**
	 * Set sort options
	 */
	setSort(sortBy: FilterState['sortBy'], sortOrder: FilterState['sortOrder'] = 'asc') {
		this.filters.sortBy = sortBy;
		this.filters.sortOrder = sortOrder;
		this.syncToURL();
	}

	/**
	 * Clear all filters
	 */
	clearAll() {
		this.filters = structuredClone(defaultFilters);
		this.syncToURL();
	}

	/**
	 * Clear specific filter
	 */
	clearFilter(type: 'query' | 'category' | 'tag' | 'accessLevel' | 'dateFrom' | 'dateTo', value?: string) {
		switch (type) {
			case 'query':
				this.filters.query = '';
				break;
			case 'category':
				if (value) {
					this.filters.categories = this.filters.categories.filter(c => c !== value);
				} else {
					this.filters.categories = [];
				}
				break;
			case 'tag':
				if (value) {
					this.filters.tags = this.filters.tags.filter(t => t !== value);
				} else {
					this.filters.tags = [];
				}
				break;
			case 'accessLevel':
				if (value) {
					this.filters.accessLevels = this.filters.accessLevels.filter(l => l !== value);
				} else {
					this.filters.accessLevels = [];
				}
				break;
			case 'dateFrom':
				this.filters.dateFrom = null;
				break;
			case 'dateTo':
				this.filters.dateTo = null;
				break;
		}
		this.syncToURL();
	}

	/**
	 * Apply filters to items
	 */
	applyFilters<T extends Record<string, any>>(
		items: T[],
		searchFields: string[] = ['name', 'description']
	): T[] {
		let filtered = [...items];

		// Apply query filter
		if (this.filters.query) {
			filtered = filtered.filter(item =>
				QueryParser.matches(item, this.parsedQuery, searchFields)
			);
		}

		// Apply category filter
		if (this.filters.categories.length > 0) {
			filtered = filtered.filter(item =>
				this.filters.categories.includes(item.category)
			);
		}

		// Apply tag filter
		if (this.filters.tags.length > 0) {
			filtered = filtered.filter(item => {
				const itemTags = item.tags || [];
				return this.filters.tags.some(tag => itemTags.includes(tag));
			});
		}

		// Apply access level filter
		if (this.filters.accessLevels.length > 0) {
			filtered = filtered.filter(item =>
				this.filters.accessLevels.includes(item.accessLevel)
			);
		}

		// Apply date range filter
		if (this.filters.dateFrom || this.filters.dateTo) {
			filtered = filtered.filter(item => {
				const itemDate = item.date || item.createdAt || item.lastRun;
				if (!itemDate) return false;

				const date = new Date(itemDate);

				if (this.filters.dateFrom && date < this.filters.dateFrom) {
					return false;
				}

				if (this.filters.dateTo && date > this.filters.dateTo) {
					return false;
				}

				return true;
			});
		}

		// Apply sorting
		filtered.sort((a, b) => {
			let aVal, bVal;

			switch (this.filters.sortBy) {
				case 'name':
					aVal = (a.name || '').toLowerCase();
					bVal = (b.name || '').toLowerCase();
					break;
				case 'date':
					aVal = new Date(a.date || a.createdAt || a.lastRun || 0).getTime();
					bVal = new Date(b.date || b.createdAt || b.lastRun || 0).getTime();
					break;
				case 'usage':
					aVal = a.usage || a.usageCount || 0;
					bVal = b.usage || b.usageCount || 0;
					break;
				case 'rating':
					aVal = a.rating || a.averageRating || 0;
					bVal = b.rating || b.averageRating || 0;
					break;
				default:
					return 0;
			}

			if (aVal < bVal) return this.filters.sortOrder === 'asc' ? -1 : 1;
			if (aVal > bVal) return this.filters.sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

		return filtered;
	}

	/**
	 * Get result counts for filters
	 */
	getFilterCounts<T extends Record<string, any>>(
		items: T[]
	): {
		categories: Record<string, number>;
		tags: Record<string, number>;
		accessLevels: Record<string, number>;
	} {
		const counts = {
			categories: {} as Record<string, number>,
			tags: {} as Record<string, number>,
			accessLevels: {} as Record<string, number>
		};

		items.forEach(item => {
			// Count categories
			if (item.category) {
				counts.categories[item.category] = (counts.categories[item.category] || 0) + 1;
			}

			// Count tags
			if (item.tags && Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => {
					counts.tags[tag] = (counts.tags[tag] || 0) + 1;
				});
			}

			// Count access levels
			if (item.accessLevel) {
				counts.accessLevels[item.accessLevel] = (counts.accessLevels[item.accessLevel] || 0) + 1;
			}
		});

		return counts;
	}

	/**
	 * Generate search suggestions
	 */
	generateSuggestions<T extends Record<string, any>>(
		items: T[],
		currentQuery: string = ''
	): SearchSuggestion[] {
		const suggestions: SearchSuggestion[] = [];
		const query = currentQuery.toLowerCase();

		// Skip if query is too short
		if (query.length < 2) {
			return suggestions;
		}

		// Get unique values
		const categories = new Set<string>();
		const tags = new Set<string>();
		const names = new Set<string>();

		items.forEach(item => {
			if (item.category && item.category.toLowerCase().includes(query)) {
				categories.add(item.category);
			}

			if (item.tags && Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => {
					if (tag.toLowerCase().includes(query)) {
						tags.add(tag);
					}
				});
			}

			if (item.name && item.name.toLowerCase().includes(query)) {
				names.add(item.name);
			}
		});

		// Add suggestions (limit to 10 total)
		let count = 0;
		const maxSuggestions = 10;

		// Categories first
		for (const category of Array.from(categories).slice(0, 3)) {
			if (count >= maxSuggestions) break;
			suggestions.push({ text: category, type: 'category' });
			count++;
		}

		// Tags next
		for (const tag of Array.from(tags).slice(0, 3)) {
			if (count >= maxSuggestions) break;
			suggestions.push({ text: tag, type: 'tag' });
			count++;
		}

		// Skill names last
		for (const name of Array.from(names).slice(0, 4)) {
			if (count >= maxSuggestions) break;
			suggestions.push({ text: name, type: 'skill' });
			count++;
		}

		this.suggestions = suggestions;
		return suggestions;
	}

	/**
	 * Save current filters as preset
	 */
	savePreset(name: string) {
		const preset: SavedPreset = {
			id: `preset-${Date.now()}`,
			name,
			filters: structuredClone(this.filters),
			createdAt: new Date()
		};

		this.savedPresets = [...this.savedPresets, preset];
		this.persistPresets();
	}

	/**
	 * Load preset
	 */
	loadPreset(presetId: string) {
		const preset = this.savedPresets.find(p => p.id === presetId);
		if (preset) {
			this.filters = structuredClone(preset.filters);
			this.syncToURL();
		}
	}

	/**
	 * Delete preset
	 */
	deletePreset(presetId: string) {
		this.savedPresets = this.savedPresets.filter(p => p.id !== presetId);
		this.persistPresets();
	}

	/**
	 * Persist presets to localStorage
	 */
	private persistPresets() {
		if (!browser) return;

		try {
			localStorage.setItem('filter-presets', JSON.stringify(this.savedPresets));
		} catch (err) {
			console.error('Failed to save presets:', err);
		}
	}

	/**
	 * Load presets from localStorage
	 */
	private loadPresets() {
		if (!browser) return;

		try {
			const stored = localStorage.getItem('filter-presets');
			if (stored) {
				const presets = JSON.parse(stored);
				this.savedPresets = presets.map((p: any) => ({
					...p,
					createdAt: new Date(p.createdAt),
					filters: {
						...p.filters,
						dateFrom: p.filters.dateFrom ? new Date(p.filters.dateFrom) : null,
						dateTo: p.filters.dateTo ? new Date(p.filters.dateTo) : null
					}
				}));
			}
		} catch (err) {
			console.error('Failed to load presets:', err);
		}
	}

	/**
	 * Sync filters to URL query params
	 */
	private syncToURL() {
		if (!browser) return;

		const params = new URLSearchParams();

		// Add non-default values to URL
		if (this.filters.query) {
			params.set('q', this.filters.query);
		}

		if (this.filters.categories.length > 0) {
			params.set('categories', this.filters.categories.join(','));
		}

		if (this.filters.tags.length > 0) {
			params.set('tags', this.filters.tags.join(','));
		}

		if (this.filters.accessLevels.length > 0) {
			params.set('levels', this.filters.accessLevels.join(','));
		}

		if (this.filters.dateFrom) {
			params.set('from', this.filters.dateFrom.toISOString());
		}

		if (this.filters.dateTo) {
			params.set('to', this.filters.dateTo.toISOString());
		}

		if (this.filters.sortBy !== 'name') {
			params.set('sort', this.filters.sortBy);
		}

		if (this.filters.sortOrder !== 'asc') {
			params.set('order', this.filters.sortOrder);
		}

		if (this.filters.page !== 1) {
			params.set('page', this.filters.page.toString());
		}

		// Update URL without page reload
		const url = new URL(window.location.href);
		url.search = params.toString();

		goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
	}

	/**
	 * Load filters from URL query params
	 */
	private loadFromURL() {
		if (!browser) return;

		const params = new URLSearchParams(window.location.search);

		// Parse URL params
		const query = params.get('q') || '';
		const categories = params.get('categories')?.split(',').filter(Boolean) || [];
		const tags = params.get('tags')?.split(',').filter(Boolean) || [];
		const accessLevels = params.get('levels')?.split(',').filter(Boolean) || [];
		const dateFrom = params.get('from') ? new Date(params.get('from')!) : null;
		const dateTo = params.get('to') ? new Date(params.get('to')!) : null;
		const sortBy = (params.get('sort') as FilterState['sortBy']) || 'name';
		const sortOrder = (params.get('order') as FilterState['sortOrder']) || 'asc';
		const page = parseInt(params.get('page') || '1', 10);

		this.filters = {
			...this.filters,
			query,
			categories,
			tags,
			accessLevels,
			dateFrom,
			dateTo,
			sortBy,
			sortOrder,
			page
		};
	}
}

/**
 * Export singleton instance
 */
export const filterStore = new AdvancedFilterStore();
