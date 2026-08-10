export type Locale = "en" | "zh" | "es" | "fr" | "de" | "ar";

export const locales: Locale[] = ["en", "zh", "es", "fr", "de", "ar"];

type Card = { number: string; title: string; summary: string };
type Step = { number: string; title: string };

export type SiteContent = {
  locale: Locale;
  dir: "ltr" | "rtl";
  languageLabel: string;
  nav: { label: string; href: string }[];
  navCta: string;
  menuOpen: string;
  menuClose: string;
  hero: {
    eyebrow: string;
    title: [string, string];
    description: string;
    primary: string;
    secondary: string;
    proofs: string[];
  };
  categories: { kicker: string; title: string; description: string; items: string[]; link: string };
  services: { kicker: string; title: string; description: string; items: Card[] };
  process: { kicker: string; title: string; description: string; items: Step[]; footer: string };
  why: { kicker: string; title: [string, string]; description: string; items: Card[] };
  global: { kicker: string; title: [string, string]; description: string; regions: string[] };
  cta: { kicker: string; title: [string, string]; description: string; primary: string; secondary: string };
  footer: { summary: string; sections: { title: string; links: string[] }[]; legal: string[]; top: string };
};

const en: SiteContent = {
  locale: "en", dir: "ltr", languageLabel: "English",
  nav: [
    { label: "Products", href: "#products" }, { label: "Services", href: "#services" },
    { label: "Process", href: "#process" }, { label: "Quality", href: "#quality" },
    { label: "Global", href: "#global" },
  ],
  navCta: "Start a request", menuOpen: "Open navigation", menuClose: "Close navigation",
  hero: {
    eyebrow: "YOUR SOURCING TEAM ON THE GROUND IN CHINA",
    title: ["Source with clarity.", "Ship with confidence."],
    description: "We connect global buyers with suitable Chinese manufacturers, then coordinate the work from product brief to export-ready shipment.",
    primary: "Tell us what you need", secondary: "Explore product categories",
    proofs: ["One accountable team", "Flexible product categories", "Supplier verification", "Quality-first workflow"],
  },
  categories: {
    kicker: "TEN PRODUCT ROUTES", title: "Many products. One reliable sourcing partner.",
    description: "Our catalogue is intentionally flexible. Tell us the specification—not just the category—and we will map the right supply route.",
    items: ["Industrial & Custom Parts", "Home & Lifestyle", "Packaging & Printing", "Building & Hardware", "Consumer Electronics", "Beauty & Personal Care", "Textiles & Apparel", "Outdoor & Sports", "Gifts & Promotional", "Other Custom Sourcing"],
    link: "Discuss this category",
  },
  services: {
    kicker: "END-TO-END SUPPORT", title: "From a product idea to a dependable shipment.",
    description: "One China-side team keeps suppliers, samples, quality requirements and export milestones aligned.",
    items: [
      { number: "01", title: "Product & Supplier Search", summary: "Shortlist suitable factories against your specification, target price and order needs." },
      { number: "02", title: "Supplier Verification", summary: "Review business credentials, production fit, responsiveness and key commercial risks." },
      { number: "03", title: "Sampling & Customization", summary: "Coordinate samples, materials, packaging, branding and pre-production confirmation." },
      { number: "04", title: "Quality & Export Coordination", summary: "Track quality checkpoints, documents, packing and shipment readiness." },
    ],
  },
  process: {
    kicker: "A CLEAR WORKFLOW", title: "Five steps. One point of contact.",
    description: "A compact process gives every request a clear owner, next action and decision point.",
    items: [
      { number: "01", title: "Share your brief" }, { number: "02", title: "Source & compare" },
      { number: "03", title: "Sample & verify" }, { number: "04", title: "Produce & inspect" },
      { number: "05", title: "Pack & coordinate export" },
    ], footer: "BRIEF · SOURCE · VERIFY · DELIVER",
  },
  why: {
    kicker: "QUALITY BY PROCESS", title: ["Confidence is built", "before the goods leave China."],
    description: "We reduce uncertainty with documented checks and clear approvals—not with unverified promises.",
    items: [
      { number: "A", title: "Specification control", summary: "Key requirements are recorded and confirmed before production." },
      { number: "B", title: "Supplier due diligence", summary: "Factory fit and business information are reviewed for each project." },
      { number: "C", title: "Milestone visibility", summary: "Samples, approvals and production updates stay visible to your team." },
      { number: "D", title: "Pre-shipment checks", summary: "Inspection scope is agreed according to product and order risk." },
    ],
  },
  global: {
    kicker: "CHINA CONNECTED TO YOUR MARKET", title: ["Local execution in China.", "Clear communication worldwide."],
    description: "We bridge language, time zones and supplier coordination for buyers across major international markets.",
    regions: ["North America", "Europe", "Middle East", "Southeast Asia", "Latin America", "Africa"],
  },
  cta: {
    kicker: "START WITH A PRODUCT BRIEF", title: ["What do you want", "to source from China?"],
    description: "Send the product, quantity, target market and timeline. We will reply with the information needed to assess the next step.",
    primary: "Start a request", secondary: "Email our team",
  },
  footer: {
    summary: "China-side sourcing coordination for global buyers—flexible categories, clear process and one accountable team.",
    sections: [
      { title: "Explore", links: ["Products", "Services", "Process", "Quality"] },
      { title: "Connect", links: ["Global markets", "About Fries Global", "Start a request", "Email us"] },
    ], legal: ["Privacy", "Terms"], top: "Back to top",
  },
};

