import { useEffect } from "react";

const GLOW_SELECTOR = [
  ".button",
  ".nav-item",
  ".mobile-nav-item",
  ".home-action",
  ".explore-card",
  ".attack-card",
  ".mode-card",
  ".method-card",
  ".recovery-item",
  ".segmented-control button",
  ".method-filters button",
].join(",");

export function PointerGlow() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let host: HTMLElement | null = null;
    let layer: HTMLSpanElement | null = null;
    let frame = 0;
    let point = { x: 0, y: 0 };

    const clear = () => {
      layer?.classList.remove("is-visible");
      host = null;
      layer = null;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const paint = () => {
      frame = 0;

      if (!host?.isConnected || !layer?.isConnected) {
        return;
      }

      const rect = host.getBoundingClientRect();
      const x = reducedMotion.matches ? rect.width / 2 : point.x - rect.left;
      const y = reducedMotion.matches ? rect.height / 2 : point.y - rect.top;
      const radius = Math.max(45, Math.min(100, rect.width * 0.65));

      layer.style.setProperty("--glow-x", `${x}px`);
      layer.style.setProperty("--glow-y", `${y}px`);
      layer.style.setProperty("--glow-radius", `${radius}px`);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") {
        clear();
        return;
      }

      const target = (event.target as Element | null)?.closest(
        GLOW_SELECTOR,
      ) as HTMLElement | null;

      if (
        !target ||
        target.hasAttribute("disabled") ||
        target.getAttribute("aria-disabled") === "true"
      ) {
        clear();
        return;
      }

      point = { x: event.clientX, y: event.clientY };

      if (host !== target || !layer?.isConnected) {
        clear();
        host = target;
        host.classList.add("psj-glow-host");
        layer = host.querySelector(":scope > .psj-pointer-glow");

        if (!layer) {
          layer = document.createElement("span");
          layer.className = "psj-pointer-glow";
          layer.setAttribute("aria-hidden", "true");
          host.append(layer);
        }

        paint();
        layer.classList.add("is-visible");
      }

      if (!frame) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (host && !host.contains(event.relatedTarget as Node | null)) {
        clear();
      }
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut, {
      passive: true,
    });
    window.addEventListener("blur", clear);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", clear);
      clear();
    };
  }, []);

  return null;
}
