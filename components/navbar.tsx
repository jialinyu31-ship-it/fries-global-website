"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Globe2, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { locales, siteContent, type Locale, type SiteContent } from "@/lib/site-content";

export function Navbar({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="navbar__inner shell">
        <a className="navbar__brand" href="#top" onClick={() => setOpen(false)}><BrandMark /></a>
        <nav className="navbar__nav" aria-label="Main navigation">
          {content.nav.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
        </nav>
        <div className="navbar__actions">
          <label className="navbar__languages" aria-label="Language"><Globe2 size={15} />
            <select value={content.locale} onChange={(event) => router.push(`/${event.target.value}`)}>
              {locales.map((locale: Locale) => <option key={locale} value={locale}>{siteContent[locale].languageLabel}</option>)}
            </select>
          </label>
          <a className="button button--compact button--dark" href="#contact">{content.navCta}<ArrowUpRight size={15} /></a>
          <button className="navbar__toggle" type="button" aria-expanded={open} aria-label={open ? content.menuClose : content.menuOpen} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}