const zh: SiteContent = {
  ...en, locale: "zh", languageLabel: "中文",
  nav: [{ label: "产品类别", href: "#products" }, { label: "服务", href: "#services" }, { label: "流程", href: "#process" }, { label: "质量", href: "#quality" }, { label: "全球市场", href: "#global" }],
  navCta: "提交采购需求", menuOpen: "打开导航", menuClose: "关闭导航",
  hero: { eyebrow: "您在中国的采购与出口协作团队", title: ["清晰采购，", "放心交付。"], description: "我们帮助全球买家匹配合适的中国制造商，并从产品需求到出口交付协调全过程。", primary: "告诉我们您的需求", secondary: "查看产品类别", proofs: ["一个负责到底的团队", "灵活的产品类别", "供应商核验", "质量优先流程"] },
  categories: { kicker: "十大产品方向", title: "产品可以很多，可靠的合作伙伴只需一个。", description: "我们的产品目录保持灵活。请告诉我们具体规格，而不只是品类名称，我们将为您匹配合适的供应路线。", items: ["工业与定制零部件", "家居与生活用品", "包装与印刷", "建材与五金", "消费电子", "美妆与个护", "纺织与服装", "户外与运动", "礼品与促销品", "其他定制采购"], link: "咨询该品类" },
  services: { kicker: "全流程支持", title: "从产品想法，到可靠交付。", description: "一个中国本地团队，让供应商、样品、质量要求与出口节点保持一致。", items: [{ number: "01", title: "产品与供应商搜索", summary: "根据规格、目标价格和订单需求筛选合适工厂。" }, { number: "02", title: "供应商核验", summary: "核查经营资质、生产匹配度、响应能力与关键商业风险。" }, { number: "03", title: "打样与定制", summary: "协调样品、材料、包装、品牌与产前确认。" }, { number: "04", title: "质检与出口协调", summary: "跟进质量节点、单证、包装与出货准备。" }] },
  process: { kicker: "清晰流程", title: "五个步骤，一个对接窗口。", description: "紧凑的工作流程确保每项需求都有明确负责人、下一步与决策点。", items: [{ number: "01", title: "提交需求" }, { number: "02", title: "采购与比选" }, { number: "03", title: "打样与核验" }, { number: "04", title: "生产与检验" }, { number: "05", title: "包装与出口协调" }], footer: "需求 · 寻源 · 核验 · 交付" },
  why: { kicker: "用流程保障质量", title: ["在货物离开中国前，", "把信心建立起来。"], description: "我们用记录清晰的检查与确认减少不确定性，不依赖未经核实的承诺。", items: [{ number: "A", title: "规格控制", summary: "生产前记录并确认关键要求。" }, { number: "B", title: "供应商尽调", summary: "针对每个项目核验工厂匹配度与经营信息。" }, { number: "C", title: "节点可视", summary: "让样品、确认和生产更新对客户保持透明。" }, { number: "D", title: "出货前检查", summary: "根据产品和订单风险约定检验范围。" }] },
  global: { kicker: "让中国供应连接您的市场", title: ["中国本地执行，", "全球清晰沟通。"], description: "为世界主要市场的买家跨越语言、时差和供应商协作障碍。", regions: ["北美", "欧洲", "中东", "东南亚", "拉丁美洲", "非洲"] },
  cta: { kicker: "从产品需求开始", title: ["您想从中国", "采购什么产品？"], description: "请发送产品、数量、目标市场与时间要求，我们将回复评估下一步所需的信息。", primary: "提交采购需求", secondary: "发送邮件" },
  footer: { summary: "为全球买家提供中国本地采购协调：品类灵活、流程清晰、责任明确。", sections: [{ title: "探索", links: ["产品", "服务", "流程", "质量"] }, { title: "联系", links: ["全球市场", "关于薯条出海", "提交需求", "发送邮件"] }], legal: ["隐私政策", "使用条款"], top: "返回顶部" },
};

