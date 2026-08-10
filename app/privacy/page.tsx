import { BrandMark } from "@/components/brand-mark";
import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/"><BrandMark /></Link>
      <article>
        <span className="kicker">Legal</span>
        <h1>Privacy Policy</h1>
        <p>Last updated: August 10, 2026</p>
        <h2>Information we collect</h2>
        <p>For website operation and security, we collect limited technical information such as the page visited, time of access, device category, browser family, operating system, referring website and country code supplied by our network provider.</p>
        <p>Operational analytics use an anonymous device identifier. Separately, exact source IP addresses and limited request metadata are retained in an encrypted, access-controlled connection and security log so that abuse, intrusion attempts and service incidents can be investigated. An IP address identifies a network endpoint and does not necessarily identify a person.</p>
        <h2>How we use information</h2>
        <p>We use technical information to understand website performance, estimate unique devices, improve content, detect automated traffic and investigate requests blocked by our security controls.</p>
        <h2>Retention and sharing</h2>
        <p>Local aggregate analytics are limited to approximately 30 days. Encrypted connection and security evidence is limited to approximately 90 days unless a longer period is reasonably required to investigate an incident, preserve evidence or meet a legal obligation. Network providers may process connection information under their own privacy terms when delivering and protecting the website. We do not sell visitor data.</p>
        <h2>Cookies</h2>
        <p>The public website does not require an advertising or cross-site tracking cookie. A strictly necessary, secure session cookie is used only when an authorized administrator signs in to the private management console.</p>
        <h2>Your choices</h2>
        <p>You may contact Fries Global to ask questions about this policy or request deletion of information where applicable. A production privacy contact address should be confirmed before the final public launch.</p>
        <Link className="text-link" href="/">Return home</Link>
      </article>
    </main>
  );
}
