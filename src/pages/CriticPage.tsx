import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { criticAttacks } from "../data/criticAttacks";
import type { Entry } from "../types";

type CriticPhase = "write" | "choose" | "rewrite" | "saved";

function createId(): string {
  return crypto.randomUUID();
}

export function CriticPage() {
  const {
    addEntry,
    addStrength,
    blockPhrase,
    inspectText,
    openGrounding,
    removeStrength,
    setBlockPhrase,
    strengths,
  } = useApp();
  const [phase, setPhase] = useState<CriticPhase>("write");
  const [rawText, setRawText] = useState("");
  const [selectedAttackId, setSelectedAttackId] = useState<number | null>(null);
  const [rewrittenText, setRewrittenText] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [blockPhraseDraft, setBlockPhraseDraft] = useState(blockPhrase);
  const [strengthDraft, setStrengthDraft] = useState("");
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);

  const selectedAttack = criticAttacks.find(
    (attack) => attack.id === selectedAttackId,
  );

  const writeAttack = () => {
    if (inspectText(rawText)) {
      return;
    }

    if (!rawText.trim()) {
      return;
    }

    setPhase("choose");
  };

  const chooseAttack = (attackId: number) => {
    setSelectedAttackId(attackId);
    setPhase("rewrite");
  };

  const saveEntry = () => {
    if (!selectedAttackId || inspectText(rewrittenText)) {
      return;
    }

    const entry: Entry = {
      id: createId(),
      kind: "critic_attack",
      raw_text: rawText.trim(),
      rewritten_text: rewrittenText.trim() || null,
      critic_attack_type: selectedAttackId,
      intensity_before: null,
      intensity_after: null,
      created_at: new Date().toISOString(),
    };

    addEntry(entry);
    setSavedEntryId(entry.id);
    setPhase("saved");
  };

  const reset = () => {
    setPhase("write");
    setRawText("");
    setRewrittenText("");
    setSelectedAttackId(null);
    setSavedEntryId(null);
  };

  const useBlockPhrase = (phrase: string) => {
    setBlockMessage(`已经对它说：${phrase}`);
    window.setTimeout(() => setBlockMessage(""), 2400);
  };

  if (phase === "write") {
    return (
      <div className="page critic-page">
        <section className="flow-shell" aria-labelledby="critic-title">
          <p className="eyebrow">B01 · 内在批判者挑战</p>
          <h1 id="critic-title">它此刻在骂你什么？</h1>
          <p className="flow-lead">
            把原话写下来就好，不需要整理得温和。内在批判者有时候会说些难听的话，我们一起来看它。
          </p>

          <div className="field-block">
            <label htmlFor="critic-raw">它此刻对你说的话</label>
            <textarea
              id="critic-raw"
              className="safe-textarea safe-textarea-large"
              value={rawText}
              rows={6}
              maxLength={1200}
              placeholder="例如：我真是个废物。"
              onChange={(event) => {
                const nextValue = event.target.value;
                if (inspectText(nextValue)) {
                  return;
                }
                setRawText(nextValue);
              }}
            />
          </div>

          <button
            className="button button-primary button-wide"
            type="button"
            disabled={!rawText.trim()}
            onClick={writeAttack}
          >
            看看它属于哪种攻击
          </button>

          <div className="inline-safety-tools">
            <button
              className="text-link inline-link"
              type="button"
              onClick={() => openGrounding("先离开批判者的声音")}
            >
              先接地
            </button>
            <Link className="text-link inline-link" to="/learn">
              了解毒性羞耻
            </Link>
            <Link className="text-link inline-link" to="/">
              停止并回安全处
            </Link>
          </div>
        </section>

        <StrengthList
          strengths={strengths}
          value={strengthDraft}
          onValueChange={(value) => {
            if (!inspectText(value)) {
              setStrengthDraft(value);
            }
          }}
          onAdd={() => {
            addStrength(strengthDraft);
            setStrengthDraft("");
          }}
          onRemove={removeStrength}
          onGrounding={() => openGrounding("离开批判者的声音")}
        />
      </div>
    );
  }

  if (phase === "choose") {
    return (
      <div className="page critic-page">
        <section className="flow-shell flow-shell-wide" aria-labelledby="choose-title">
          <div className="flow-topbar">
            <div>
              <p className="eyebrow">识别攻击</p>
              <h1 id="choose-title">它最接近哪一种？</h1>
            </div>
            <button className="button button-stop" type="button" onClick={reset}>
              停止
            </button>
          </div>
          <p className="flow-lead">
            不需要选得绝对准确。先找到最接近的一项，就是让批判者从“你”变回“一个声音”。
          </p>

          <div className="attack-groups">
            {(["完美主义型", "设想危害型"] as const).map((group) => (
              <section key={group} aria-labelledby={`group-${group}`}>
                <h2 id={`group-${group}`}>{group}</h2>
                <div className="attack-grid">
                  {criticAttacks
                    .filter((attack) => attack.group === group)
                    .map((attack) => (
                      <button
                        key={attack.id}
                        className="attack-card"
                        type="button"
                        onClick={() => chooseAttack(attack.id)}
                      >
                        <span>{attack.id}</span>
                        <strong>{attack.label}</strong>
                      </button>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (phase === "rewrite" && selectedAttack) {
    return (
      <div className="page critic-page">
        <section className="flow-shell" aria-labelledby="rewrite-title">
          <div className="flow-topbar">
            <div>
              <p className="eyebrow">先阻断，再纠正</p>
              <h1 id="rewrite-title">{selectedAttack.label}</h1>
            </div>
            <button
              className="button button-stop"
              type="button"
              onClick={() => setPhase("choose")}
            >
              换一种
            </button>
          </div>

          <blockquote className="thought-correction">
            <span>思维纠正</span>
            <p>{selectedAttack.correction}</p>
          </blockquote>

          <section className="block-practice" aria-labelledby="block-title">
            <h2 id="block-title">先对批判者说停</h2>
            <p>不需要相信它立刻会消失。先让这个声音失去继续控制你的机会。</p>
            <div className="block-buttons">
              <button
                className="button button-stop-word"
                type="button"
                onClick={() => useBlockPhrase("不")}
              >
                不
              </button>
              <button
                className="button button-stop-word"
                type="button"
                onClick={() => useBlockPhrase("停下")}
              >
                停下
              </button>
              <button
                className="button button-stop-word"
                type="button"
                onClick={() => useBlockPhrase("闭嘴")}
              >
                闭嘴
              </button>
            </div>
            <button
              className="button button-secondary button-wide"
              type="button"
              onClick={() => useBlockPhrase(blockPhrase)}
            >
              使用我自己的阻断语句
            </button>
            {blockMessage && (
              <p className="block-message" role="status">
                {blockMessage}
              </p>
            )}
          </section>

          <details className="custom-phrase">
            <summary>设置我自己的阻断语句</summary>
            <div className="field-block">
              <label htmlFor="custom-phrase">一句让我重新站稳的话</label>
              <input
                id="custom-phrase"
                className="text-input"
                value={blockPhraseDraft}
                maxLength={80}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (!inspectText(nextValue)) {
                    setBlockPhraseDraft(nextValue);
                  }
                }}
              />
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  if (!inspectText(blockPhraseDraft)) {
                    setBlockPhrase(blockPhraseDraft);
                  }
                }}
              >
                保存阻断语句
              </button>
            </div>
          </details>

          <div className="field-block rewrite-block">
            <label htmlFor="critic-rewrite">
              用自己的话，把它改写得更公平、更支持自己
            </label>
            <textarea
              id="critic-rewrite"
              className="safe-textarea safe-textarea-large"
              value={rewrittenText}
              rows={5}
              maxLength={1200}
              placeholder="我可以从这一句开始：这很难，但我并不是一个废物。"
              onChange={(event) => {
                const nextValue = event.target.value;
                if (inspectText(nextValue)) {
                  return;
                }
                setRewrittenText(nextValue);
              }}
            />
            <p className="field-hint">
              不强迫积极，也不否定原来的感受。只是把指责改成更接近事实的说法。
            </p>
          </div>

          <button
            className="button button-grounding button-wide"
            type="button"
            onClick={() => openGrounding("改写前，先离开批判者")}
          >
            我现在需要接地
          </button>
          <button
            className="button button-primary button-wide"
            type="button"
            disabled={!rewrittenText.trim()}
            onClick={saveEntry}
          >
            保存这次改写
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page critic-page">
      <section className="flow-shell completion-shell" aria-labelledby="saved-title">
        <p className="eyebrow">已经保存</p>
        <h1 id="saved-title">你把批判者的话，变成了自己的话</h1>
        <p className="flow-lead">
          原话和你改写后的版本都保存在这台设备上。以后可以继续写，不需要一次就把这个声音处理完。
        </p>
        {savedEntryId && (
          <p className="saved-note">本次记录 ID：{savedEntryId.slice(0, 8)}</p>
        )}
        <button
          className="button button-primary button-wide"
          type="button"
          onClick={reset}
        >
          再写一句
        </button>
        <Link className="button button-quiet button-wide button-link" to="/">
          回到安全首页
        </Link>
      </section>
    </div>
  );
}

interface StrengthListProps {
  strengths: string[];
  value: string;
  onValueChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onGrounding: () => void;
}

function StrengthList({
  strengths,
  value,
  onValueChange,
  onAdd,
  onRemove,
  onGrounding,
}: StrengthListProps) {
  return (
    <section className="strength-section" aria-labelledby="strength-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">B03 · 提前准备</p>
          <h2 id="strength-title">我的优点与成就</h2>
        </div>
        <button className="text-link inline-link" type="button" onClick={onGrounding}>
          需要时先接地
        </button>
      </div>
      <p>
        不必是了不起的大事。一个品质、一次完成、一次坚持，都可以放在这里。不要在闪回很强烈时硬做。
      </p>
      <div className="inline-form">
        <label className="sr-only" htmlFor="strength-input">
          写下一项优点或成就
        </label>
        <input
          id="strength-input"
          className="text-input"
          value={value}
          maxLength={120}
          placeholder="例如：我曾经在很难的时候向外求助"
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
        />
        <button
          className="button button-secondary"
          type="button"
          disabled={!value.trim()}
          onClick={onAdd}
        >
          添加
        </button>
      </div>
      {strengths.length > 0 ? (
        <ul className="strength-list">
          {strengths.map((strength, index) => (
            <li key={`${strength}-${index}`}>
              <span>{strength}</span>
              <button
                type="button"
                aria-label={`删除：${strength}`}
                onClick={() => onRemove(index)}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-note">这里还是空的。先从一句真实的话开始。</p>
      )}
    </section>
  );
}