function localized(locale: Locale, copy: Partial<SiteContent>): SiteContent {
  return { ...en, ...copy, locale, dir: locale === "ar" ? "rtl" : "ltr" } as SiteContent;
}

const es = localized("es", {
  languageLabel: "Español", navCta: "Enviar solicitud",
  nav: [{ label: "Productos", href: "#products" }, { label: "Servicios", href: "#services" }, { label: "Proceso", href: "#process" }, { label: "Calidad", href: "#quality" }, { label: "Mercados", href: "#global" }],
  hero: { eyebrow: "SU EQUIPO DE COMPRAS EN CHINA", title: ["Compre con claridad.", "Envíe con confianza."], description: "Conectamos compradores globales con fabricantes chinos adecuados y coordinamos el proceso hasta el envío.", primary: "Cuéntenos qué necesita", secondary: "Ver categorías", proofs: ["Un equipo responsable", "Categorías flexibles", "Verificación de proveedores", "Calidad primero"] },
  categories: { ...en.categories, kicker: "DIEZ RUTAS DE PRODUCTO", title: "Muchos productos. Un socio de compras fiable.", description: "Nuestro catálogo es flexible. Comparta la especificación y trazaremos la ruta de suministro adecuada.", items: ["Piezas industriales", "Hogar y estilo de vida", "Embalaje e impresión", "Construcción y ferretería", "Electrónica de consumo", "Belleza y cuidado personal", "Textil y confección", "Deporte y aire libre", "Regalos promocionales", "Compras personalizadas"], link: "Consultar categoría" },
  services: { kicker: "SOPORTE INTEGRAL", title: "De una idea de producto a un envío fiable.", description: "Un equipo en China mantiene alineados proveedores, muestras, calidad y exportación.", items: [{ number: "01", title: "Búsqueda de productos y proveedores", summary: "Seleccionamos fábricas según especificación, precio objetivo y volumen." }, { number: "02", title: "Verificación de proveedores", summary: "Revisamos credenciales, capacidad productiva, respuesta y riesgos clave." }, { number: "03", title: "Muestras y personalización", summary: "Coordinamos muestras, materiales, embalaje, marca y confirmación previa." }, { number: "04", title: "Calidad y coordinación de exportación", summary: "Seguimos controles de calidad, documentos, embalaje y preparación del envío." }] },
  process: { kicker: "UN PROCESO CLARO", title: "Cinco pasos. Un solo contacto.", description: "Cada solicitud tiene responsable, siguiente acción y punto de decisión.", items: [{ number: "01", title: "Compartir requisitos" }, { number: "02", title: "Buscar y comparar" }, { number: "03", title: "Muestrear y verificar" }, { number: "04", title: "Producir e inspeccionar" }, { number: "05", title: "Embalar y exportar" }], footer: "REQUISITOS · BÚSQUEDA · VERIFICACIÓN · ENTREGA" },
  why: { kicker: "CALIDAD MEDIANTE PROCESOS", title: ["La confianza se construye", "antes de que la mercancía salga de China."], description: "Reducimos la incertidumbre con controles documentados y aprobaciones claras.", items: [{ number: "A", title: "Control de especificaciones", summary: "Los requisitos clave se registran antes de producir." }, { number: "B", title: "Debida diligencia", summary: "Revisamos la idoneidad y la información comercial de cada fábrica." }, { number: "C", title: "Hitos visibles", summary: "Muestras, aprobaciones y producción permanecen transparentes." }, { number: "D", title: "Control preembarque", summary: "El alcance de inspección se adapta al riesgo del pedido." }] },
  global: { ...en.global, title: ["Ejecución local en China.", "Comunicación clara en todo el mundo."], description: "Superamos idioma, husos horarios y coordinación de proveedores para compradores internacionales.", regions: ["Norteamérica", "Europa", "Oriente Medio", "Sudeste Asiático", "Latinoamérica", "África"] },
  cta: { kicker: "EMPIECE CON SU SOLICITUD", title: ["¿Qué desea", "comprar en China?"], description: "Envíe producto, cantidad, mercado y plazo. Le indicaremos el siguiente paso.", primary: "Enviar solicitud", secondary: "Escribir al equipo" },
  footer: { ...en.footer, summary: "Coordinación de compras en China para compradores globales: categorías flexibles, proceso claro y un equipo responsable.", sections: [{ title: "Explorar", links: ["Productos", "Servicios", "Proceso", "Calidad"] }, { title: "Contacto", links: ["Mercados globales", "Acerca de Fries Global", "Enviar solicitud", "Correo electrónico"] }], legal: ["Privacidad", "Términos"], top: "Volver arriba" },
});

