/** Spanish is the source dictionary: its shape defines the Dictionary type every language must match. */
export const es = {
  langName: "Español",
  langSwitcher: "Cambiar idioma",
  meta: {
    homeTitle: "Way Up — Más clientes para tu negocio, con Soberanía Digital",
    homeDescription:
      "Agencia de marketing en Salamanca: webs que convierten, SEO local y automatización con IA. Te acompañamos hasta que puedas crecer por tu cuenta.",
    privacyDescription: "Cómo trata Way Up tus datos personales.",
    termsDescription: "Condiciones de uso del sitio web y servicios de Way Up.",
  },
  nav: {
    servicios: "Servicios",
    metodo: "Método",
    nosotros: "Sobre nosotros",
    contacto: "Contacto",
  },
  header: {
    homeLabel: "Way Up — inicio",
    cta: "Solicitar auditoría gratuita",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    mainNav: "Principal",
    mobileNav: "Menú móvil",
  },
  hero: {
    eyebrow: "Soberanía digital para negocios",
    headline: [
      { word: "Más" },
      { word: "clientes" },
      { word: "para" },
      { word: "tu" },
      { word: "negocio," },
      { word: "sin" },
      { word: "depender" },
      { word: "de" },
      { word: "una" },
      { word: "agencia" },
      { word: "para", accent: true },
      { word: "siempre", accent: true },
    ] as { word: string; accent?: boolean }[],
    /** Space between headline chunks; empty for languages written without spaces. */
    wordGap: true,
    subtitle:
      "Unimos el marketing de siempre con lo digital: tu página web, tu presencia en Google y estrategias que traen llamadas y clientes reales. Una visión 360° de tu negocio, con formación incluida para que acabes llevando el control tú.",
    ctaPrimary: "Pide tu diagnóstico gratuito",
    ctaSecondary: "Hablar con Way Up",
    trust: ["Diagnóstico gratuito", "Sin permanencia", "Formación incluida"],
  },
  searchCard: {
    query: "El mejor negocio cerca de mí",
    business: "Tu negocio",
    rating: "4,9 · Justo donde te buscan",
    agendaTitle: "De la búsqueda a tu agenda",
    agendaText: "Una nueva oportunidad para tu negocio.",
    appointment: "+1 cita",
    tagline: "Visibilidad real. Oportunidades reales.",
  },
  services: {
    eyebrow: "Marketing integral 360°",
    title: "Lo que construimos contigo.",
    intro: "Unimos lo tradicional y lo digital en un único sistema que trabaja para tu negocio.",
    cta: "Quiero esto para mi negocio",
    items: [
      {
        title: "Estrategia & Publicidad 360°",
        description:
          "Campañas de marketing offline y online, branding corporativo y captación de clientes a medida.",
        points: ["Campañas en Meta y Google Ads", "Branding e identidad visual", "Publicidad local y offline"],
      },
      {
        title: "Landing Pages & SEO Local",
        description:
          "Webs de alta conversión y dominio absoluto de Google Maps y las búsquedas de tu ciudad.",
        points: ["Páginas que convierten visitas en llamadas", "Ficha de Google optimizada", "Reseñas y reputación"],
      },
      {
        title: "Automatización & Agentes IA",
        description: "Sistemas inteligentes para atender, cualificar y cerrar clientes 24/7.",
        points: ["Respuesta inmediata en WhatsApp", "Cualificación automática", "Agenda y recordatorios"],
      },
    ],
  },
  method: {
    eyebrow: "El método Way Up",
    titleBefore: "Las 3 fases de tu ",
    titleAccent: "Soberanía Digital",
    titleAfter: ".",
    intro:
      "Las agencias que te hacen dependiente no te hacen libre. Nosotros invertimos el modelo: empezamos haciéndolo por ti y terminamos con tu negocio volando solo.",
    tablistLabel: "Fases del método",
    autonomy: "Tu nivel de autonomía",
    phases: [
      {
        label: "Fase 1",
        title: "Impulso Inicial",
        tag: "Dependencia controlada",
        duration: "Meses 1–3",
        description:
          "Tomamos el control operativo desde el primer día. Montamos tu web, tu ficha de Google y tus primeras campañas para conseguir resultados rápidos mientras tú te centras en atender a tus clientes.",
        deliverables: [
          "Auditoría y diagnóstico completo",
          "Landing page de alta conversión",
          "Google Business Profile optimizado",
          "Primeras campañas y victorias rápidas",
        ],
      },
      {
        label: "Fase 2",
        title: "Mentoría, Formación y Entrega de Herramientas",
        tag: "Empoderamiento",
        duration: "Meses 4–6",
        description:
          "Te enseñamos el porqué de cada acción. Accedes a los módulos de nuestra academia, a un arsenal de herramientas y plantillas, y a guías paso a paso para que entiendas y gestiones tu ecosistema digital.",
        deliverables: [
          "Módulos de la Academia Way Up",
          "Arsenal de herramientas configuradas",
          "Plantillas listas para usar",
          "Sesiones de mentoría y guías prácticas",
        ],
      },
      {
        label: "Fase 3",
        title: "Autonomía y Sostenibilidad",
        tag: "Dominio del nicho",
        duration: "Mes 7 en adelante",
        description:
          "Rompes las cadenas de dependencia. Gestionas tus campañas de forma independiente, con tus cuentas, tus datos y tu método. Tu reino digital es tuyo — y nosotros seguimos a un mensaje de distancia si lo necesitas.",
        deliverables: [
          "Campañas gestionadas por tu equipo",
          "Cuentas y datos 100% a tu nombre",
          "Cuadro de mando propio",
          "Revisiones puntuales bajo demanda",
        ],
      },
    ],
  },
  cases: {
    eyebrow: "Casos de éxito",
    title: "Negocios reales. Resultados que se notan.",
    prev: "Caso anterior",
    next: "Caso siguiente",
    viewCase: "Ver caso",
    before: "Antes",
    after: "Después",
    items: [
      {
        sector: "Centro de acondicionamiento deportivo",
        name: "Performance Lab",
        city: "Salamanca",
        quote:
          "Antes vivíamos del boca a boca. Ahora la agenda se llena sola y, lo mejor, sabemos gestionar las campañas nosotros mismos.",
        author: "Director del centro",
        metrics: [
          { label: "Solicitudes al mes", before: "6", after: "41" },
          { label: "Posición en Google Maps", before: "Top 20", after: "Top 3" },
          { label: "Coste por cliente", before: "38 €", after: "14 €" },
        ],
      },
      {
        sector: "Reformas integrales",
        name: "Reformas Tormes",
        city: "Salamanca",
        quote:
          "El agente de WhatsApp responde en minutos y filtra a quien de verdad quiere reformar. Cerramos el triple de presupuestos.",
        author: "Gerente",
        metrics: [
          { label: "Llamadas al mes", before: "9", after: "34" },
          { label: "Presupuestos cerrados", before: "12 %", after: "31 %" },
          { label: "Tiempo de respuesta", before: "24 h", after: "5 min" },
        ],
      },
      {
        sector: "Clínica de fisioterapia",
        name: "Fisio Plaza",
        city: "Valladolid",
        quote:
          "Pasamos de depender del teléfono a tener citas reservadas online cada día. Y entendemos cada número del panel.",
        author: "Fisioterapeuta y fundadora",
        metrics: [
          { label: "Citas online al mes", before: "0", after: "120" },
          { label: "Reseñas en Google", before: "14", after: "186" },
          { label: "Citas no presentadas", before: "22 %", after: "6 %" },
        ],
      },
    ],
  },
  about: {
    posterAlt:
      "Cartel de Way Up: elevamos marcas, impulsamos tu crecimiento, tú mantienes el control",
    badge: "de las herramientas quedan a tu nombre",
    eyebrow: "Sobre nosotros",
    titleMain: "Las agencias te hacen dependiente. ",
    titleAccent: "Nosotros no.",
    p1: "Way Up nace en Salamanca con una idea sencilla: un negocio local merece crecer en digital sin quedarse atado a nadie. Unimos el marketing tradicional que ya funciona con las herramientas digitales que hoy deciden quién recibe la llamada.",
    p2: "Primero lo hacemos por ti. Después te enseñamos a hacerlo. Al final, lo haces tú. Eso es la Soberanía Digital.",
    values: [
      { title: "Transparencia total", text: "Cuentas, datos y accesos a tu nombre desde el primer día." },
      { title: "Formación real", text: "Te explicamos el porqué de cada acción, no solo el qué." },
      { title: "Resultados medibles", text: "Llamadas, citas y clientes. Nada de métricas de vanidad." },
    ],
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Cómo trabajamos, paso a paso.",
    intro: "Respuestas rápidas, sin rodeos, sobre plazos, formación y tu autonomía.",
    cta: "¿Otra duda? Escríbenos",
    items: [
      {
        q: "¿Cuánto tarda en estar lista mi landing page?",
        a: "Entre 2 y 3 semanas desde el diagnóstico. En la primera semana definimos mensaje y estructura; en la segunda diseñamos y desarrollamos; y antes de publicar la revisamos contigo hasta que esté perfecta.",
      },
      {
        q: "¿Cómo funciona la formación y la mentoría?",
        a: "En la Fase 2 te entregamos plantillas, accesos configurados y sesiones prácticas. Te enseñamos el porqué de cada acción para que entiendas tu ecosistema digital y puedas gestionarlo con confianza.",
      },
      {
        q: "¿Necesito conocimientos técnicos?",
        a: "No. Empezamos desde cero y a tu ritmo. Todo lo que te enseñamos está pensado para dueños de negocio, no para programadores: guías claras, vídeos cortos y acompañamiento real.",
      },
      {
        q: "¿De quién son la web, las cuentas y los datos?",
        a: "Tuyos, desde el primer día. Dominio, web, Google Business Profile, cuentas publicitarias y datos de clientes se crean a tu nombre. Si un día decides seguir solo, no pierdes nada.",
      },
      {
        q: "¿Hay permanencia?",
        a: "No trabajamos con permanencias. Nuestro objetivo es que llegues a la Fase 3 y no nos necesites; te quedas con nosotros solo mientras te aportemos valor.",
      },
      {
        q: "¿Qué pasa si necesito ayuda después de la Fase 3?",
        a: "Seguimos a un mensaje de distancia. Puedes contratar revisiones puntuales, nuevas campañas o formación avanzada cuando lo necesites, sin compromisos.",
      },
    ],
  },
  contact: {
    eyebrow: "Auditoría gratuita",
    title: "¿Estás perdiendo clientes por tu web?",
    text: "Analizamos tu web, tu ficha de Google y tu competencia, y te decimos exactamente dónde se escapan tus clientes. Sin compromiso.",
    ctaPrimary: "Solicitar auditoría gratuita",
    ctaSecondary: "Hablar con Way Up",
    location: "Salamanca, Castilla y León",
    mailSubject: "Solicitud de auditoría gratuita",
  },
  footer: {
    tagline:
      "Marketing para negocios locales con un objetivo claro: que un día crezcas sin depender de nadie.",
    navLabel: "Pie de página",
    navTitle: "Navegación",
    legalTitle: "Legal",
    privacy: "Política de privacidad",
    terms: "Términos y condiciones",
    rights: "Todos los derechos reservados.",
    madeIn: "Hecho en Salamanca para negocios que quieren volar solos.",
  },
  legal: {
    eyebrow: "Legal",
    privacy: {
      title: "Política de privacidad",
      intro:
        "En Way Up respetamos tu privacidad. Esta página explica qué datos recogemos cuando nos contactas y para qué los usamos.",
      sections: [
        {
          h: "Qué datos recogemos",
          p: "Solo los datos que nos facilitas voluntariamente al escribirnos: nombre, correo electrónico, teléfono y la información sobre tu negocio que quieras compartir.",
        },
        {
          h: "Para qué los usamos",
          p: "Para responder a tu solicitud, preparar tu diagnóstico o auditoría y, si lo aceptas, enviarte información relacionada con nuestros servicios.",
        },
      ],
      rightsTitle: "Tus derechos",
      rightsText:
        "Puedes acceder, rectificar o suprimir tus datos en cualquier momento escribiendo a",
    },
    terms: {
      title: "Términos y condiciones",
      intro: "Al utilizar este sitio web aceptas estas condiciones. Si tienes cualquier duda, escríbenos a",
      sections: [
        {
          h: "Uso del sitio",
          p: "Los contenidos de esta web son informativos. Las condiciones concretas de cada servicio se detallan en la propuesta personalizada que entregamos a cada cliente.",
        },
        {
          h: "Propiedad intelectual",
          p: "Los textos, imágenes y la marca Way Up pertenecen a sus titulares y no pueden reproducirse sin autorización.",
        },
      ],
    },
  },
};

export type Dictionary = typeof es;
