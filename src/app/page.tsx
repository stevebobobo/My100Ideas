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

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">編號</th>
                <th scope="col">創意名稱</th>
                <th scope="col">狀態</th>
                <th scope="col">摘要</th>
                <th scope="col">分類</th>
                <th scope="col">記錄日期</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea.id}>
                  <td className="idea-id">{idea.id}</td>
                  <td className="idea-title">{idea.title}</td>
                  <td>
                    <span className="status-badge">{statusLabels[idea.status]}</span>
                  </td>
                  <td className="idea-summary">{idea.summary}</td>
                  <td>{idea.categories.join("、")}</td>
                  <td>
                    <time dateTime={idea.recordedAt}>{idea.recordedAt}</time>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
