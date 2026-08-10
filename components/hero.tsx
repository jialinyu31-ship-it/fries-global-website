import { ArrowDownRight, ArrowRight, Check } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import type { SiteContent } from "@/lib/site-content";

export function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="hero" id="top">
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__grid shell">
        <div className="hero__copy">
          <div className="hero__brand-lockup"><BrandMark inverse /></div>
          <div className="hero__eyebrow"><span>{"///"}</span>{content.hero.eyebrow}</div>
          <h1><span>{content.hero.title[0]}</span><span className="hero__title-accent">{content.hero.title[1]}</span></h1>
          <p>{content.hero.description}</p>
          <div className="hero__actions">
            <a className="button button--primary" href="#contact">{content.hero.primary}<ArrowRight size={18} /></a>
            <a className="button button--text button--text-light" href="#products">{content.hero.secondary}<ArrowDownRight size={17} /></a>
          </div>
        </div>
      </div>
      <div className="hero__proofs shell">
        {content.hero.proofs.map((proof) => <span key={proof}><Check size={15} />{proof}</span>)}
      </div>
    </section>
  );
}