const fr = localized("fr", {
  languageLabel: "Français", navCta: "Lancer une demande",
  nav: [{ label: "Produits", href: "#products" }, { label: "Services", href: "#services" }, { label: "Processus", href: "#process" }, { label: "Qualité", href: "#quality" }, { label: "Marchés", href: "#global" }],
  hero: { eyebrow: "VOTRE ÉQUIPE SOURCING EN CHINE", title: ["Sourcez avec clarté.", "Expédiez en confiance."], description: "Nous relions les acheteurs internationaux aux fabricants chinois adaptés et coordonnons chaque étape jusqu’à l’expédition.", primary: "Parlez-nous de votre besoin", secondary: "Voir les catégories", proofs: ["Une équipe responsable", "Catégories flexibles", "Fournisseurs vérifiés", "Priorité à la qualité"] },
  categories: { ...en.categories, kicker: "DIX UNIVERS PRODUITS", title: "De nombreux produits. Un partenaire sourcing fiable.", description: "Notre catalogue reste flexible. Partagez vos spécifications et nous définirons la bonne filière.", items: ["Pièces industrielles", "Maison et art de vivre", "Emballage et impression", "Bâtiment et quincaillerie", "Électronique grand public", "Beauté et soins", "Textile et habillement", "Sport et plein air", "Cadeaux promotionnels", "Sourcing sur mesure"], link: "Discuter de cette catégorie" },
  services: { kicker: "ACCOMPAGNEMENT COMPLET", title: "D'une idée produit à une expédition fiable.", description: "Une équipe en Chine aligne fournisseurs, échantillons, qualité et export.", items: [{ number: "01", title: "Recherche produit et fournisseur", summary: "Sélection des usines selon vos spécifications, prix cible et volume." }, { number: "02", title: "Vérification des fournisseurs", summary: "Contrôle des références, capacités, réactivité et principaux risques." }, { number: "03", title: "Échantillons et personnalisation", summary: "Coordination des matériaux, emballages, marques et validations." }, { number: "04", title: "Qualité et export", summary: "Suivi des contrôles, documents, emballage et préparation de l’expédition." }] },
  process: { kicker: "UN PROCESSUS CLAIR", title: "Cinq étapes. Un interlocuteur.", description: "Chaque demande possède un responsable, une prochaine action et un point de décision.", items: [{ number: "01", title: "Partager le besoin" }, { number: "02", title: "Rechercher et comparer" }, { number: "03", title: "Échantillonner et vérifier" }, { number: "04", title: "Produire et inspecter" }, { number: "05", title: "Emballer et exporter" }], footer: "BESOIN · SOURCING · VÉRIFICATION · LIVRAISON" },
  why: { kicker: "LA QUALITÉ PAR LE PROCESSUS", title: ["La confiance se construit", "avant le départ des marchandises."], description: "Nous réduisons l’incertitude grâce à des contrôles documentés et des validations claires.", items: [{ number: "A", title: "Maîtrise des spécifications", summary: "Les exigences clés sont enregistrées avant production." }, { number: "B", title: "Audit fournisseur", summary: "L’adéquation et les informations commerciales sont vérifiées." }, { number: "C", title: "Étapes visibles", summary: "Échantillons, validations et production restent transparents." }, { number: "D", title: "Contrôle avant expédition", summary: "Le périmètre d’inspection dépend du risque de la commande." }] },
  global: { ...en.global, title: ["Exécution locale en Chine.", "Communication claire dans le monde."], description: "Nous franchissons les barrières de langue, de fuseaux horaires et de coordination fournisseurs.", regions: ["Amérique du Nord", "Europe", "Moyen-Orient", "Asie du Sud-Est", "Amérique latine", "Afrique"] },
  cta: { kicker: "COMMENCEZ PAR VOTRE BESOIN", title: ["Que souhaitez-vous", "sourcer en Chine ?"], description: "Envoyez le produit, la quantité, le marché et le délai. Nous vous indiquerons la prochaine étape.", primary: "Lancer une demande", secondary: "Écrire à l’équipe" },
  footer: { ...en.footer, summary: "Coordination sourcing en Chine pour les acheteurs mondiaux : catégories flexibles, processus clair et équipe responsable.", sections: [{ title: "Explorer", links: ["Produits", "Services", "Processus", "Qualité"] }, { title: "Contact", links: ["Marchés mondiaux", "À propos", "Lancer une demande", "E-mail"] }], legal: ["Confidentialité", "Conditions"], top: "Haut de page" },
});

