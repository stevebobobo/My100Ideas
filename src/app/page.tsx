"use client";

import { useState, useMemo, useEffect } from "react";
import ideasData from "@/data/ideas.json";
import type { Idea } from "@/types/idea";
import {
  TargetIcon,
  LightbulbIcon,
  RecordedIcon,
  HourglassIcon,
  RocketIcon,
  CheckCircleIcon,
  MonumentIcon,
  SearchIcon,
  SparklesIcon,
  GlobeIcon,
  CarIcon,
  CpuIcon,
  BotIcon,
  BriefcaseIcon,
  WrenchIcon,
  MusicIcon,
  GridIcon,
  TimelineIcon,
  TableIcon,
  CalendarIcon,
  VideoIcon,
  PaperclipIcon,
  PinIcon,
  ZapIcon,
  GiftIcon,
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  ArrowUpRightIcon,
} from "@/components/Icons";

const ideas = ideasData as Idea[];

const statusPlainLabels: Record<Idea["status"], string> = {
  idea: "想法",
  recorded: "已記錄",
  "not-implemented": "尚未實作",
  "in-progress": "進行中",
  completed: "已完成",
  missed: "錯過遺憾",
};

function StatusIcon({ status, size = 14 }: { status: Idea["status"]; size?: number }) {
  switch (status) {
    case "idea":
      return <LightbulbIcon size={size} />;
    case "recorded":
      return <RecordedIcon size={size} />;
    case "not-implemented":
      return <HourglassIcon size={size} />;
    case "in-progress":
      return <RocketIcon size={size} />;
    case "completed":
      return <CheckCircleIcon size={size} />;
    case "missed":
      return <MonumentIcon size={size} />;
  }
}

const statusClasses: Record<Idea["status"], string> = {
  idea: "status-idea",
  recorded: "status-recorded",
  "not-implemented": "status-not-implemented",
  "in-progress": "status-in-progress",
  completed: "status-completed",
  missed: "status-missed",
};

