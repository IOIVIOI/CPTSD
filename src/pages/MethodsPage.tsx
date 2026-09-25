import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { methods } from "../data/methods";
import type { Method } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  A: "危机与闪回",
  B: "内在批判者",
  C: "哀悼与情绪",
  D: "自我关怀",
  E: "关系与界限",
  F: "自我认知",
  G: "康复框架",
};

const TOOL_ROUTES: Record<string, string> = {
  home: "/",
  rescue: "/rescue",
  critic: "/critic",
  grieve: "/grieve",
  learn: "/learn",
  methods: "/methods",
};

function getToolRoute(method: Method): string | null {
  if (method.page === "methods" && method.id !== "A01") {
    return null;
  }

  return TOOL_ROUTES[method.page] ?? null;
}

export function MethodsPage() {
  const { inspectText } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);

  const filteredMethods = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");

    return methods.filter((method) => {
      const matchesCategory = category === "ALL" || method.category === category;
      const matchesQuery =
        !normalizedQuery ||
        method.id.toLocaleLowerCase("zh-CN").includes(normalizedQuery) ||
        method.name.toLocaleLowerCase("zh-CN").includes(normalizedQuery) ||
        method.one_liner.toLocaleLowerCase("zh-CN").includes(normalizedQuery) ||
        method.when_to_use.toLocaleLowerCase("zh-CN").includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  if (selectedMethod) {
    const route = getToolRoute(selectedMethod);

    return (
      <div className="page methods-page">
        <button
          className="text-link method-back"
          type="button"
          onClick={() => setSelectedMethod(null)}
        >
          返回方法库
        </button>

        <article className="method-detail glass-panel">
          <div className="method-detail-header">
            <div>
              <p className="eyebrow">
                {selectedMethod.id} · {selectedMethod.category_label}
              </p>
              <h1>{selectedMethod.name}</h1>
            </div>
            <span className="method-badge">
              {selectedMethod.confidence === "high" ? "原文明确" : "归纳整理"}
            </span>
          </div>
          <p className="method-detail-lead">{selectedMethod.one_liner}</p>

          <section className="method-detail-section">
            <h2>什么时候用</h2>
            <p>{selectedMethod.when_to_use}</p>
          </section>

          <section className="method-detail-section">
            <h2>方法步骤</h2>
            <ol className="method-steps">
              {selectedMethod.steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {selectedMethod.trigger_signals.length > 0 && (
            <section className="method-detail-section">
              <h2>可能的触发信号</h2>
              <ul className="tag-list">
                {selectedMethod.trigger_signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="method-detail-section source-section">
            <h2>内容来源</h2>
            <p>{selectedMethod.source}</p>
            <p className="field-hint">
              方法内容来自项目整理的书本资料，不构成诊断、治疗或医疗建议。
            </p>
          </section>

          <div className="card-actions">
            {route ? (
              <Link className="button button-primary" to={route}>
                打开对应工具
              </Link>
            ) : (
              <span className="coming-next">
                当前为只读参考；对应交互工具属于后续范围。
              </span>
            )}
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setSelectedMethod(null)}
            >
              继续浏览
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="page methods-page">
      <section className="page-intro glass-panel" aria-labelledby="methods-title">
        <p className="eyebrow">方法库 · 29 个方法</p>
        <h1 id="methods-title">需要时再来找，不需要一次读完。</h1>
        <p>
          这里是只读参考。交互工具用于当下执行，方法库用于理解背景、步骤和来源。
        </p>

        <div className="method-search">
          <label htmlFor="method-query">搜索方法</label>
          <input
            id="method-query"
            className="text-input"
            value={query}
            placeholder="输入方法名、编号或使用场景"
            onChange={(event) => {
              const value = event.target.value;
              if (!inspectText(value)) {
                setQuery(value);
              }
            }}
          />
        </div>
      </section>

      <section className="method-browser" aria-labelledby="method-list-title">
        <div className="method-filters" aria-label="方法分类">
          <button
            className={category === "ALL" ? "is-active" : ""}
            type="button"
            aria-pressed={category === "ALL"}
            onClick={() => setCategory("ALL")}
          >
            全部
          </button>
          {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
            <button
              key={id}
              className={category === id ? "is-active" : ""}
              type="button"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
            >
              <span>{id}</span>
              {label}
            </button>
          ))}
        </div>

        <div className="method-list-heading">
          <h2 id="method-list-title">
            {category === "ALL"
              ? "全部方法"
              : `${category} · ${CATEGORY_LABELS[category]}`}
          </h2>
          <span>{filteredMethods.length} 个结果</span>
        </div>

        {filteredMethods.length > 0 ? (
          <div className="method-grid">
            {filteredMethods.map((method) => (
              <button
                key={method.id}
                className="method-card"
                type="button"
                onClick={() => setSelectedMethod(method)}
              >
                <div className="method-card-top">
                  <span className="method-id">{method.id}</span>
                  <span className="method-category">
                    {CATEGORY_LABELS[method.category]}
                  </span>
                </div>
                <h3>{method.name}</h3>
                <p>{method.one_liner}</p>
                <small>{method.tool}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            <h3>没有找到对应方法</h3>
            <p>可以换一个编号、关键词，或清除分类筛选。</p>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("ALL");
              }}
            >
              清除筛选
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
