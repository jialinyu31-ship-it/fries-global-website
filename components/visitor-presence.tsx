"use client";

import { useEffect } from "react";

export function VisitorPresence() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;
    let timer = 0;
    let firstPulse = true;

    const pulse = () => {
      if (document.visibilityState !== "visible") return;
      const page = encodeURIComponent(window.location.pathname.slice(0, 200));
      const profile = firstPulse ? "&profile=1" : "";
      firstPulse = false;
      void fetch(`/api/presence?page=${page}${profile}`, { method: "GET", cache: "no-store", credentials: "omit", keepalive: true }).catch(() => undefined);
    };
    const restart = () => {
      window.clearInterval(timer);
      if (document.visibilityState === "visible") {
        pulse();
        timer = window.setInterval(pulse, 45_000);
      }
    };

    restart();
    document.addEventListener("visibilitychange", restart);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);
  return null;
}
