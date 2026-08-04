export const IDEA_STATUSES = [
  "idea",
  "recorded",
  "research",
  "experiment",
  "prototype",
  "implemented",
  "published",
  "missed",
  "abandoned",
] as const;

export const IDEA_VISIBILITIES = ["private", "partial", "public"] as const;

export type IdeaStatus = (typeof IDEA_STATUSES)[number];
export type IdeaVisibility = (typeof IDEA_VISIBILITIES)[number];

export interface Idea {
  id: string;
  ownerId: string;
  title: string;
  summary: string | null;
  description: string | null;
  status: IdeaStatus;
  visibility: IdeaVisibility;
  categories: string[];
  originality: number | null;
  impact: number | null;
  difficulty: number | null;
  timing: number | null;
  regret: number | null;
  conceivedAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
