import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function getIsStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as NavigatorWithStandalone).standalone)
  );
}

function getIsMobileDevice(): boolean {
  return (
    /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(getIsStandalone);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const isMobileDevice = getIsMobileDevice();

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsHelpOpen(false);
    };

    const media = window.matchMedia("(display-mode: standalone)");
    const handleDisplayMode = () => setIsInstalled(getIsStandalone());

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    media.addEventListener("change", handleDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      media.removeEventListener("change", handleDisplayMode);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      setIsHelpOpen(true);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
      return;
    }

    setIsHelpOpen(true);
  }, [deferredPrompt]);

  return {
    canShow: isMobileDevice && !isInstalled,
    install,
    isHelpOpen,
    closeHelp: () => setIsHelpOpen(false),
  };
}
