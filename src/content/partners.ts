/**
 * Partenaires, en attendant Sanity (type `partner`, CLAUDE.md § 8).
 * TODO(sanity) : remplacer par une requête GROQ. Données reprises du WordPress V1, dans l’ordre manuel.
 */
export type Partner = {
  name: string;
  /** Texte alternatif du logo */
  logoAlt: string;
  logo: { src: string; width: number; height: number };
  description?: string;
  url?: string;
};

export const partners: Partner[] = [
  {
    name: "Festival du Lin",
    logoAlt: "Festival du Lin",
    logo: { src: "/images/partenaires/festival-lin.png", width: 474, height: 474 },
    description: "Ateliers participatifs et conférence.",
  },
  {
    name: "Musée Henri Prades",
    logoAlt: "Musée Henri Prades, site archéologique Lattara",
    logo: { src: "/images/partenaires/lattes.png", width: 848, height: 489 },
    description: "Atelier démonstratif et explicatif.",
    url: "https://museearcheo.montpellier3m.fr/",
  },
  {
    name: "Musée de Gergovie",
    logoAlt: "Musée de Gergovie",
    logo: { src: "/images/partenaires/gergovie.png", width: 350, height: 250 },
    description: "Fête de Beltaine : atelier démonstratif et explicatif, atelier participatif.",
    url: "https://musee-gergovie.fr/",
  },
  {
    name: "CERAC",
    logoAlt: "CERAC",
    logo: { src: "/images/partenaires/cerac.webp", width: 1024, height: 1024 },
    description: "Forum de l’archéologie : atelier démonstratif et explicatif.",
  },
  {
    name: "Musée de Tautavel",
    logoAlt: "Musée de Tautavel",
    logo: { src: "/images/partenaires/tautavel.png", width: 3086, height: 1524 },
    description: "Fête de la préhistoire : atelier démonstratif et explicatif, ateliers enfants.",
    url: "https://www.450000ans.com/",
  },
  {
    name: "Lozère Tourisme",
    logoAlt: "Lozère Tourisme",
    logo: { src: "/images/partenaires/lozere.png", width: 940, height: 626 },
    url: "https://www.lozere-tourisme.com/",
  },
  {
    name: "Université Paul-Valéry Montpellier 3",
    logoAlt: "Université Paul-Valéry Montpellier 3",
    logo: { src: "/images/partenaires/upv.webp", width: 500, height: 356 },
    description: "Forum régional de l’archéologie : atelier démonstratif et explicatif.",
    url: "https://www.univ-montp3.fr/",
  },
];
