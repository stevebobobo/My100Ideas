import ideasData from "@/data/ideas.json";
import type { Idea } from "@/types/idea";

const ideas = ideasData as Idea[];

const statusLabels: Record<Idea["status"], string> = {
  idea: "想法",
  recorded: "已記錄",
  "in-progress": "進行中",
  completed: "已完成",
  missed: "已錯過",
};

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">MY100IDEAS</p>
        <h1>讓每一個想法，都留下它的人生。</h1>
        <p className="intro">
          記錄曾經想到、正在實現，以及因為拖延而錯過的創意。
        </p>
      </section>

      <section className="ideas" aria-labelledby="ideas-title">
        <div className="section-heading">
          <p className="eyebrow">IDEAS</p>
          <h2 id="ideas-title">創意紀錄</h2>
        </div>

        {ideas.map((idea) => (
          <article className="idea-card" key={idea.id}>
            <div className="idea-meta">
              <span>{idea.id}</span>
              <span>{statusLabels[idea.status]}</span>
              <time dateTime={idea.recordedAt}>{idea.recordedAt}</time>
            </div>
            <h3>{idea.title}</h3>
            <p>{idea.summary}</p>
            <div className="tags">
              {idea.categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
