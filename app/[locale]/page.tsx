import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Categories } from "@/components/categories";
import { GlobalNetwork } from "@/components/global-network";
import { Hero } from "@/components/hero";
import { MotionShell } from "@/components/motion-shell";
import { Navbar } from "@/components/navbar";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import { SiteCTA } from "@/components/site-cta";
import { SiteFooter } from "@/components/site-footer";
import { WhyUs } from "@/components/why-us";
import { isLocale, locales, siteContent, type Locale } from "@/lib/site-content";

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const content = siteContent[locale];
  return {
    title: locale === "zh" ? "薯条出海｜中国采购与出口协作" : "FRIES GLOBAL | Your sourcing team in China",
    description: content.hero.description,
    alternates: { canonical: `/${locale}`, languages: Object.fromEntries(locales.map((lang) => [lang, `/${lang}`])) },
    openGraph: { title: "薯条出海 · FRIES GLOBAL", description: content.hero.description, url: `/${locale}`, images: [{ url: "/hero-port-global.png", width: 1536, height: 1024 }] },
  };
}

export default async function LocaleHome({ params }: PageProps) {
  await connection();
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = siteContent[locale];

  return (
    <div lang={locale} dir={content.dir}>
      <MotionShell>
        <Navbar content={content} />
        <main id="main-content">
          <Hero content={content} />
          <Categories content={content} />
          <Services content={content} />
          <Process content={content} />
          <WhyUs content={content} />
          <GlobalNetwork content={content} />
          <SiteCTA content={content} />
        </main>
        <SiteFooter content={content} />
      </MotionShell>
    </div>
  );
}
