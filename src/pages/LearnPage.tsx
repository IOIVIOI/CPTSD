import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { fourFProfiles, recoverySigns } from "../data/learnContent";

type GratitudeCategory = "感激自己" | "感激他人" | "生活中的一点好";

function createId(): string {
  return crypto.randomUUID();
}

export function LearnPage() {
  const {
    addEntry,
    entries,
    fourFSelections,
    inspectText,
    openGrounding,
    recoverySelections,
    toggleFourFSelection,
    toggleRecoverySelection,
  } = useApp();
  const [gratitudeCategory, setGratitudeCategory] =
    useState<GratitudeCategory>("感激自己");
  const [gratitudeText, setGratitudeText] = useState("");

  const gratitudeEntries = entries.filter((entry) => entry.kind === "gratitude");

  const saveGratitude = () => {
    if (!gratitudeText.trim() || inspectText(gratitudeText)) {
      return;
    }

    addEntry({
      id: createId(),
      kind: "gratitude",
      raw_text: `${gratitudeCategory}：${gratitudeText.trim()}`,
      rewritten_text: null,
      critic_attack_type: null,
      intensity_before: null,
      intensity_after: null,
      created_at: new Date().toISOString(),
    });
    setGratitudeText("");
  };

  return (
    <div className="page learn-page">
      <section className="page-intro glass-panel" aria-labelledby="learn-title">
        <p className="eyebrow">F / G · 了解自己</p>
        <h1 id="learn-title">理解反应，不是给自己贴诊断标签。</h1>
        <p>
          这些内容用于自我理解和减少羞耻。4F 反应是创伤后形成的适应方式，不是固定人格，也不能替代专业评估。
        </p>
        <div className="safety-callout warm-safety-callout">
          <strong>如果在闪回中</strong>
          <p>
            先不要做感恩或反思练习。回到 <Link to="/rescue">闪回急救</Link> 或先接地，等稳定后再回来。
          </p>
        </div>
      </section>

      <section className="learn-section" id="four-f" aria-labelledby="four-f-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">F01 · 非诊断自评</p>
            <h2 id="four-f-title">我常用哪一种 4F 反应？</h2>
          </div>
          <span className="section-badge">可以多选</span>
        </div>
        <p className="section-lead">
          选出现在更常出现的一到几种即可。多数人都是混合型，而且会在不同关系或压力下变化。
        </p>

        <div className="fourf-grid">
          {fourFProfiles.map((profile) => {
            const selected = fourFSelections.includes(profile.id);

            return (
              <article
                key={profile.id}
                className={`fourf-card fourf-${profile.id} ${
                  selected ? "is-selected" : ""
                }`}
              >
                <div className="fourf-title">
                  <span>{profile.letter}</span>
                  <div>
                    <h3>
                      {profile.name}
                      <small>{profile.defense}</small>
                    </h3>
                  </div>
                </div>
                <p>{profile.summary}</p>
                <ul>
                  {profile.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
                <div className="fourf-detail">
                  <p>
                    <strong>原本的力量：</strong>
                    {profile.strength}
                  </p>
                  <p>
                    <strong>康复方向：</strong>
                    {profile.direction}
                  </p>
                </div>
                <button
                  className={`button ${
                    selected ? "button-primary" : "button-secondary"
                  } button-wide`}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleFourFSelection(profile.id)}
                >
                  {selected ? "已选：更像此刻的我" : "选为此刻的倾向"}
                </button>
              </article>
            );
          })}
        </div>

        {fourFSelections.length > 0 && (
          <p className="selection-summary" role="status">
            你已经选择了 {fourFSelections.length} 种倾向。它们不是缺陷，也不是不可改变的标签。
          </p>
        )}
      </section>

      <section className="learn-section" aria-labelledby="shame-title">
        <div className="info-card-grid">
          <article className="education-card shame-card">
            <p className="eyebrow">F02 · 毒性羞耻</p>
            <h2 id="shame-title">羞耻感是闪回的表象，不是事实。</h2>
            <p>
              突然觉得“我就是不好、有缺陷、不配被爱”时，可能不是客观结论，而是内化的指责重新被触发。
            </p>
            <ol className="compact-steps">
              <li>先认出：此刻的羞耻感可能来自闪回。</li>
              <li>对内在批判者说“不、停下”。</li>
              <li>把不公平的指责还给真正羞辱过你的人。</li>
              <li>提醒自己：没有伤害别人，就不需要因正常感受而羞耻。</li>
            </ol>
            <div className="card-actions">
              <Link className="button button-primary" to="/critic">
                进入批判者挑战
              </Link>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => openGrounding("离开羞耻的闪回")}
              >
                先接地
              </button>
            </div>
          </article>

          <article className="education-card reality-card">
            <p className="eyebrow">F04 · 闪回与事实</p>
            <h2>感觉危险，不等于此刻真的有危险。</h2>
            <p>
              强烈恐惧会让身体像仍在过去一样反应。先确认现实环境，再判断这份害怕有多大程度来自旧记忆。
            </p>
            <div className="reality-check">
              <span>童年真的危险</span>
              <strong>≠</strong>
              <span>此刻正在发生</span>
            </div>
            <p className="field-hint">
              如果此刻确实有暴力、威胁或无法安全离开的情况，先求助，不要用这条提示压过现实危险。
            </p>
            <div className="card-actions">
              <Link className="button button-primary" to="/rescue">
                进入闪回急救
              </Link>
              <a className="button button-danger" href="tel:110">
                拨打 110
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="learn-section" aria-labelledby="gratitude-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">F03 · 不在闪回时做</p>
            <h2 id="gratitude-title">感恩清单</h2>
          </div>
          <span className="section-badge warm-badge">不强迫积极</span>
        </div>
        <p className="section-lead">
          感恩不是否认痛苦，也不是要求自己永远积极。只是留意一件真实、具体、此刻愿意承认的好。
        </p>

        <div className="gratitude-shell">
          <div className="segmented-control" aria-label="感恩清单分类">
            {(
              ["感激自己", "感激他人", "生活中的一点好"] as GratitudeCategory[]
            ).map((category) => (
              <button
                key={category}
                className={gratitudeCategory === category ? "is-active" : ""}
                type="button"
                aria-pressed={gratitudeCategory === category}
                onClick={() => setGratitudeCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="inline-form gratitude-form">
            <label className="sr-only" htmlFor="gratitude-input">
              写下一件值得感激的事
            </label>
            <input
              id="gratitude-input"
              className="text-input"
              value={gratitudeText}
              maxLength={180}
              placeholder="写一件具体、真实的小事"
              onChange={(event) => {
                const value = event.target.value;
                if (!inspectText(value)) {
                  setGratitudeText(value);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  saveGratitude();
                }
              }}
            />
            <button
              className="button button-primary"
              type="button"
              disabled={!gratitudeText.trim()}
              onClick={saveGratitude}
            >
              保存
            </button>
          </div>
        </div>

        {gratitudeEntries.length > 0 ? (
          <ul className="gratitude-list">
            {gratitudeEntries.slice(0, 12).map((entry) => (
              <li key={entry.id}>{entry.raw_text}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-note">清单还是空的，想到一点再写就好。</p>
        )}
      </section>

      <section className="learn-section recovery-section" aria-labelledby="recovery-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">G02 · 康复迹象</p>
            <h2 id="recovery-title">进展不是“全或无”</h2>
          </div>
          <span className="section-badge">
            已选 {recoverySelections.length} / {recoverySigns.length}
          </span>
        </div>
        <p className="section-lead">
          只选择最近确实出现过一点点的迹象。哪怕只是更早觉察，也算进展。
        </p>
        <div className="recovery-list">
          {recoverySigns.map((sign) => {
            const selected = recoverySelections.includes(sign.id);

            return (
              <button
                key={sign.id}
                className={`recovery-item ${selected ? "is-selected" : ""}`}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleRecoverySelection(sign.id)}
              >
                <span>{sign.id}</span>
                <div>
                  <strong>{sign.title}</strong>
                  <p>{sign.detail}</p>
                </div>
                <em>{selected ? "有了一点" : "选择"}</em>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
