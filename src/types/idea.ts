export interface Idea {
  id: string;
  title: string;
  status: "idea" | "recorded" | "in-progress" | "completed" | "missed";
  summary: string;
  problem: string;
  process: string[];
  benefits: string[];
  categories: string[];
  recordedAt: string;
}
