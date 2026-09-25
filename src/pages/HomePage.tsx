import {
  ArrowRight,
  BookOpen,
  CloudOff,
  HeartHandshake,
  Library,
  LifeBuoy,
  MessageCircle,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function HomePage() {
  const { entries, openGrounding, sessions, strengths } = useApp();
  const criticEntries = entries.filter(
    (entry) => entry.kind === "critic_attack",
  ).length;
  const feelingEntries = entries.filter(
    (entry) => entry.kind === "feeling",
  ).length;
  const gratitudeEntries = entries.filter(
    (entry) => entry.kind === "gratitude",
  ).length;

  return (
    <div className="page home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow">先停在这里</p>
          <h1 id="home-title">你不需要一次解决所有事。</h1>
          <p className="home-lead">
            如果过去正在把你卷走，我们一次只做一件事。你随时可以停下，也随时可以接地。
          </p>
          <div className="home-promises" aria-label="使用原则">
            <span>
              <CloudOff size={17} aria-hidden="true" />
              记录只在本机
            </span>
            <span>
              <ShieldCheck size={17} aria-hidden="true" />
              随时可停
            </span>
          </div>
        </div>

        <aside className="anchor-card" aria-labelledby="anchor-title">
          <span className="anchor-icon" aria-hidden="true">
            <Waves size={28} strokeWidth={1.8} />
          </span>
          <p className="eyebrow">安全锚点</p>
          <h2 id="anchor-title">先把身体带回这里，再决定下一步。</h2>
          <p>
            如果现在思路很乱，不必先想明白。做几次慢呼吸，看看周围真实的物体。
          </p>
          <button
            className="button button-grounding button-wide"
            type="button"
            onClick={() => openGrounding("先做一段落地练习")}
          >
            <Waves size={18} aria-hidden="true" />
            <span>开始 1 分钟接地</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </aside>
      </section>

      <section className="decision-section" aria-labelledby="decision-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">此刻更需要</p>
            <h2 id="decision-title">选择最接近你状态的一扇门</h2>
          </div>
          <span className="section-badge">不需要选对</span>
        </div>

        <div className="home-actions">
          <Link className="home-action home-action-rescue" to="/rescue">
            <span className="home-action-icon" aria-hidden="true">
              <LifeBuoy size={30} strokeWidth={1.8} />
            </span>
            <span className="home-action-kicker">情绪正在被过去卷走</span>
            <strong>我正闪回</strong>
            <span>先接地，再逐条走 13 步急救</span>
            <ArrowRight
              className="home-action-arrow"
              size={24}
              aria-hidden="true"
            />
          </Link>

          <Link className="home-action home-action-critic" to="/critic">
            <span className="home-action-icon" aria-hidden="true">
              <MessageCircle size={30} strokeWidth={1.8} />
            </span>
            <span className="home-action-kicker">脑海里一直有难听的声音</span>
            <strong>内在批判者在攻击我</strong>
            <span>识别攻击，读思维纠正，再改写</span>
            <ArrowRight
              className="home-action-arrow"
              size={24}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>

      <section className="safety-strip" aria-labelledby="safety-title">
        <div>
          <p className="eyebrow">安全提醒</p>
          <h2 id="safety-title">有现实危险时，先找真实世界里的人</h2>
        </div>
        <p>
          如果有自伤、自杀或当前危险，请立即拨打{" "}
          <a href="tel:120">120</a> 或 <a href="tel:110">110</a>，并联系可信任的人。这个工具不会追问，也不会让你独自处理。
        </p>
      </section>

      <section className="home-note" aria-label="关于这个工具">
        <p>
          这里提供的是结构化自助和心理教育，不是诊断或治疗。闪回、羞耻和内在批判者，都是创伤后的适应反应，不是你的缺陷。
        </p>
      </section>

      <section className="explore-section" aria-labelledby="explore-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">继续了解</p>
            <h2 id="explore-title">不急着解决，也可以慢慢理解</h2>
          </div>
        </div>
        <div className="explore-grid">
          <Link className="explore-card" to="/grieve">
            <span className="explore-icon" aria-hidden="true">
              <HeartHandshake size={22} />
            </span>
            <small>哀悼与情绪</small>
            <strong>让情绪有一个安全的出口</strong>
            <p>愤怒、哭泣、说写或感受，进入前先接地，随时可停。</p>
          </Link>
          <Link className="explore-card" to="/learn">
            <span className="explore-icon" aria-hidden="true">
              <BookOpen size={22} />
            </span>
            <small>了解自己</small>
            <strong>把反应看成适应，不是缺陷</strong>
            <p>4F 非诊断自评、毒性羞耻、闪回与事实、感恩和康复迹象。</p>
          </Link>
          <Link className="explore-card" to="/methods">
            <span className="explore-icon" aria-hidden="true">
              <Library size={22} />
            </span>
            <small>方法库</small>
            <strong>需要时再来找</strong>
            <p>浏览 29 个方法的步骤、适用情境和来源。</p>
          </Link>
        </div>
      </section>

      <section className="local-summary" aria-labelledby="local-summary-title">
        <div>
          <p className="eyebrow">本机记录</p>
          <h2 id="local-summary-title">记录只保存在这台设备上</h2>
        </div>
        <dl>
          <div>
            <dt>闪回急救</dt>
            <dd>{sessions.length} 次</dd>
          </div>
          <div>
            <dt>批判者改写</dt>
            <dd>{criticEntries} 条</dd>
          </div>
          <div>
            <dt>情绪记录</dt>
            <dd>{feelingEntries} 条</dd>
          </div>
          <div>
            <dt>感恩清单</dt>
            <dd>{gratitudeEntries} 条</dd>
          </div>
          <div>
            <dt>优点与成就</dt>
            <dd>{strengths.length} 项</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
