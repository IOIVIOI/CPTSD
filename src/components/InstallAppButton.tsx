import { Download } from "lucide-react";
import { usePwaInstall } from "../hooks/usePwaInstall";

export function InstallAppButton() {
  const { canShow, closeHelp, install, isHelpOpen } = usePwaInstall();

  if (!canShow) {
    return null;
  }

  return (
    <>
      <button
        className="button button-install button-compact"
        type="button"
        onClick={install}
      >
        <Download size={17} aria-hidden="true" />
        <span>安装到桌面</span>
      </button>

      {isHelpOpen && (
        <div className="install-overlay" role="dialog" aria-modal="true">
          <div className="install-panel">
            <p className="eyebrow">安装到手机桌面</p>
            <h1>添加到主屏幕后，可以像普通 App 一样打开。</h1>
            <ol className="install-steps">
              <li>
                使用手机浏览器打开本页。iPhone 建议使用 Safari，Android
                可使用 Chrome。
              </li>
              <li>
                iPhone 点击底部的“分享”按钮；Android 点击浏览器右上角菜单。
              </li>
              <li>选择“添加到主屏幕”，确认名称后点击“添加”。</li>
            </ol>
            <p className="field-hint">
              首次在线打开后，核心页面会保存在本机缓存。添加到桌面不会上传任何疗愈记录。
            </p>
            <button
              className="button button-primary button-wide"
              type="button"
              onClick={closeHelp}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
}
