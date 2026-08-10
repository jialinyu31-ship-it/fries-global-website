import { MessageCircle } from "lucide-react";
import { EmailLink } from "@/components/email-link";
import { ProjectBriefForm } from "@/components/project-brief-form";
import type { SiteContent } from "@/lib/site-content";

export function SiteCTA({ content }: { content: SiteContent }) {
  return (
    <section className="site-cta" id="contact">
      <div className="site-cta__trajectories" aria-hidden="true"><i /><i /><i /></div>
      <div className="shell site-cta__inner reveal">
        <div className="site-cta__copy">
          <span className="kicker kicker--light">{content.cta.kicker}</span>
          <h2><span>{content.cta.title[0]}</span><span>{content.cta.title[1]}</span></h2>
          <p>{content.cta.description}</p>
          <div className="site-cta__actions">
            <EmailLink className="button button--outline-light"><MessageCircle size={17} />{content.cta.secondary}</EmailLink>
          </div>
        </div>
        <ProjectBriefForm content={content} />
      </div>
    </section>
  );
}
