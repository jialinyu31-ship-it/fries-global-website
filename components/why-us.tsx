import { CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function WhyUs({ content }: { content: SiteContent }) {
  return (
    <section className="why-us" id="quality">
      <div className="shell quality__grid">
        <div className="why-us__intro reveal">
          <span className="kicker kicker--light">{content.why.kicker}</span>
          <h2><span>{content.why.title[0]}</span><span>{content.why.title[1]}</span></h2>
          <p>{content.why.description}</p>
        </div>
        <div className="quality__cards">
          {content.why.items.map((item) => <article className="quality-card reveal" key={item.number}><CheckCircle2 /><span>{item.number}</span><h3>{item.title}</h3><p>{item.summary}</p></article>)}
        </div>
      </div>
    </section>
  );
}