const de = localized("de", {
  languageLabel: "Deutsch", navCta: "Anfrage starten",
  nav: [{ label: "Produkte", href: "#products" }, { label: "Leistungen", href: "#services" }, { label: "Ablauf", href: "#process" }, { label: "Qualität", href: "#quality" }, { label: "Märkte", href: "#global" }],
  hero: { eyebrow: "IHR SOURCING-TEAM VOR ORT IN CHINA", title: ["Klar beschaffen.", "Sicher versenden."], description: "Wir verbinden internationale Käufer mit passenden chinesischen Herstellern und koordinieren den Weg bis zum Versand.", primary: "Bedarf mitteilen", secondary: "Kategorien ansehen", proofs: ["Ein verantwortliches Team", "Flexible Kategorien", "Lieferantenprüfung", "Qualität zuerst"] },
  categories: { ...en.categories, kicker: "ZEHN PRODUKTBEREICHE", title: "Viele Produkte. Ein verlässlicher Sourcing-Partner.", description: "Unser Katalog bleibt flexibel. Teilen Sie Ihre Spezifikation und wir finden den passenden Lieferweg.", items: ["Industrie- und Sonderteile", "Wohnen und Lifestyle", "Verpackung und Druck", "Bau und Beschläge", "Unterhaltungselektronik", "Beauty und Körperpflege", "Textilien und Bekleidung", "Outdoor und Sport", "Werbeartikel", "Individuelles Sourcing"], link: "Kategorie besprechen" },
  services: { kicker: "END-TO-END-SUPPORT", title: "Von der Produktidee zur zuverlässigen Lieferung.", description: "Ein Team in China hält Lieferanten, Muster, Qualität und Export auf Kurs.", items: [{ number: "01", title: "Produkt- und Lieferantensuche", summary: "Fabrikauswahl nach Spezifikation, Zielpreis und Bestellmenge." }, { number: "02", title: "Lieferantenprüfung", summary: "Prüfung von Nachweisen, Fertigungseignung, Reaktion und Risiken." }, { number: "03", title: "Muster und Anpassung", summary: "Koordination von Materialien, Verpackung, Marke und Freigaben." }, { number: "04", title: "Qualität und Export", summary: "Verfolgung von Prüfungen, Dokumenten, Verpackung und Versandbereitschaft." }] },
  process: { kicker: "KLARER ABLAUF", title: "Fünf Schritte. Ein Ansprechpartner.", description: "Jede Anfrage hat einen Verantwortlichen, die nächste Aktion und klare Entscheidungspunkte.", items: [{ number: "01", title: "Anforderung teilen" }, { number: "02", title: "Suchen und vergleichen" }, { number: "03", title: "Muster und prüfen" }, { number: "04", title: "Produzieren und inspizieren" }, { number: "05", title: "Verpacken und exportieren" }], footer: "BRIEFING · SUCHE · PRÜFUNG · LIEFERUNG" },
  why: { kicker: "QUALITÄT DURCH PROZESS", title: ["Vertrauen entsteht,", "bevor die Ware China verlässt."], description: "Dokumentierte Prüfungen und klare Freigaben reduzieren Unsicherheit.", items: [{ number: "A", title: "Spezifikationskontrolle", summary: "Wichtige Anforderungen werden vor Produktion bestätigt." }, { number: "B", title: "Lieferantenprüfung", summary: "Eignung und Geschäftsinformationen werden projektbezogen geprüft." }, { number: "C", title: "Sichtbare Meilensteine", summary: "Muster, Freigaben und Produktion bleiben transparent." }, { number: "D", title: "Versandkontrolle", summary: "Der Prüfumfang richtet sich nach Produkt- und Auftragsrisiko." }] },
  global: { ...en.global, title: ["Lokale Umsetzung in China.", "Klare Kommunikation weltweit."], description: "Wir überbrücken Sprache, Zeitzonen und Lieferantenkoordination für internationale Käufer.", regions: ["Nordamerika", "Europa", "Naher Osten", "Südostasien", "Lateinamerika", "Afrika"] },
  cta: { kicker: "STARTEN SIE MIT IHREM BRIEFING", title: ["Was möchten Sie", "aus China beziehen?"], description: "Senden Sie Produkt, Menge, Zielmarkt und Zeitplan. Wir melden uns mit dem nächsten Schritt.", primary: "Anfrage starten", secondary: "E-Mail senden" },
  footer: { ...en.footer, summary: "Beschaffungskoordination in China für globale Käufer: flexible Kategorien, klarer Prozess, verantwortliches Team.", sections: [{ title: "Entdecken", links: ["Produkte", "Leistungen", "Ablauf", "Qualität"] }, { title: "Kontakt", links: ["Globale Märkte", "Über Fries Global", "Anfrage starten", "E-Mail"] }], legal: ["Datenschutz", "Bedingungen"], top: "Nach oben" },
});

