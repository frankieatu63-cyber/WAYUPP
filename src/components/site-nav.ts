/** Home-page sections the navigation points to. Labels come from the dictionary (`t.nav[key]`). */
export const NAV_LINKS = [
  { key: "servicios", anchor: "servicios" },
  { key: "metodo", anchor: "metodo" },
  { key: "nosotros", anchor: "sobre-nosotros" },
  { key: "contacto", anchor: "contacto" },
] as const;

export const CONTACT_EMAIL = "hola@wayup.es";

/** `mailto:` link for the audit request; the subject comes from the dictionary (`t.contact.mailSubject`). */
export const auditMailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/somoswayup/",
};
