import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IntensitySlider } from "../components/IntensitySlider";
import { useApp } from "../context/AppContext";
import { rescueSteps } from "../data/rescueSteps";
import type { FlashbackSession } from "../types";

type RescuePhase =
  | "intensity-before"
  | "grounding-offer"
  | "steps"
  | "intensity-after"
  | "complete";

function createId(): string {
  return crypto.randomUUID();
}

export function RescuePage() {
  const {
    addSession,
    inspectText,
    openGrounding,
  } = useApp();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<RescuePhase>("intensity-before");
  const [intensityBefore, setIntensityBefore] = useState(50);
  const [intensityAfter, setIntensityAfter] = useState(50);
  const [triggerText, setTriggerText] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [grounded, setGrounded] = useState(false);
  const startedAt = useRef(new Date().toISOString());
  const sessionId = useRef(createId());

  const currentStep = rescueSteps[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / rescueSteps.length) * 100),
    [stepIndex],
  );

  const persistSession = (nextIntensityAfter: number) => {
    const session: FlashbackSession = {
      id: sessionId.current,
      started_at: startedAt.current,
      ended_at: new Date().toISOString(),
      triggers: triggerText.trim() ? [triggerText.trim()] : [],
      steps_completed: completedSteps,
      intensity_before: intensityBefore,
      intensity_after: nextIntensityAfter,
      grounded,
    };

    addSession(session);
    setIntensityAfter(nextIntensityAfter);
    setPhase("complete");
  };

  const stopForNow = () => {
    if (phase === "steps" || phase === "intensity-after") {
      const session: FlashbackSession = {
        id: sessionId.current,
        started_at: startedAt.current,
        ended_at: new Date().toISOString(),
        triggers: triggerText.trim() ? [triggerText.trim()] : [],
        steps_completed: completedSteps,
        intensity_before: intensityBefore,
        intensity_after: intensityAfter,
        grounded,
      };
      addSession(session);
    }

    navigate("/");
  };

  const beginGrounding = () => {
    openGrounding("闪回急救前，先回到身体", true, () => {
      setGrounded(true);
      setPhase("steps");
    });
  };

  const goNext = () => {
    const nextCompleted = completedSteps.includes(currentStep.number)
      ? completedSteps
      : [...completedSteps, currentStep.number];
    setCompletedSteps(nextCompleted);

    if (stepIndex === rescueSteps.length - 1) {
      setPhase("intensity-after");
      return;
    }

    setStepIndex((current) => current + 1);
  };

  const goSkip = () => {
    if (stepIndex === rescueSteps.length - 1) {
      setPhase("intensity-after");
      return;
    }

    setStepIndex((current) => current + 1);
  };

  if (phase === "intensity-before") {
    return (
      <div className="page rescue-page">
        <section className="flow-shell" aria-labelledby="rescue-title">
          <p className="eyebrow">A01 · 闪回急救</p>
          <h1 id="rescue-title">先记下此刻有多强烈</h1>
          <p className="flow-lead">
            不需要准确。给出一个大致数字，等走完流程后再看一次。
          </p>

          <IntensitySlider
            id="intensity-before"
            label="此刻的情绪强度"
            value={intensityBefore}
            onChange={setIntensityBefore}
            hint="0 表示很平稳，100 表示非常强烈。"
          />

          <div className="field-block">
            <label htmlFor="trigger-note">
              如果有明确的诱因，可以写一句。写不出也可以跳过。
            </label>
            <textarea
              id="trigger-note"
              className="safe-textarea"
              value={triggerText}
              rows={3}
              maxLength={240}
              placeholder="例如：刚刚被一句批评触发"
              onChange={(event) => {
                const nextValue = event.target.value;
                if (inspectText(nextValue)) {
                  return;
                }
                setTriggerText(nextValue);
              }}
            />
          </div>

          <button
            className="button button-primary button-wide"
            type="button"
            onClick={() => {
              if (inspectText(triggerText)) {
                return;
              }
              setPhase("grounding-offer");
            }}
          >
            继续
          </button>
          <button
            className="button button-quiet button-wide"
            type="button"
            onClick={stopForNow}
          >
            停止并回到首页
          </button>
        </section>
      </div>
    );
  }

  if (phase === "grounding-offer") {
    return (
      <div className="page rescue-page">
        <section className="flow-shell safety-first-card" aria-labelledby="ground-first-title">
          <p className="eyebrow">安全优先</p>
          <h1 id="ground-first-title">先接地，再进入 13 步</h1>
          <p className="flow-lead">
            闪回时容易“上头”。先把脚、呼吸和周围环境找回来，再继续会更稳。
          </p>
          <button
            className="button button-grounding button-wide"
            type="button"
            onClick={beginGrounding}
          >
            开始接地练习
          </button>
          <button
            className="button button-quiet button-wide"
            type="button"
            onClick={stopForNow}
          >
            现在先停下
          </button>
        </section>
      </div>
    );
  }

  if (phase === "steps") {
    return (
      <div className="page rescue-page">
        <section className="rescue-flow" aria-labelledby="step-title">
          <div className="flow-topbar">
            <div>
              <p className="eyebrow">闪回急救</p>
              <p className="step-counter">
                第 {currentStep.number} 步，共 {rescueSteps.length} 步
              </p>
            </div>
            <button
              className="button button-stop"
              type="button"
              onClick={stopForNow}
            >
              停止
            </button>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="闪回急救进度"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="step-panel" aria-live="polite">
            <span className="step-number">{currentStep.number}</span>
            <h1 id="step-title">{currentStep.title}</h1>
            <p className="step-detail">{currentStep.detail}</p>

            {currentStep.bullets && (
              <ul className="step-bullets">
                {currentStep.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}

            {currentStep.note && (
              <p className="step-note">{currentStep.note}</p>
            )}

            {currentStep.number === 8 && (
              <Link className="text-link inline-link" to="/critic">
                进入内在批判者挑战
              </Link>
            )}
            {currentStep.number === 9 && (
              <Link className="text-link inline-link" to="/grieve">
                进入确定性版哀悼引导
              </Link>
            )}
            {currentStep.number === 12 && (
              <Link className="text-link inline-link" to="/learn">
                了解闪回与创伤反应
              </Link>
            )}
          </div>

          <button
            className="button button-grounding button-wide"
            type="button"
            onClick={() => openGrounding("随时回到身体")}
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
              onClick={goSkip}
            >
              跳过
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={goNext}
            >
              {stepIndex === rescueSteps.length - 1 ? "完成步骤" : "下一步"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (phase === "intensity-after") {
    return (
      <div className="page rescue-page">
        <section className="flow-shell" aria-labelledby="after-title">
          <p className="eyebrow">完成 13 步</p>
          <h1 id="after-title">再看一次此刻的强度</h1>
          <p className="flow-lead">
            不要求明显下降。即使只松动了一点，也值得被看见。
          </p>

          <IntensitySlider
            id="intensity-after"
            label="现在的情绪强度"
            value={intensityAfter}
            onChange={setIntensityAfter}
          />

          <button
            className="button button-primary button-wide"
            type="button"
            onClick={() => persistSession(intensityAfter)}
          >
            保存这次急救
          </button>
          <button
            className="button button-quiet button-wide"
            type="button"
            onClick={stopForNow}
          >
            先不保存，停止并回首页
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page rescue-page">
      <section className="flow-shell completion-shell" aria-labelledby="complete-title">
        <p className="eyebrow">这次急救已记录</p>
        <h1 id="complete-title">你刚刚把自己带回了一点当下</h1>
        <p className="flow-lead">
          强度从 {intensityBefore} 变成 {intensityAfter}。闪回可能会反复，这不代表你失败了。
        </p>
        <p className="saved-note">
          记录只保存在这台设备上。如果此刻仍然很不稳，可以继续接地，或联系可信任的人。
        </p>
        <button
          className="button button-grounding button-wide"
          type="button"
          onClick={() => openGrounding("再做一段接地")}
        >
          继续接地
        </button>
        <Link className="button button-primary button-wide button-link" to="/">
          回到安全首页
        </Link>
      </section>
    </div>
  );
}
