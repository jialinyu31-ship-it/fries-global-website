"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import type { Locale, SiteContent } from "@/lib/site-content";

const addressCodes = [104, 101, 108, 108, 111, 64, 102, 114, 105, 101, 115, 103, 108, 111, 98, 97, 108, 46, 99, 111, 109];

const labels: Record<Locale, { category: string; quantity: string; market: string; details: string; placeholder: string; privacy: string }> = {
  en: { category: "Product category", quantity: "Estimated quantity", market: "Destination market", details: "Product details", placeholder: "Specifications, material, target price or reference link", privacy: "Your brief stays on your device until you choose to email it." },
  zh: { category: "产品类别", quantity: "预计数量", market: "目的市场", details: "产品详情", placeholder: "规格、材料、目标价格或参考链接", privacy: "在您确认发送邮件前，需求内容只保留在您的设备上。" },
  es: { category: "Categoría", quantity: "Cantidad estimada", market: "Mercado de destino", details: "Detalles", placeholder: "Especificaciones, material, precio objetivo o enlace", privacy: "Sus datos permanecen en su dispositivo hasta que decida enviarlos." },
  fr: { category: "Catégorie", quantity: "Quantité estimée", market: "Marché cible", details: "Détails du produit", placeholder: "Spécifications, matière, prix cible ou lien", privacy: "Votre demande reste sur votre appareil jusqu’à l’envoi par e-mail." },
  de: { category: "Produktkategorie", quantity: "Geschätzte Menge", market: "Zielmarkt", details: "Produktdetails", placeholder: "Spezifikation, Material, Zielpreis oder Referenzlink", privacy: "Ihre Angaben bleiben bis zum E-Mail-Versand auf Ihrem Gerät." },
  ar: { category: "فئة المنتج", quantity: "الكمية المتوقعة", market: "السوق المستهدف", details: "تفاصيل المنتج", placeholder: "المواصفات أو المواد أو السعر المستهدف أو رابط مرجعي", privacy: "تبقى بياناتك على جهازك حتى تختار إرسالها بالبريد الإلكتروني." },
};

export function ProjectBriefForm({ content }: { content: SiteContent }) {
  const copy = labels[content.locale];
  const [category, setCategory] = useState(content.categories.items[0]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${copy.category}: ${category}`,
      `${copy.quantity}: ${String(data.get("quantity") || "-")}`,
      `${copy.market}: ${String(data.get("market") || "-")}`,
      `${copy.details}: ${String(data.get("details") || "-")}`,
    ].join("\n");
    const address = String.fromCharCode(...addressCodes);
    window.location.assign(`mailto:${address}?subject=${encodeURIComponent(`Sourcing request — ${category}`)}&body=${encodeURIComponent(body)}`);
  }

  return (
    <form className="project-brief" onSubmit={submit}>
      <div className="project-brief__row">
        <label><span>{copy.category}</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{content.categories.items.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>{copy.quantity}</span><input name="quantity" maxLength={80} autoComplete="off" required /></label>
      </div>
      <label><span>{copy.market}</span><input name="market" maxLength={120} autoComplete="country-name" required /></label>
      <label><span>{copy.details}</span><textarea name="details" maxLength={1200} rows={4} placeholder={copy.placeholder} required /></label>
      <div className="project-brief__footer">
        <small><LockKeyhole size={14} />{copy.privacy}</small>
        <button className="button button--orange" type="submit">{content.cta.primary}<ArrowRight size={18} /></button>
      </div>
    </form>
  );
}
