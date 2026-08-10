import type { SiteContent } from "@/lib/site-content";

export function Process({ content }: { content: SiteContent }) {
  return (
    <section className="section process" id="process">
      <div className="shell">
        <div className="section-intro reveal">
          <div><span className="kicker">{content.process.kicker}</span><h2>{content.process.title}</h2></div>
          <p>{content.process.description}</p>
        </div>
        <div className="process__track">
          <div className="process__progress" aria-hidden="true" />
          {content.process.items.map((item) => <div className="process-step" key={item.number}><div className="process-step__node"><i /></div><span>{item.number}</span><strong>{item.title}</strong></div>)}
        </div>
        <div className="process__footer"><span>01 → 05</span><i /><small>{content.process.footer}</small></div>
      </div>
    </section>
  );
}
