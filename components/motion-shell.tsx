"use client";

import { type ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px)" }, (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero__brand-lockup", { autoAlpha: 0, scale: 0.94, duration: 0.65 })
        .from(".hero__eyebrow", { autoAlpha: 0, y: 16, duration: 0.5 }, "-=0.35")
        .from(".hero h1 > span", { autoAlpha: 0, yPercent: 35, stagger: 0.12, duration: 0.8 }, "-=0.2")
        .from(".hero__copy > p", { autoAlpha: 0, y: 22, duration: 0.6 }, "-=0.4")
        .from(".hero__actions", { autoAlpha: 0, y: 18, duration: 0.5 }, "-=0.34")
        .from(".hero-brief", { autoAlpha: 0, x: 28, duration: 0.68 }, "-=0.42")
        .from(".hero__proofs span", { autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.35 }, "-=0.22");

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, { autoAlpha: 0, y: 34, duration: 0.72, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });

      ScrollTrigger.batch(".category-card, .service-tab", {
        start: "top 90%", once: true, interval: 0.08, batchMax: 5,
        onEnter: (batch) => gsap.from(batch, { autoAlpha: 0, y: 32, scale: 0.985, stagger: 0.07, duration: 0.65, ease: "power3.out" }),
      });

      gsap.from(".process__progress", { scaleX: 0, transformOrigin: "left center", ease: "none", scrollTrigger: { trigger: ".process__track", start: "top 78%", end: "bottom 42%", scrub: 0.7 } });
      gsap.from(".process-step", { autoAlpha: 0.3, stagger: 0.08, scrollTrigger: { trigger: ".process__track", start: "top 80%", end: "bottom 45%", scrub: 0.6 } });

      if (desktop) {
        gsap.to(".hero__backdrop", { yPercent: 5, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.9 } });
      }
    });

    const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { window.cancelAnimationFrame(refresh); media.revert(); };
  }, { scope: root });

  return <div ref={root} className="motion-root">{children}</div>;
}
