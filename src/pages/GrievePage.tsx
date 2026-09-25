import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  grievingModes,
  type GrievingMode,
  type GrievingModeId,
} from "../data/grievingModes";

type GrievePhase = "select" | "guide" | "complete";

function createId(): string {
  return crypto.randomUUID();
}

export function GrievePage() {
  const { addEntry, inspectText, openGrounding } = useApp();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GrievePhase>("select");
  const [selectedModeId, setSelectedModeId] =
    useState<GrievingModeId | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [expression, setExpression] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedMode = grievingModes.find(
    (mode) => mode.id === selectedModeId,
  );

  const beginMode = (mode: GrievingMode) => {
    openGrounding(`${mode.name}前，先确认此刻安全`, true, () => {
      setSelectedModeId(mode.id);
      setStepIndex(0);
      setExpression("");
      setSaved(false);
      setPhase("guide");
    });
  };

  const saveExpression = () => {
    if (!expression.trim() || inspectText(expression)) {
      return;
    }

    addEntry({
      id: createId(),
      kind: "feeling",
      raw_text: expression.trim(),
      rewritten_text: null,
      critic_attack_type: null,
      intensity_before: null,
      intensity_after: null,
      created_at: new Date().toISOString(),
    });
    setSaved(true);
  };

  const stop = () => navigate("/");

  if (phase === "select") {
    return (
      <div className="page grieve-page">
        <section className="page-intro glass-panel" aria-labelledby="grieve-title">
          <p className="eyebrow">C01 · 哀悼与情绪</p>
          <h1 id="grieve-title">情绪有出口，但不需要被逼着出来。</h1>
          <p>
            哀悼不是抱怨，也不等于要马上放下。你只需要选择一种此刻做得到的方式，做一点点就够。
          </p>
          <div className="safety-callout warm-safety-callout">
            <strong>开始前先说清楚</strong>
            <p>
              这里不引导你回忆创伤细节。任何时刻都可以停止，也可以先接地。若情绪太强、身体开始解离，或出现自伤想法，立刻停下并联系可信任的人或专业支持。
            </p>
          </div>
          <button
            className="button button-grounding"
            type="button"
            onClick={() => openGrounding("哀悼前，先回到身体")}
          >
            先做一段接地
          </button>
        </section>

        <section className="mode-section" aria-labelledby="mode-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">选择一种方式</p>
              <h2 id="mode-title">现在哪一种更接近你的需要？</h2>
            </div>
          </div>
          <div className="mode-grid">
            {grievingModes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-card mode-${mode.id}`}
                type="button"
                onClick={() => beginMode(mode)}
              >
                <span>{mode.shortName}</span>
                <strong>{mode.name}</strong>
                <p>{mode.oneLiner}</p>
                <small>{mode.whenToUse}</small>
              </button>
            ))}
          </div>
        </section>

        <p className="page-note">
          如果现在正处在强烈闪回中，先回到 <Link to="/rescue">闪回急救</Link>，不用急着哀悼。
        </p>
      </div>
    );
  }

  if (phase === "guide" && selectedMode) {
    const isLast = stepIndex === selectedMode.steps.length - 1;

    return (
      <div className="page grieve-page">
        <section className="guided-shell glass-panel" aria-labelledby="guide-title">
          <div className="flow-topbar">
            <div>
              <p className="eyebrow">{selectedMode.name}</p>
              <p className="step-counter">
                第 {stepIndex + 1} 步，共 {selectedMode.steps.length} 步
              </p>
            </div>
            <button className="button button-stop" type="button" onClick={stop}>
              停止
            </button>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              ((stepIndex + 1) / selectedMode.steps.length) * 100,
            )}
            aria-label="哀悼引导进度"
          >
            <span
              style={{
                width: `${Math.round(
                  ((stepIndex + 1) / selectedMode.steps.length) * 100,
                )}%`,
              }}
            />
          </div>

          <div className="guided-step" aria-live="polite">
            <span className="step-number">{stepIndex + 1}</span>
            <h1 id="guide-title">{selectedMode.steps[stepIndex]}</h1>
          </div>

          <div className="safety-callout warm-safety-callout">
            <strong>安全提醒</strong>
            <p>{selectedMode.safetyNote}</p>
          </div>

          <button
            className="button button-grounding button-wide"
            type="button"
            onClick={() => openGrounding("哀悼中随时接地")}
          >
            我现在需要接地
          </button>

          <div className="flow-actions">
            <button
              className="button button-quiet"
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            >
              上一步
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={stop}
            >
              先停一下
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                if (isLast) {
                  setPhase("complete");
                  return;
                }

                setStepIndex((current) => current + 1);
              }}
            >
              {isLast ? "完成这一小段" : "下一步"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page grieve-page">
      <section className="completion-shell glass-panel" aria-labelledby="grieve-done-title">
        <p className="eyebrow">这一小段结束了</p>
        <h1 id="grieve-done-title">你可以停在这里</h1>
        <p className="flow-lead">
          情绪有没有完全释放都不重要。你允许自己靠近它一点，已经是在恢复情绪流动。
        </p>

        <div className="field-block">
          <label htmlFor="grieving-expression">
            如果愿意，可以留下一句此刻的感受。不要写创伤细节。
          </label>
          <textarea
            id="grieving-expression"
            className="safe-textarea"
            rows={3}
            maxLength={300}
            value={expression}
            placeholder="例如：我很难过，也有点生气。"
            onChange={(event) => {
              const value = event.target.value;
              if (inspectText(value)) {
                return;
              }
              setExpression(value);
              setSaved(false);
            }}
          />
        </div>

        <button
          className="button button-secondary button-wide"
          type="button"
          disabled={!expression.trim() || saved}
          onClick={saveExpression}
        >
          {saved ? "已经保存在本机" : "保存这一句"}
        </button>
        <button
          className="button button-grounding button-wide"
          type="button"
          onClick={() => openGrounding("哀悼后，重新回到当下")}
        >
          再做一次接地
        </button>
        <Link className="button button-primary button-wide button-link" to="/">
          回到安全首页
        </Link>
      </section>
    </div>
  );
}
