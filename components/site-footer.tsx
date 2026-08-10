import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { EmailLink } from "@/components/email-link";
import type { SiteContent } from "@/lib/site-content";
import { BRAND_COPYRIGHT, BRAND_PROVENANCE_ID } from "@/lib/brand-integrity";

export function SiteFooter({ content }: { content: SiteContent }) {
  const footerHrefs = [["#products", "#services", "#process", "#quality"], ["#global", "#top", "#contact", "#contact"]];

  return (
    <footer className="site-footer" data-brand-provenance={BRAND_PROVENANCE_ID}>
      <div className="shell site-footer__cta">
        <div>
          <span>{content.hero.eyebrow}</span>
          <h2><span>{content.hero.title[0]}</span><span>{content.hero.title[1]}</span></h2>
        </div>
        <a className="site-footer__cta-link" href="#contact">{content.cta.primary}<ArrowUpRight size={20} /></a>
      </div>

      <div className="shell site-footer__main">
        <div className="site-footer__brand">
          <BrandMark inverse />
          <p>{content.footer.summary}</p>
          <div className="site-footer__contact">
            <span><Mail size={14} />{content.footer.sections[1].title}</span>
            <EmailLink>hello@friesglobal.com</EmailLink>
          </div>
        </div>

        <nav className="site-footer__directory" aria-label="Footer navigation">
          {content.footer.sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <strong><span>0{sectionIndex + 1}</span>{section.title}</strong>
              {section.links.map((label, linkIndex) => sectionIndex === 1 && linkIndex === 3
                ? <EmailLink key={label}>{label}</EmailLink>
                : <a href={footerHrefs[sectionIndex]?.[linkIndex] ?? "#top"} key={label}>{label}<ArrowUpRight size={12} /></a>)}
            </div>
          ))}
        </nav>

        <a className="site-footer__top-link" href="#top" aria-label={content.footer.top}><ArrowUp />{content.footer.top}</a>
      </div>

      <div className="shell site-footer__bottom">
        <span>{BRAND_COPYRIGHT}</span>
        <span title={`Brand provenance: ${BRAND_PROVENANCE_ID}`}>FRIES GLOBAL · CHINA SOURCING DESK</span>
        <nav><Link href="/privacy">{content.footer.legal[0]}</Link><Link href="/terms">{content.footer.legal[1]}</Link></nav>
      </div>
    </footer>
  );
}
