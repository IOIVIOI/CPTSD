import { useEffect } from "react";
import {
  BookOpen,
  Compass,
  HeartHandshake,
  Library,
  LifeBuoy,
  MessageCircle,
  ShieldAlert,
  Waves,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { InstallAppButton } from "./InstallAppButton";

const NAV_ITEMS = [
  {
    to: "/",
    label: "此刻",
    mobileLabel: "此刻",
    icon: Compass,
    end: true,
  },
  {
    to: "/rescue",
    label: "闪回急救",
    mobileLabel: "急救",
    icon: LifeBuoy,
  },
  {
    to: "/critic",
    label: "批判者挑战",
    mobileLabel: "批判",
    icon: MessageCircle,
  },
  {
    to: "/grieve",
    label: "哀悼与情绪",
    mobileLabel: "哀悼",
    icon: HeartHandshake,
  },
  {
    to: "/learn",
    label: "了解自己",
    mobileLabel: "了解",
    icon: BookOpen,
  },
  {
    to: "/methods",
    label: "方法库",
    mobileLabel: "方法",
    icon: Library,
  },
];

export function Layout() {
  const { openGrounding, storageError } = useApp();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <header className="global-header">
        <div className="header-row">
          <Link className="brand" to="/" aria-label="回到此刻首页">
            <span className="brand-mark" aria-hidden="true">
              <Compass size={22} strokeWidth={1.9} />
            </span>
            <span>
              <strong>回到此刻</strong>
              <small>安全、稳定、随时可停</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="主要导航">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "is-active" : ""}`
                }
                end={item.end}
                to={item.to}
              >
                <item.icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <InstallAppButton />
            {!isHome && (
              <Link className="text-link header-home-link" to="/">
                回安全处
              </Link>
            )}
            <button
              className="button button-grounding-compact"
              type="button"
              onClick={() => openGrounding("从任何地方回到当下")}
            >
              <Waves size={18} aria-hidden="true" />
              <span>先接地</span>
            </button>
          </div>
        </div>
      </header>

      {storageError && (
        <div className="storage-notice" role="status">
          {storageError}
        </div>
      )}

      <main id="main-content">
        <Outlet />
      </main>

      <nav className="mobile-nav" aria-label="移动端导航">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `mobile-nav-item ${isActive ? "is-active" : ""}`
            }
            end={item.end}
            to={item.to}
          >
            <item.icon size={20} strokeWidth={1.9} aria-hidden="true" />
            <span>{item.mobileLabel}</span>
          </NavLink>
        ))}
      </nav>

      <footer className="global-footer">
        <span className="footer-mark" aria-hidden="true">
          <ShieldAlert size={18} />
        </span>
        <p>
          这是结构化自助与心理教育工具，不替代药物、心理治疗、诊断或紧急服务。
        </p>
        <p>
          若有自伤、自杀或当前危险，请立即拨打 <a href="tel:120">120</a> 或{" "}
          <a href="tel:110">110</a>，并联系可信任的人。
        </p>
      </footer>
    </div>
  );
}