const ar = localized("ar", {
  languageLabel: "العربية", navCta: "ابدأ طلباً",
  nav: [{ label: "المنتجات", href: "#products" }, { label: "الخدمات", href: "#services" }, { label: "العملية", href: "#process" }, { label: "الجودة", href: "#quality" }, { label: "الأسواق", href: "#global" }],
  hero: { eyebrow: "فريق التوريد الخاص بك على أرض الصين", title: ["توريد بوضوح.", "وشحن بثقة."], description: "نربط المشترين العالميين بالمصنّعين الصينيين المناسبين وننسّق العمل حتى يصبح الطلب جاهزاً للشحن.", primary: "أخبرنا بما تحتاج", secondary: "استكشف الفئات", proofs: ["فريق واحد مسؤول", "فئات مرنة", "التحقق من الموردين", "الجودة أولاً"] },
  categories: { ...en.categories, kicker: "عشرة مسارات للمنتجات", title: "منتجات كثيرة. وشريك توريد موثوق واحد.", description: "قائمتنا مرنة. شارك المواصفات وسنحدد مسار التوريد المناسب.", items: ["قطع صناعية ومخصصة", "المنزل ونمط الحياة", "التغليف والطباعة", "البناء والأدوات", "الإلكترونيات الاستهلاكية", "الجمال والعناية الشخصية", "المنسوجات والملابس", "الرياضة والهواء الطلق", "الهدايا الترويجية", "توريد مخصص"], link: "ناقش هذه الفئة" },
  services: { kicker: "دعم متكامل", title: "من فكرة المنتج إلى شحنة موثوقة.", description: "فريق واحد في الصين ينسق الموردين والعينات والجودة والتصدير.", items: [{ number: "01", title: "البحث عن المنتجات والموردين", summary: "اختيار المصانع وفق المواصفات والسعر المستهدف والكمية." }, { number: "02", title: "التحقق من الموردين", summary: "مراجعة التراخيص والقدرة الإنتاجية والاستجابة والمخاطر." }, { number: "03", title: "العينات والتخصيص", summary: "تنسيق المواد والتغليف والعلامة التجارية والموافقات." }, { number: "04", title: "الجودة والتصدير", summary: "متابعة الفحص والمستندات والتعبئة والاستعداد للشحن." }] },
  process: { kicker: "سير عمل واضح", title: "خمس خطوات. نقطة اتصال واحدة.", description: "لكل طلب مسؤول وخطوة تالية ونقطة قرار واضحة.", items: [{ number: "01", title: "مشاركة المتطلبات" }, { number: "02", title: "البحث والمقارنة" }, { number: "03", title: "العينات والتحقق" }, { number: "04", title: "الإنتاج والفحص" }, { number: "05", title: "التعبئة والتصدير" }], footer: "المتطلبات · البحث · التحقق · التسليم" },
  why: { kicker: "الجودة عبر الإجراءات", title: ["تُبنى الثقة", "قبل مغادرة البضائع للصين."], description: "نقلل عدم اليقين بفحوص موثقة وموافقات واضحة.", items: [{ number: "A", title: "ضبط المواصفات", summary: "تسجيل المتطلبات الأساسية قبل الإنتاج." }, { number: "B", title: "العناية الواجبة", summary: "فحص ملاءمة المصنع ومعلوماته التجارية." }, { number: "C", title: "مراحل مرئية", summary: "تبقى العينات والموافقات وتحديثات الإنتاج واضحة." }, { number: "D", title: "فحص ما قبل الشحن", summary: "يُحدد نطاق الفحص حسب مخاطر المنتج والطلب." }] },
  global: { ...en.global, title: ["تنفيذ محلي في الصين.", "وتواصل واضح عالمياً."], description: "نتجاوز عوائق اللغة والتوقيت وتنسيق الموردين للمشترين الدوليين.", regions: ["أمريكا الشمالية", "أوروبا", "الشرق الأوسط", "جنوب شرق آسيا", "أمريكا اللاتينية", "أفريقيا"] },
  cta: { kicker: "ابدأ بمواصفات المنتج", title: ["ماذا تريد أن", "تورّد من الصين؟"], description: "أرسل المنتج والكمية والسوق والجدول الزمني وسنوضح الخطوة التالية.", primary: "ابدأ طلباً", secondary: "راسل فريقنا" },
  footer: { ...en.footer, summary: "تنسيق التوريد من الصين للمشترين العالميين: فئات مرنة وإجراءات واضحة وفريق مسؤول.", sections: [{ title: "استكشف", links: ["المنتجات", "الخدمات", "العملية", "الجودة"] }, { title: "تواصل", links: ["الأسواق العالمية", "عن Fries Global", "ابدأ طلباً", "البريد الإلكتروني"] }], legal: ["الخصوصية", "الشروط"], top: "العودة للأعلى" },
});

export const siteContent: Record<Locale, SiteContent> = { en, zh, es, fr, de, ar };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
