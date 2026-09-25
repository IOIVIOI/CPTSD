import { Phone, ShieldAlert, Square, UserRoundCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function CrisisReferral() {
  const { crisisActive, returnHomeFromCrisis } = useApp();
  const navigate = useNavigate();

  if (!crisisActive) {
    return null;
  }

  const stopAndReturnHome = () => {
    returnHomeFromCrisis();
    navigate("/", { replace: true });
  };

  return (
    <div className="crisis-screen" role="dialog" aria-modal="true">
      <div className="crisis-panel">
        <p className="eyebrow">先停下来，照顾此刻的安全</p>
        <h1>你写下的内容可能指向自伤、自杀或当前危险。</h1>
        <p className="crisis-lead">
          这里不再继续自助流程，也不会把这件事交给我们判断。现在最重要的事情，是让真实世界里的人知道你正在经历什么，并陪在你身边。
        </p>

        <div className="crisis-actions">
          <a className="button button-emergency" href="tel:120">
            <Phone size={20} aria-hidden="true" />
            <span>拨打 120</span>
          </a>
          <a className="button button-emergency-secondary" href="tel:110">
            <ShieldAlert size={20} aria-hidden="true" />
            <span>拨打 110</span>
          </a>
        </div>

        <section className="referral-card" aria-labelledby="support-title">
          <h2 id="support-title">我需要支持</h2>
          <UserRoundCheck size={24} aria-hidden="true" />
          <p>
            请联系身边可信任的人，告诉对方“我现在需要你陪我”。尽量留在有人陪伴的地方。
          </p>
          <p>
            如果身边暂时没有人，请联系当地危机干预热线或专业人员。这不是你的错，现在寻求帮助是保护自己。
          </p>
        </section>

        <button
          className="button button-quiet button-wide"
          type="button"
          onClick={stopAndReturnHome}
        >
          <Square size={17} aria-hidden="true" />
          <span>停止当前流程，回到安全首页</span>
        </button>
        <p className="crisis-footnote">
          回到首页不会继续刚才的疗愈流程。请先联系支持，或留在安全、有人陪伴的环境中。
        </p>
      </div>
    </div>
  );
}
