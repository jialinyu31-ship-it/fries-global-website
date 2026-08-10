"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function Services({ content }: { content: SiteContent }) {
  const [active, setActive] = useState(0);
  const item = content.services.items[active];
  const image = active % 2 === 0 ? "/case-industrial-tech.png" : "/case-manufacturing.png";

  return (
    <section className="section services" id="services">
      <div className="shell">
        <div className="section-intro reveal">
          <div><span className="kicker">{content.services.kicker}</span><h2>{content.services.title}</h2></div>
          <p>{content.services.description}</p>
        </div>
        <div className="service-tabs" role="tablist" aria-label={content.services.title}>
          {content.services.items.map((service, index) => (
            <button
              className={index === active ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls="service-panel"
              key={service.number}
              onClick={() => setActive(index)}
            >
              <span>{service.number}</span>{service.title}
            </button>
          ))}
        </div>
        <div className="service-explorer reveal" id="service-panel" role="tabpanel" aria-live="polite">
          <div className="service-explorer__visual">
            <Image src={image} alt="" fill sizes="(max-width: 800px) 100vw, 48vw" />
            <span>{item.number} / {String(content.services.items.length).padStart(2, "0")}</span>
          </div>
          <div className="service-explorer__copy">
            <span className="service-explorer__index">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <ul>
              <li><CheckCircle2 size={17} />{content.hero.proofs[0]}</li>
              <li><CheckCircle2 size={17} />{content.hero.proofs[2]}</li>
              <li><CheckCircle2 size={17} />{content.process.items[Math.min(active + 1, content.process.items.length - 1)].title}</li>
            </ul>
            <a href="#contact">{content.categories.link}<ArrowRight size={17} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
