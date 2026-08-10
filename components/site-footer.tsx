import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { EmailLink } from "@/components/email-link";
import type { SiteContent } from "@/lib/site-content";
import { BRAND_COPYRIGHT, BRAND_PROVENANCE_ID } from "@/lib/brand-integrity";

export function SiteFooter({ content }: { content: SiteContent }) {
  const footerHrefs = [["#products", "#services", "#process", "#quality"], ["#global", "#top", "#contact", "#contact"]];
  return (
    <footer className="site-footer" data-brand-provenance={BRAND_PROVENANCE_ID}>
      <div className="shell site-footer__top">
        <div className="site-footer__brand"><BrandMark inverse /><p>{content.footer.summary}</p></div>
        <div className="site-footer__nav">
          {content.footer.sections.map((section, sectionIndex) => <div key={section.title}><strong>{section.title}</strong>{section.links.map((link, linkIndex) => sectionIndex === 1 && linkIndex === 3 ? <EmailLink key={link}>{link}</EmailLink> : <a href={footerHrefs[sectionIndex]?.[linkIndex] ?? "#top"} key={link}>{link}</a>)}</div>)}
        </div>
        <a className="site-footer__top-link" href="#top" aria-label={content.footer.top}><ArrowUp />{content.footer.top}</a>
      </div>
      <div className="shell site-footer__bottom">
        <span>{BRAND_COPYRIGHT}</span><span title={`Brand provenance: ${BRAND_PROVENANCE_ID}`}>CHINA · GLOBAL SOURCING</span>
        <nav><Link href="/privacy">{content.footer.legal[0]}</Link><Link href="/terms">{content.footer.legal[1]}</Link></nav>
      </div>
    </footer>
  );
}
