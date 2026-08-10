import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function Services({ content }: { content: SiteContent }) {
  return (
    <section className="section services" id="services">
      <div className="shell">
        <div className="section-intro reveal">
          <div><span className="kicker">{content.services.kicker}</span><h2>{content.services.title}</h2></div>
          <p>{content.services.description}</p>
        </div>
        <div className="services__grid">
          {content.services.items.map((item) => (
            <article className="service-card" key={item.number}>
              <div className="service-card__top"><span>{item.number}</span><ArrowUpRight size={19} /></div>
              <div className="service-card__copy"><h3>{item.title}</h3><p>{item.summary}</p></div>
              <div className="service-card__line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
