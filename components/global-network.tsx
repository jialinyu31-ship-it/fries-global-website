import { NetworkVisual } from "@/components/network-visual";
import type { SiteContent } from "@/lib/site-content";

export function GlobalNetwork({ content }: { content: SiteContent }) {
  return (
    <section className="global-network" id="global">
      <div className="shell global-network__grid">
        <div className="global-network__copy reveal">
          <span className="kicker kicker--light">{content.global.kicker}</span>
          <h2><span>{content.global.title[0]}</span><span>{content.global.title[1]}</span></h2>
          <p>{content.global.description}</p>
          <div className="global-network__regions">
            {content.global.regions.map((region, index) => <span key={region}><i>{String(index + 1).padStart(2, "0")}</i>{region}</span>)}
          </div>
        </div>
        <div className="global-network__visual reveal"><NetworkVisual content={content} compact /></div>
      </div>
    </section>
  );
}