const DOMAIN_CATEGORIES = [
  { id: "all", label: "全部領域", icon: GlobeIcon, keywords: [] },
  { id: "traffic", label: "智慧交通", icon: CarIcon, keywords: ["交通", "行車", "單車", "自行車", "方向燈", "汽機車", "車用"] },
  { id: "maker", label: "舊物創客", icon: CpuIcon, keywords: ["舊手機", "舊物", "隨身電腦", "嵌入式", "網路測試", "硬體", "迷你電腦"] },
  { id: "ai", label: "AI 智慧應用", icon: BotIcon, keywords: ["AI", "Bot", "機器人", "智慧"] },
  { id: "saas", label: "企業與醫療 SaaS", icon: BriefcaseIcon, keywords: ["企業", "薪資", "特休", "排班", "掛號", "對帳", "金流", "醫療", "診所", "病房", "HR", "假別"] },
  { id: "life", label: "生活機構發明", icon: WrenchIcon, keywords: ["雨衣", "雨具", "吸塵器", "清潔", "打蛋", "照明", "發光", "餐具", "包包", "馬達", "生活", "機構", "洗潔槍"] },
  { id: "music", label: "音樂文化跨界", icon: MusicIcon, keywords: ["音樂", "台語", "和弦", "Mashup", "串燒", "歌曲"] },
];

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline" | "table">("grid");
  const [activeIdea, setActiveIdea] = useState<Idea | null>(null);

  // 雙模式主題切換 (預設亮色系)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("my100ideas_theme") as "light" | "dark" | null;
    const initialTheme = saved || "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("my100ideas_theme", nextTheme);
  };

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

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ideas.length };
    DOMAIN_CATEGORIES.forEach((cat) => {
      if (cat.id === "all") return;
      counts[cat.id] = ideas.filter((idea) =>
        idea.categories.some((c) => cat.keywords.some((kw) => c.includes(kw))) ||
        cat.keywords.some((kw) => idea.title.includes(kw))
      ).length;
    });
    return counts;
  }, []);

  // Filtered Ideas
  const filteredIdeas = useMemo(() => {
    const activeCat = DOMAIN_CATEGORIES.find((c) => c.id === selectedCategory);
    return ideas.filter((idea) => {
      const matchesStatus =
        selectedStatus === "all" || idea.status === selectedStatus;
      const matchesCategory =
        !activeCat ||
        activeCat.id === "all" ||
        idea.categories.some((c) => activeCat.keywords.some((kw) => c.includes(kw))) ||
        activeCat.keywords.some((kw) => idea.title.includes(kw));
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.summary.toLowerCase().includes(q) ||
        idea.problem.toLowerCase().includes(q) ||
        idea.categories.some((c) => c.toLowerCase().includes(q));
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

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
          <div className="brand-icon">
            <LightbulbIcon size={20} className="ui-icon-gold" />
          </div>
          <span>
            <span className="brand-title-blue">My100</span>
            <span className="brand-title-gold">Ideas</span>
          </span>
        </div>

        <div className="header-actions">
          {/* 主題切換按鈕 */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "light" ? "切換為暗黑模式" : "切換為明亮模式"}
          >
            {theme === "light" ? (
              <>
                <MoonIcon size={15} />
                <span>暗色</span>
              </>
            ) : (
              <>
                <SunIcon size={15} className="ui-icon-gold" />
                <span>亮色</span>
              </>
            )}
          </button>

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
          <SparklesIcon size={15} className="ui-icon-gold" />
          <span>靈感博物館 & 點子檔案庫</span>
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
              <TargetIcon size={20} className="ui-icon-gold" />
              <span>100 創意解鎖進度矩陣</span>
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
                      ? `#${slot.idea.id}: ${slot.idea.title} (${statusPlainLabels[slot.idea.status]})`
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
              <div className="stat-lbl">
                <LightbulbIcon size={15} className="ui-icon-gold" /> 想法紀錄
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-slate">{stats["not-implemented"]}</div>
              <div className="stat-lbl">
                <HourglassIcon size={15} className="ui-icon-slate" /> 尚未實作
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-blue">{stats["in-progress"]}</div>
              <div className="stat-lbl">
                <RocketIcon size={15} className="ui-icon-blue" /> 熱血進行中
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-emerald">{stats.completed}</div>
              <div className="stat-lbl">
                <CheckCircleIcon size={15} className="ui-icon-emerald" /> 完美實現
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-val stat-val-red">{stats.missed}</div>
              <div className="stat-lbl">
                <MonumentIcon size={15} className="ui-icon-red" /> 錯過的遺憾
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Filters */}
      <section className="controls-bar">
        <div className="search-input-wrap">
          <SearchIcon size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="搜尋創意名稱、痛點、結果或關鍵字..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Domain Category Filter Tabs */}
        <div className="category-bar">
          <div className="category-tabs">
            {DOMAIN_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              if (cat.id !== "all" && count === 0) return null;
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <CatIcon size={15} />
                  <span>{cat.label}</span>
                  <span className="cat-count">({count})</span>
                </button>
              );
            })}
          </div>
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
              <RecordedIcon size={14} /> <span>已記錄 ({stats.recorded})</span>
            </button>
            <button
              className={`filter-tab ${selectedStatus === "not-implemented" ? "active" : ""}`}
              onClick={() => setSelectedStatus("not-implemented")}
            >
              <HourglassIcon size={14} /> <span>尚未實作 ({stats["not-implemented"]})</span>
            </button>
            <button
              className={`filter-tab ${selectedStatus === "in-progress" ? "active" : ""}`}
              onClick={() => setSelectedStatus("in-progress")}
            >
              <RocketIcon size={14} /> <span>進行中 ({stats["in-progress"]})</span>
            </button>
            <button
              className={`filter-tab ${selectedStatus === "completed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("completed")}
            >
              <CheckCircleIcon size={14} /> <span>已完成 ({stats.completed})</span>
            </button>
            <button
              className={`filter-tab tab-red ${selectedStatus === "missed" ? "active" : ""}`}
              onClick={() => setSelectedStatus("missed")}
            >
              <MonumentIcon size={14} /> <span>錯過 ({stats.missed})</span>
            </button>
          </div>

          <div className="view-switchers">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <GridIcon size={14} /> <span>卡片</span>
            </button>
            <button
              className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              <TimelineIcon size={14} /> <span>時間軸</span>
            </button>
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <TableIcon size={14} /> <span>數據表</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {filteredIdeas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#64748b" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "8px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <SearchIcon size={20} /> 找不到符合條件的靈感
          </p>
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
                    <StatusIcon status={idea.status} size={13} />
                    <span>{statusPlainLabels[idea.status]}</span>
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
                  <CalendarIcon size={13} />
                  <span>{idea.conceivedAt}</span>
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
                    <span>線上實作</span>
                    <ArrowUpRightIcon size={13} />
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
                    <CalendarIcon size={14} /> 構思時間：{idea.conceivedAt}
                  </span>
                  <span className={`status-pill ${statusClasses[idea.status]}`}>
                    <StatusIcon status={idea.status} size={13} />
                    <span>{statusPlainLabels[idea.status]}</span>
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
                  <td style={{ fontWeight: "700", color: "var(--text-primary)" }}>{idea.title}</td>
                  <td>
                    <span className={`status-pill ${statusClasses[idea.status]}`}>
                      <StatusIcon status={idea.status} size={13} />
                      <span>{statusPlainLabels[idea.status]}</span>
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: "300px" }}>{idea.summary}</td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {idea.categories.map((c, i) => (
                        <span key={i} className="tag-pill">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{idea.conceivedAt}</td>
                  <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{idea.recordedAt}</td>
                  <td>
                    <button
                      onClick={() => setActiveIdea(idea)}
                      style={{
                        background: "var(--color-blue-light)",
                        border: "1px solid var(--color-blue-border)",
                        color: "var(--color-blue)",
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

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <span className="idea-id-badge mono">{activeIdea.id}</span>
              <span className={`status-pill ${statusClasses[activeIdea.status]}`}>
                <StatusIcon status={activeIdea.status} size={13} />
                <span>{statusPlainLabels[activeIdea.status]}</span>
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <CalendarIcon size={14} /> {activeIdea.conceivedAt}
              </span>
            </div>

            <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-primary)", marginBottom: "12px" }}>
              {activeIdea.title}
            </h2>

            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "20px" }}>
              {activeIdea.summary}
            </p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {activeIdea.categories.map((c, i) => (
                <span key={i} className="tag-pill" style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
                  #{c}
                </span>
              ))}
            </div>

            {/* Problem Section */}
            {activeIdea.problem && (
              <>
                <div className="modal-section-title">
                  <PinIcon size={16} />
                  <span>面臨問題與痛點 (Problem)</span>
                </div>
                <div className="modal-box">{activeIdea.problem}</div>
              </>
            )}

            {/* Process Section */}
            {activeIdea.process && activeIdea.process.length > 0 && (
              <>
                <div className="modal-section-title">
                  <ZapIcon size={16} />
                  <span>運作與實作流程 (Process)</span>
                </div>
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
                <div className="modal-section-title">
                  <GiftIcon size={16} />
                  <span>預期效益 (Benefits)</span>
                </div>
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
                <div className="modal-section-title">
                  <BookOpenIcon size={16} />
                  <span>後續發展與回顧故事 (Outcome)</span>
                </div>
                <div className={activeIdea.status === "missed" ? "outcome-callout" : "outcome-callout outcome-callout-gold"}>
                  {activeIdea.outcome}
                </div>
              </>
            )}

            {/* Video Section */}
            {activeIdea.videoUrl && (
              <div style={{ marginTop: "24px" }}>
                <div className="modal-section-title">
                  <VideoIcon size={16} />
                  <span>展示影片與實機操作 (Video Demo)</span>
                </div>
                {getYouTubeEmbedUrl(activeIdea.videoUrl) ? (
                  <div className="modal-video-wrap">
                    <iframe
                      src={getYouTubeEmbedUrl(activeIdea.videoUrl)!}
                      title={activeIdea.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: "8px" }}>
                    <a
                      href={activeIdea.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="media-link-btn"
                    >
                      <VideoIcon size={16} />
                      <span>點此觀看實機展示影片</span>
                      <ArrowUpRightIcon size={14} />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Attachments Section */}
            {activeIdea.attachments && activeIdea.attachments.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <div className="modal-section-title">
                  <PaperclipIcon size={16} />
                  <span>相關附件與專案檔案 (Attachments)</span>
                </div>
                <div className="modal-attachments-list">
                  {activeIdea.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-btn"
                    >
                      <PaperclipIcon size={14} />
                      <span>{att.name}</span>
                      <ArrowUpRightIcon size={13} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External Demo URL Section */}
            {activeIdea.demoUrl && (
              <div style={{ marginTop: "24px" }}>
                <a
                  href={activeIdea.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-link-btn"
                >
                  <RocketIcon size={16} />
                  <span>前往專案線上實作頁面</span>
                  <ArrowUpRightIcon size={14} />
                </a>
              </div>
            )}

            <div style={{ marginTop: "32px", textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>
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
