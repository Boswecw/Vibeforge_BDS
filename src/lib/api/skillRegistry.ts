import { forgeAgentsClient } from './forgeAgentsClient';
import type { Skill } from './types';

export class SkillRegistry {
	private allSkills: Skill[] = [];
	private skillsLoaded = false;
	private loadingPromise: Promise<Skill[]> | null = null;

	async loadSkills(): Promise<Skill[]> {
		if (this.skillsLoaded) return this.allSkills;
		if (this.loadingPromise) return this.loadingPromise;

		this.loadingPromise = forgeAgentsClient.listSkills().then((response) => {
			this.allSkills = response.skills;
			this.skillsLoaded = true;
			return this.allSkills;
		});
		return this.loadingPromise;
	}

	async getAllSkills(): Promise<Skill[]> {
		return this.loadSkills();
	}

	async getSkill(skillId: string): Promise<Skill | undefined> {
		const skills = await this.getAllSkills();
		return skills.find((s) => s.id === skillId);
	}

	async getSkillsBySection(): Promise<Record<string, Skill[]>> {
		const skills = await this.getAllSkills();
		return skills.reduce(
			(acc, skill) => {
				if (!acc[skill.section]) acc[skill.section] = [];
				acc[skill.section].push(skill);
				return acc;
			},
			{} as Record<string, Skill[]>
		);
	}

	async getSkillsByCategory(): Promise<Record<string, Skill[]>> {
		const skills = await this.getAllSkills();
		return skills.reduce(
			(acc, skill) => {
				if (!acc[skill.category]) acc[skill.category] = [];
				acc[skill.category].push(skill);
				return acc;
			},
			{} as Record<string, Skill[]>
		);
	}

	async search(query: string): Promise<Skill[]> {
		const skills = await this.getAllSkills();
		const q = query.toLowerCase();
		return skills.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q) ||
				s.tags.some((tag) => tag.toLowerCase().includes(q))
		);
	}

	async getPublicSkills(): Promise<Skill[]> {
		const skills = await this.getAllSkills();
		return skills.filter((s) => s.access === 'PUBLIC');
	}

	async getBDSOnlySkills(): Promise<Skill[]> {
		const skills = await this.getAllSkills();
		return skills.filter((s) => s.access === 'BDS_ONLY');
	}

	clearCache(): void {
		this.allSkills = [];
		this.skillsLoaded = false;
		this.loadingPromise = null;
	}
}

export const skillRegistry = new SkillRegistry();
