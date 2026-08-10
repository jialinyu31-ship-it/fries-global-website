import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

export function Categories({ content }: { content: SiteContent }) {
  return (
    <section className="section categories" id="products">
      <div className="shell">
        <div className="section-intro reveal">
          <div><span className="kicker">{content.categories.kicker}</span><h2>{content.categories.title}</h2></div>
          <p>{content.categories.description}</p>
        </div>
        <div className="categories__grid">
          {content.categories.items.map((title, index) => (
            <a className="category-card" href="#contact" key={title}>
              <span className={`category-mascot category-mascot--${index + 1}`} aria-hidden="true" />
              <span className="category-card__number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <span className="category-card__link">{content.categories.link}<ArrowUpRight size={14} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
