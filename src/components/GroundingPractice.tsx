import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleCheck, ScanLine, Waves, Wind, X } from "lucide-react";
import { useApp } from "../context/AppContext";

type GroundingStage = "orient" | "breathe" | "scan" | "done";

const BREATH_TOTAL_SECONDS = 36;
const BREATH_PATTERN = [
  { label: "吸气", seconds: 4 },
  { label: "停留", seconds: 2 },
  { label: "呼气", seconds: 6 },
];

const BODY_SCAN_PROMPTS = [
  "把注意力放在双脚，感受地面或座椅的支撑。",
  "轻轻注意双腿，不需要改变什么。",
  "注意腹部随着呼吸起伏。",
  "放松肩膀和下颌，能做多少就做多少。",
  "看看房间里三个不会伤害你的物品。",
];

function getBreathPhase(second: number) {
  const position = second % 12;

  if (position < 4) {
    return { ...BREATH_PATTERN[0], phaseSecond: position };
  }

  if (position < 6) {
    return { ...BREATH_PATTERN[1], phaseSecond: position - 4 };
  }

  return { ...BREATH_PATTERN[2], phaseSecond: position - 6 };
}

export function GroundingPractice() {
  const { groundingRequest, closeGrounding, completeGrounding } = useApp();
  const [stage, setStage] = useState<GroundingStage>("orient");
  const [breathSecond, setBreathSecond] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);

  useEffect(() => {
    if (groundingRequest) {
      setStage("orient");
      setBreathSecond(0);
      setScanIndex(0);
    }
  }, [groundingRequest]);

  useEffect(() => {
    if (stage !== "breathe") {
      return;
    }

    const timer = window.setInterval(() => {
      setBreathSecond((current) => Math.min(current + 1, BREATH_TOTAL_SECONDS));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage === "breathe" && breathSecond >= BREATH_TOTAL_SECONDS) {
      setStage("scan");
    }
  }, [breathSecond, stage]);

  const breathPhase = useMemo(
    () => getBreathPhase(Math.min(breathSecond, BREATH_TOTAL_SECONDS - 1)),
    [breathSecond],
  );

  if (!groundingRequest) {
    return null;
  }

  const progressLabel = `${Math.min(breathSecond + 1, BREATH_TOTAL_SECONDS)} / ${BREATH_TOTAL_SECONDS} 秒`;

  return (
    <div className="grounding-overlay" role="dialog" aria-modal="true">
      <div className="grounding-panel">
        <div className="grounding-topbar">
          <div>
            <p className="eyebrow">A04 · 接地</p>
            <h1>{groundingRequest.purpose}</h1>
          </div>
          <button
            className="button button-quiet button-compact"
            type="button"
            onClick={closeGrounding}
          >
            <X size={17} aria-hidden="true" />
            <span>停止</span>
          </button>
        </div>

        {stage === "orient" && (
          <section className="grounding-stage" aria-labelledby="orient-title">
            <h2 id="orient-title">先不用做对，只是回到身体</h2>
            <p className="large-copy">
              如果可以，把双脚放在地面上，或让身体靠着椅背、墙面、枕头。看看周围，找一个此刻不会伤害你的东西。
            </p>
            <button
              className="button button-primary button-wide"
              type="button"
              onClick={() => setStage("breathe")}
            >
              <Wind size={18} aria-hidden="true" />
              <span>开始 3 次慢呼吸</span>
            </button>
            <button
              className="button button-quiet button-wide"
              type="button"
              onClick={() => setStage("scan")}
            >
              <ScanLine size={18} aria-hidden="true" />
              <span>直接做身体扫描</span>
            </button>
          </section>
        )}

        {stage === "breathe" && (
          <section className="grounding-stage" aria-labelledby="breathe-title">
            <p className="grounding-progress">{progressLabel}</p>
            <div
              className={`breathing-circle breathing-${breathPhase.label}`}
              aria-hidden="true"
            >
              <span>{breathPhase.label}</span>
            </div>
            <h2 id="breathe-title">
              {breathPhase.label}，还剩 {Math.max(breathPhase.seconds - breathPhase.phaseSecond, 0)} 秒
            </h2>
            <p>不用吸得很深。只要比刚才慢一点，就已经在向身体发送安全信号。</p>
            <button
              className="button button-quiet button-wide"
              type="button"
              onClick={() => setStage("scan")}
            >
              <ScanLine size={18} aria-hidden="true" />
              <span>跳到身体扫描</span>
            </button>
          </section>
        )}

        {stage === "scan" && (
          <section className="grounding-stage" aria-labelledby="scan-title">
            <p className="grounding-progress">
              {scanIndex + 1} / {BODY_SCAN_PROMPTS.length}
            </p>
            <h2 id="scan-title">{BODY_SCAN_PROMPTS[scanIndex]}</h2>
            <p>感受几秒钟就好。走神也没关系，发现后再回来。</p>
            <button
              className="button button-primary button-wide"
              type="button"
              onClick={() => {
                if (scanIndex === BODY_SCAN_PROMPTS.length - 1) {
                  setStage("done");
                  return;
                }

                setScanIndex((current) => current + 1);
              }}
            >
              {scanIndex === BODY_SCAN_PROMPTS.length - 1 ? (
                <>
                  <CircleCheck size={18} aria-hidden="true" />
                  <span>完成接地</span>
                </>
              ) : (
                <>
                  <span>下一处</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </section>
        )}

        {stage === "done" && (
          <section className="grounding-stage" aria-labelledby="done-title">
            <h2 id="done-title">你已经给自己一点空间</h2>
            <p className="large-copy">
              不需要感觉完全变好。能停下来做这一小段，已经是在照顾自己。
            </p>
            <button
              className="button button-primary button-wide"
              type="button"
              onClick={completeGrounding}
            >
              <Waves size={18} aria-hidden="true" />
              <span>
                {groundingRequest.required ? "继续刚才的流程" : "回到页面"}
              </span>
            </button>
            <button
              className="button button-quiet button-wide"
              type="button"
              onClick={closeGrounding}
            >
              先停在这里
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
