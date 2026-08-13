export interface Idea {
  id: string;
  title: string;
  status: "idea" | "recorded" | "not-implemented" | "in-progress" | "completed" | "missed";
  summary: string;
  problem: string;
  process: string[];
  benefits: string[];
  categories: string[];
  conceivedAt: string;
  outcome: string;
  recordedAt: string;
  demoUrl?: string;
}
