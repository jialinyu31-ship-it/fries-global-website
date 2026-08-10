import { BrandMark } from "@/components/brand-mark";
import Link from "next/link";

export const metadata = { title: "Website Terms" };

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link href="/"><BrandMark /></Link>
      <article>
        <span className="kicker">Legal</span>
        <h1>Website Terms</h1>
        <p>Last updated: August 10, 2026</p>
        <h2>Website information</h2>
        <p>Website content is provided for general business information. Product availability, specifications, pricing, certifications and lead times must be confirmed in a written quotation or agreement.</p>
        <h2>No automatic transaction</h2>
        <p>Sending an email or sourcing brief does not create a purchase contract, agency relationship or guarantee that a particular supplier or product is available.</p>
        <h2>Intellectual property</h2>
        <p>The Fries Global and 薯条出海 names, logo, mascot, original text, visual design, illustrations, source code and other original materials are protected works. No license is granted to reproduce, adapt, resell, sublicense, impersonate or use them to create a confusingly similar commercial service without prior written permission.</p>
        <h2>Automated copying</h2>
        <p>Systematic scraping, cloning, extraction of visual assets, removal of provenance markers and use of this website to train or assemble a competing commercial website are prohibited except where applicable law expressly provides otherwise.</p>
        <h2>Security and acceptable use</h2>
        <p>You may not probe, disrupt, bypass access controls, overload the service or attempt to obtain administrative credentials. Security events may be retained for investigation and protection of legal rights.</p>
        <h2>Final legal review</h2>
        <p>These terms should be reviewed against the company&apos;s registered entity, target markets and applicable law before the final commercial launch.</p>
        <Link className="text-link" href="/">Return home</Link>
      </article>
    </main>
  );
}
