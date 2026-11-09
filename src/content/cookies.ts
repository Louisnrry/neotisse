/**
 * Textes du bandeau « Cookies & confidentialité », repris du bandeau Complianz de la V1.
 * TODO(sanity) : rendre ces textes éditables (document `siteSettings`) si l’association le souhaite.
 */
export const cookieBannerContent = {
  title: "Cookies & confidentialité",
  message:
    "Nous utilisons des cookies de mesure d’audience pour comprendre comment le site est utilisé. Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment.",
  accept: "Accepter",
  deny: "Refuser",
  customize: "Personnaliser",
  save: "Enregistrer mes choix",
  alwaysActive: "Toujours activé",
  categories: {
    functional: {
      title: "Fonctionnel",
      description:
        "L’accès ou le stockage technique est strictement nécessaire dans la finalité d’intérêt légitime de permettre l’utilisation d’un service spécifique explicitement demandé par l’abonné ou l’utilisateur, ou dans le seul but d’effectuer la transmission d’une communication sur un réseau de communications électroniques.",
    },
    statistics: {
      title: "Statistiques",
      description: "Le stockage ou l’accès technique qui est utilisé exclusivement à des fins statistiques.",
    },
  },
} as const;
