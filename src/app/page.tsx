"use client";

import { useState, useMemo } from "react";
import ideasData from "@/data/ideas.json";
import type { Idea } from "@/types/idea";

const ideas = ideasData as Idea[];

const statusLabels: Record<Idea["status"], string> = {
  idea: "💡 想法",
  recorded: "📝 已記錄",
  "not-implemented": "⏳ 尚未實作",
  "in-progress": "🚀 進行中",
  completed: "✅ 已完成",
  missed: "🪦 錯過遺憾",
};

const statusClasses: Record<Idea["status"], string> = {
  idea: "status-idea",
  recorded: "status-recorded",
  "not-implemented": "status-not-implemented",
  "in-progress": "status-in-progress",
  completed: "status-completed",
  missed: "status-missed",
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline" | "table">("grid");
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);

  // Status Counts
  const stats = useMemo(() => {
    const counts = {
      all: ideas.length,
      idea: 0,
      recorded: 0,
      "not-implemented": 0,
      "in-progress": 0,
      completed: 0,
      missed: 0,
    };
    ideas.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });
    return counts;
  }, []);

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesStatus =
        selectedStatus === "all" || idea.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.summary.toLowerCase().includes(q) ||
        idea.problem.toLowerCase().includes(q) ||
        idea.categories.some((c) => c.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedStatus]);

  // Generate 100 slots matrix
  const matrixSlots = useMemo(() => {
    const slots = [];
    for (let i = 0; i < 100; i++) {
      const idea = ideas[i];
      slots.push({
        index: i + 1,
        idea: idea || null,
      });
    }
    return slots;
  }, []);

  return (
    <div className="app-container">
      {/* App Navigation Header */}
      <header className="app-header">
        <div className="brand-logo">
          <div className="brand-icon">💡</div>
          <span>
            <span className="brand-title-blue">My100</span>
            <span className="brand-title-gold">Ideas</span>
          </span>
        </div>
        <div className="header-actions">
          <a
            href="https://stevebobobo.github.io/ksuleo/"
            className="github-btn"
            style={{ textDecoration: 'none' }}
          >
            <span>← 返回 Austin Tang 官網</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>✨ 靈感博物館 & 點子檔案庫</span>
        </div>
        <h1 className="hero-title">
          讓每一個想法，<br />
          <span className="hero-title-gradient">都留下它的人生。</span>
        </h1>
        <p className="hero-subtitle">
          記錄曾經想到、正在實現，以及因為拖延而錯過的創意與故事。即使未曾實現，也是思想閃耀過的軌跡。
        </p>

        {/* 100 Ideas Visual Matrix */}
        <div className="matrix-container">
          <div className="matrix-header">
            <div className="matrix-title">
              <span>🎯 100 創意解鎖進度矩陣</span>
            </div>
            <div className="matrix-count mono">
              {stats.all} / 100 Ideas Recorded
            </div>
          </div>

          <div className="matrix-grid">
            {matrixSlots.map((slot) => {
              const activeClass = slot.idea
                ? `active-${slot.idea.status}`
                : "";
              return (
                <div
                  key={slot.index}
                  className={`matrix-dot ${activeClass}`}
                  title={
                    slot.idea
                      ? `#${slot.idea.id}: ${slot.idea.title} (${statusLabels[slot.idea.status]})`
                      : `Slot #${slot.index} (待解鎖)`
                  }
                  onClick={() => slot.idea && setActiveIdea(slot.idea)}
                  style={{ cursor: slot.idea ? "pointer" : "default" }}
                />
              );
            })}
          </div>

          {/* Quick Stat Cards (Blue, Gold, Red Palette) */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-val stat-val-gold">{stats.idea + stats.recorded}</div>
              <div className="stat-lbl">💡 想法紀錄</div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-slate">{stats["not-implemented"]}</div>
              <div className="stat-lbl">⏳ 尚未實作</div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-blue">{stats["in-progress"]}</div>
              <div className="stat-lbl">🚀 熱血進行中</div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-emerald">{stats.completed}</div>
              <div className="stat-lbl">✅ 完美實現</div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-red">{stats.missed}</div>
              <div className="stat-lbl">🪦 錯過的遺憾</div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Filters */}
      <section className="controls-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="搜尋創意名稱、痛點、結果或關鍵字..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${selectedStatus === "all" ? "active" : ""}`}
              onClick={() => setSelectedStatus("all")}
            >
              全部 ({stats.all})
            </button>
            <button
              className={`filter-tab tab-gold ${selectedStatus === "recorded" ? "active" : ""}`}
              onClick={() => setSelectedStatus("recorded")}
            >
              📝 已記錄 ({stats.recorded})
            </button>
            <button
              className={`filter-tab ${selectedStatus === "not-implemented" ? "active" : ""}`}
              onClick={() => setSelectedStatus("not-implemented")}
            >
              ⏳ 尚未實作 ({stats["not-implemented"]})
            </button>
            <button
              className={`filter-tab ${selectedStatus === "in-progress" ? "active" : ""}`}
              onClick={() => setSelectedStatus("in-progress")}
            >
              🚀 進行中 ({stats["in-progress"]})
            </button>
            <button
              className={`filter-tab ${selectedStatus === "completed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("completed")}
            >
              ✅ 已完成 ({stats.completed})
            </button>
            <button
              className={`filter-tab tab-red ${selectedStatus === "missed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("missed")}
            >
              🪦 錯過 ({stats.missed})
            </button>
          </div>

          <div className="view-switchers">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              🎴 卡片
            </button>
            <button
              className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              ⏳ 時間軸
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              📊 數據表
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {filteredIdeas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>🔍 找不到符合條件的靈感</p>
          <p style={{ fontSize: "0.9rem" }}>嘗試調整關鍵字或重設篩選條件</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="ideas-grid">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`idea-card card-${idea.status}`}
              onClick={() => setActiveIdea(idea)}
            >
              <div>
                <div className="card-top">
                  <span className="idea-id-badge mono">{idea.id}</span>
                  <span className={`status-pill ${statusClasses[idea.status]}`}>
                    <span className="status-dot" />
                    {statusLabels[idea.status]}
                  </span>
                </div>

                <h3 className="card-title">{idea.title}</h3>
                <p className="card-summary">{idea.summary}</p>

                <div className="card-tags">
                  {idea.categories.map((cat, idx) => (
                    <span key={idx} className="tag-pill">
                      #{cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card-footer">
                <div className="conceived-time">
                  <span>🗓️ {idea.conceivedAt}</span>
                </div>
                {idea.demoUrl ? (
                  <a
                    href={idea.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "700",
                      color: "#10b981",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    🔗 線上實作 ↗
                  </a>
                ) : (
                  <span className="action-link">解構內容 →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === "timeline" ? (
        <div className="timeline-wrap">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className={`timeline-item item-${idea.status}`}>
              <div className="timeline-dot" />
              <div
                className={`idea-card card-${idea.status}`}
                onClick={() => setActiveIdea(idea)}
              >
                <div className="card-top">
                  <span className="idea-id-badge mono">{idea.id}</span>
                  <span className="conceived-time" style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    🗓️ 構思時間：{idea.conceivedAt}
                  </span>
                  <span className={`status-pill ${statusClasses[idea.status]}`}>
                    <span className="status-dot" />
                    {statusLabels[idea.status]}
                  </span>
                </div>
                <h3 className="card-title">{idea.title}</h3>
                <p className="card-summary">{idea.summary}</p>
                <div className="card-tags">
                  {idea.categories.map((cat, idx) => (
                    <span key={idx} className="tag-pill">
                      #{cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>編號</th>
                <th>創意名稱</th>
                <th>狀態</th>
                <th>摘要說明</th>
                <th>分類標籤</th>
                <th>構思時間</th>
                <th>記錄日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdeas.map((idea) => (
                <tr key={idea.id}>
                  <td className="mono" style={{ color: "#2563eb", fontWeight: "bold" }}>
                    {idea.id}
                  </td>
                  <td style={{ fontWeight: "700", color: "#0f172a" }}>{idea.title}</td>
                  <td>
                    <span className={`status-pill ${statusClasses[idea.status]}`}>
                      {statusLabels[idea.status]}
                    </span>
                  </td>
                  <td style={{ color: "#475569", maxWidth: "300px" }}>{idea.summary}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {idea.categories.map((c, i) => (
                        <span key={i} className="tag-pill">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>{idea.conceivedAt}</td>
                  <td style={{ color: "#64748b", whiteSpace: "nowrap" }}>{idea.recordedAt}</td>
                  <td>
                    <button
                      onClick={() => setActiveIdea(idea)}
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        color: "#2563eb",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      詳情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Idea Detail Modal */}
      {activeIdea && (
        <div className="modal-overlay" onClick={() => setActiveIdea(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setActiveIdea(null)}
              title="關閉"
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span className="idea-id-badge mono">{activeIdea.id}</span>
              <span className={`status-pill ${statusClasses[activeIdea.status]}`}>
                <span className="status-dot" />
                {statusLabels[activeIdea.status]}
              </span>
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                🗓️ {activeIdea.conceivedAt}
              </span>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", marginBottom: "12px" }}>
              {activeIdea.title}
            </h2>

            <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: "1.65", marginBottom: "20px" }}>
              {activeIdea.summary}
            </p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              {activeIdea.categories.map((c, i) => (
                <span key={i} className="tag-pill" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
                  #{c}
                </span>
              ))}
            </div>

            {/* Problem Section */}
            {activeIdea.problem && (
              <>
                <div className="modal-section-title">📌 面臨問題與痛點 (Problem)</div>
                <div className="modal-box">{activeIdea.problem}</div>
              </>
            )}

            {/* Process Section */}
            {activeIdea.process && activeIdea.process.length > 0 && (
              <>
                <div className="modal-section-title">⚡ 運作與實作流程 (Process)</div>
                <div className="modal-box">
                  <ol className="process-list">
                    {activeIdea.process.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {/* Benefits Section */}
            {activeIdea.benefits && activeIdea.benefits.length > 0 && (
              <>
                <div className="modal-section-title">🎁 預期效益 (Benefits)</div>
                <div className="modal-box">
                  <ul className="benefit-list">
                    {activeIdea.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Outcome Section */}
            {activeIdea.outcome && (
              <>
                <div className="modal-section-title">📖 後續發展與回顧故事 (Outcome)</div>
                <div className={activeIdea.status === "missed" ? "outcome-callout" : "outcome-callout outcome-callout-gold"}>
                  {activeIdea.outcome}
                </div>
              </>
            )}

            {activeIdea.demoUrl && (
              <div style={{ marginTop: "20px" }}>
                <a
                  href={activeIdea.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)"
                  }}
                >
                  <span>🚀 前往專案線上實作頁面 (Apology AI) ↗</span>
                </a>
              </div>
            )}

            <div style={{ marginTop: "32px", textAlign: "right", fontSize: "0.8rem", color: "#94a3b8" }}>
              記錄日期：{activeIdea.recordedAt}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>My100Ideas · 讓每一個想法，都留下它的人生。</p>
      </footer>
    </div>
  );
}
