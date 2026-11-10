# TODO — Néotisse V2

> À tenir à jour pendant le travail : cocher ce qui est fait, ajouter ce qui est découvert.
> Dernière mise à jour : 10/11/2026.

## Phase 1 : design (en cours)

### Fait
- [x] Projet Next.js 16 + TypeScript + Tailwind v4 initialisé à la racine du dépôt (npm)
- [x] Design extrait du WordPress V1 (styles globaux + extension `neotisse-core`) et documenté dans `docs/DESIGN.md`
- [x] Tokens de design dans `src/app/globals.css` (couleurs, polices, tailles, espacements, largeurs)
- [x] Polices Cormorant Garamond et Quicksand auto-hébergées (fichiers variables de la V1, `next/font/local`)
- [x] Assets repris de la V1 : logo, textures de lin, photos du héro, logos des 7 partenaires
- [x] Composants de base : `Button`, `RuledTitle`, `ThreadHeading`, `Kicker`, `Subtitle`, `PullQuote`, `Eyebrow`, `Section`, `Container`, `PhotoPlaceholder`, `Card`, `Stars`, `TextField`, `TextArea`, `Checkbox`, `FormMessage`, `FormLegal`
- [x] En-tête : collant, masqué au scroll vers le bas, transparent sur l’accueil, menu burger accessible sous 960px
- [x] Pied de page en 3 colonnes
- [x] Page `/styleguide` (non indexée) qui montre tous les éléments
- [x] Vérifié : build, lint et TypeScript OK ; pas de défilement horizontal à 375px ; menu burger (focus, Échap) ; comportement de l’en-tête au scroll
- [x] **Accueil complet** (09/11) : intro animée, héro, bandeau partenaires défilant, univers Néotisse, prochain événement, tuiles ateliers, 4 derniers avis, contact
  - Contenus provisoires dans `src/content/` (`home.ts`, `events.ts`, `partners.ts`, `reviews.ts`), repris du WordPress
  - Dates en français selon les règles de la V1 (`src/lib/dates.ts`), testées
  - Comparé à la V1 à 1440px (positions et hauteurs identiques à quelques pixels) et à 375px (pas de débordement, même largeur de contenu)
  - Vérifié : intro (lecture puis ouverture, à chaque visite, y compris en revenant par le logo), bandeau en pause au focus, copies des logos hors clavier, tuiles (zoom + contour encre au clavier)
- [x] **Nouvelle intro** (10/11) : « Néotisse » en Eagle Lake qui s’écrit à la plume avec Motion (N centré qui se trace, glisse, puis le reste du mot), ouverture conservée ; vérifié à 1440 et 375px (coupe entre « Néo » et « tisse », copies alignées) et au clic (le mot se termine pendant l’ouverture)
- [x] **Défilement doux avec Lenis** (10/11) : inertie légère, natif au doigt ; vérifié : molette lissée (≈ 0,8 s), ancres douces à 110px sous l’en-tête, changement de page instantané en haut, pause pendant l’intro, le menu mobile et la modale du calendrier
- [x] **Nouvelle navbar** (10/11) d’après la maquette Figma « navbar à faire » : barre flottante crème arrondie, « Néotisse » en Eagle Lake au centre, « Contact » à droite ; comportement conservé ; vérifiée à 1440, 1200 et 375px (mot centré, pas de débordement), menu burger (focus, Échap), accueil transparent avec texte crème lisible sur la photo
- [x] **Titres en Eagle Lake** (10/11) : police auto-hébergée, tailles adaptées ; vérifié à 375px sur les 9 pages (aucun débordement, après correction du titre du mois du calendrier) et à 1440px
- [x] **GSAP installé** (10/11) : `gsap` et `@gsap/react`, en plus de Motion et Lenis ; répartition et règles dans `docs/DESIGN.md` § 10 bis
- [x] **Ateliers de l'accueil refaits** (10/11) d'après la maquette de Louis : section épinglée (un atelier à la fois, texte et carte en fondu qui remontent, fil vertical en 3 parties), empilés sous 900px, accroche des ateliers reprise de Sanity ; vérifié à 1440 et 375px et au clavier
- [x] **Interlettrage des titres** (10/11) : -0.05em (titres) et -0.03em (titres à filets), choisis par Louis avec un panneau à curseurs provisoire, retiré ensuite
- [x] **Animations d'apparition** (10/11) avec Motion : titres (mots en fondu + filets et fil rouge qui s'étendent), images (fondu et montée), paragraphes courts écrits lettre par lettre ; une fois par élément, reduced-motion et sans-JS gérés ; vérifié à 1440 et 375px (aucun débordement sur les 9 pages)
- [ ] Si une animation GSAP ScrollTrigger est ajoutée : brancher Lenis dessus (voir `docs/DESIGN.md` § 10 bis)
- [x] Bouton « Écrivez-nous » du pied de page de nouveau lisible (il était crème sur crème)
- [x] URL avec barre finale, identiques à la V1 (`trailingSlash: true`)
- [x] **Page Ateliers** (09/11) : en-tête avec index d'ancres, 5 ateliers en alternance (repères, textes complets), bloc rouge « Des ateliers de tissage adaptés à vos projets » ; textes et SEO repris du WordPress (`src/content/ateliers.ts`) ; comparée à la V1 à 1440 et 375px
- [x] Tous les `.md` rangés dans `docs/` ; `next dev` ne recrée plus `AGENTS.md` à la racine
- [x] **Page À propos** (09/11) : en-tête, démarche, 3 engagements décalés, médiation par le geste, équipe, « Travaillons ensemble »
  - Textes repris du WordPress (page 19) dans `src/content/a-propos.ts`
  - Comparée à la V1 à 1024px (positions identiques au pixel jusqu’à l’équipe) et à 375px (mêmes hauteurs de blocs, pas de débordement)

- [x] **Page Partenaires** (09/11) : en-tête, grille des 7 cartes (logo sur toile de lin, nom lié au site, description), bloc « Devenir l’un de nos partenaires ? » sur fond pierre
  - Textes et SEO repris du WordPress (page 13) dans `src/content/partenaires.ts` ; textes alternatifs des logos alignés sur la V1
  - Comparée à la V1 à 1024px (positions identiques à 3–5px près) et à 375px (pas de débordement)

- [x] **Page Contact** (09/11) : coordonnées, formulaire « Écrivez-nous » (validation côté client, champ piège, délai de 2s), FAQ en accordéon (10 questions, `<details>` natif) avec balisage FAQPage
  - Textes, téléphone et SEO repris du WordPress (page 11) dans `src/content/contact.ts`
  - Comparée à la V1 à 1024px (positions identiques à quelques pixels près) et à 375px (pas de débordement)

- [x] **Page Livre d’or** (09/11) : note moyenne, avis 5 par 5 avec « Plus d’avis », formulaire « Signer le livre d’or » (note en étoiles accessible, validation côté client, champ piège, délai de 2s), mention RGPD
  - Textes et SEO repris du WordPress (page 126) dans `src/content/livre-dor.ts`
  - Comparée à la V1 à 1440px et à 375px (pas de débordement)

- [x] **Page Mentions légales** (09/11) : en-tête (H1 à filets + date de mise à jour), 7 rubriques en colonne de 760px, `noindex, follow`
  - Textes repris du WordPress (page 197) dans `src/content/mentions-legales.ts`, mis à jour pour la V2 : directrice Marie-Salomé Perrichon, téléphone, hébergeur **Netlify** (au lieu d’OVH)
  - Comparée à la V1 à 1440px (positions identiques au pixel) et à 375px (pas de débordement)

- [x] **Page Politique de confidentialité** (09/11) : en-tête (H1 à filets + date), intro, sommaire cliquable, 9 sections numérotées, lien « Gérer mes cookies » qui rouvre le bandeau, `noindex, follow`
  - Textes repris du WordPress (page 201) dans `src/content/confidentialite.ts`, mis à jour pour la V2 (voir CLAUDE.md § 0)
  - Comparée à la V1 à 1024px (positions identiques à 1px près) et à 375px (pas de débordement)

- [x] **Bandeau cookies / « Gérer mes cookies »** (09/11) : copie du bandeau Complianz de la V1 (textes, mesures, Personnaliser avec Fonctionnel et Statistiques), rouvert par le lien du pied de page ; choix gardé 365 jours ; GA4 chargé seulement après acceptation
  - Comparé à la V1 à 1440px (positions et hauteurs identiques au pixel, vue simple et vue Personnaliser) et à 375px (pas de débordement)

- [x] **Page Calendrier** (09/11) : liste « À venir », calendrier mensuel (navigation par mois, pastilles par type), modale détail (`<dialog>` natif), « Comment participer à nos ateliers ? », JSON-LD `Event`
  - Textes et SEO repris du WordPress (page 17) dans `src/content/calendrier.ts` ; texte des événements avec le gras de la V1
  - Comparée à la V1 à 1024px (positions identiques au pixel jusqu’au calendrier) et à 375px (identique, pas de débordement) ; modale vérifiée au clavier (focus, Échap, retour du focus)

### À faire (design)
- [ ] Récupérer les textes de chaque page depuis le WordPress (MCP Novamira)
- [ ] Comparer chaque page avec la V1 à 375, 768 et 1440px

## Phase 2 : contenus et CMS (en cours)
- [x] Créer le projet Sanity avec Louis (09/11) : projet `t4k96qs7`, dataset `production`, CORS `http://localhost:3000` — compte Google de Louis pour l’instant, transfert au nom de Néotisse à prévoir
- [x] Schémas Sanity (CLAUDE.md § 8) et Studio embarqué sur `/studio` (09/11)
  - Schémas en français dans `src/sanity/schemaTypes/` (documents, singletons, briques partagées SEO / liens / images avec alt obligatoire / texte enrichi)
  - Navigation française dans `src/sanity/structure.ts` : réglages, pages, événements, ateliers, partenaires, équipe, FAQ, modération des avis
  - Singletons protégés (pas de doublon, pas de suppression accidentelle)
  - `.env.example` ajouté ; `.env.local` ignoré par git
  - Vérifié : `npx sanity schemas validate` (0 erreur), TypeScript et `npm run build` OK, Studio accessible sur `/studio`
- [x] Stockage de `review.email` / `review.ip` : gardés malgré le dataset public, avec information des visiteurs (décision de Louis du 09/11)
- [ ] Ajouter le domaine de production (et l’URL Netlify) dans les CORS Sanity : nécessaire à `<SanityLive />` (plus besoin de webhook de revalidation)
- [x] **Contenus de la V1 importés dans Sanity** (09/11) avec `scripts/import-v1.ts` : 9 pages, réglages complétés, 5 ateliers (« Expérimentation » ajouté ; les 4 saisis à la main sont gardés tels quels), 2 événements, 7 partenaires avec logos, 10 questions, 2 membres d’équipe, 9 images
  - Vérifié : `sanity documents validate` (0 erreur), rendu des 9 pages identique avant/après l’import (seul changement : la page Contact affiche le téléphone de la V1)
- [x] **Avis de la V1 dans Sanity** (09/11) : les 6 avis repris du WordPress (nom, e-mail, note, date), en « Publiés » ; à trier dans le Studio (ce sont surtout des avis de test)
- [ ] Événement « Atelier participatif au musée de Tautavel » : importé avec le texte provisoire de la V1 (lorem ipsum), à remplacer dans le Studio
- [ ] Description SEO de l’accueil : 164 caractères (texte de la V1), au-delà des 160 conseillés
- [x] **Site branché sur Sanity** (09/11) : toutes les pages, l’en-tête/pied de page et les métadonnées SEO lisent Sanity (`src/sanity/queries/`), avec repli sur les textes de la V1 tant qu’un champ est vide
  - Mise à jour en direct à la publication (`<SanityLive />`), sans webhook
  - Images Sanity servies par `next/image` (`cdn.sanity.io` autorisé) ; photos de l’équipe et visuel 21/9 d’À propos affichés dès qu’ils sont saisis
  - Vérifié : TypeScript, lint, `npm run build`, `sanity schemas validate` ; rendu inchangé sur toutes les pages (ateliers : photo et textes venus de Sanity)
- [ ] **Réglages du site dans Sanity : e-mail et téléphone de test** (louisnourry07@gmail.com, 06 40 93 42 70), non écrasés par l’import : l’e-mail s’affiche dans le pied de page et sur Contact, à corriger dans le Studio (le téléphone de Contact vient maintenant de la page Contact)
- [x] **Le site n’affiche plus que le Studio** (09/11) : contenus de secours et `src/content/` supprimés ; champ vide = rien d’affiché, bouton sans destination masqué, photo absente = cadre provisoire
- [x] **Bandeau cookies et mentions sous les formulaires éditables** (09/11) : document « Bandeau cookies », champ « Mention sous le formulaire » sur Contact et Livre d’or
- [x] **Formulaire du livre d’or branché** (09/11) : route `POST /api/livre-dor/`, avis créé « À modérer » avec e-mail et IP ; politique de confidentialité, mentions légales et mention sous le formulaire mises à jour (données techniquement lisibles via l’API)
  - Vérifié sans token : validation, champ piège, délai, JSON invalide, message d’erreur dans le formulaire
- [ ] **Créer le token d’écriture** (sanity.io/manage → API → Tokens, rôle Editor), le mettre dans `.env.local` (`SANITY_API_WRITE_TOKEN`) puis tester un vrai envoi et sa modération ; le mettre aussi dans les variables d’environnement Netlify
- [ ] Limite de 5 avis par IP et par heure : compteur en mémoire, remis à zéro à chaque démarrage de fonction sur Netlify (protection partielle)
- [ ] Champs encore inutilisés de « Réglages du site » : `legal` (siège, RNA, SIRET), `contactRecipient`, `gaMeasurementId`, `logo` ; les « [À COMPLÉTER] » se corrigent directement dans le texte des pages légales
- [ ] Passer les images de `public/images` dans Sanity
- [ ] Faire relire le Studio par l’association (libellés, aide, parcours de la cliente)

## Phase 3 : fonctionnalités (plus tard)
- [ ] Formulaire de contact : brancher `ContactForm` sur une route API (e-mail, validation serveur) ; aujourd’hui la confirmation s’affiche sans rien envoyer
- [ ] Livre d’or : brancher `GuestbookForm` sur une route API (document `review` en `pending`, IP stockée côté serveur), modération dans Sanity ; aujourd’hui la confirmation s’affiche sans rien envoyer
- [ ] Anti-spam : honeypot + délai minimal (limite par IP : à décider)
- [ ] Statistiques (GA4 ou autre : à décider) chargées uniquement après consentement
- [ ] SEO : métadonnées, Open Graph, sitemap, robots, JSON-LD

## Phase 4 : mise en ligne (plus tard)
- [ ] Déploiement sur Netlify
- [ ] Achat du domaine
- [ ] Mentions légales complètes : siège, RNA, fonction de Marie-Salomé, SIRET / adresse / TVA de bLaNk (encore « [À COMPLÉTER] » sur la page) ; vérifier l’adresse de Netlify au moment du déploiement
- [ ] Politique de confidentialité complète : fonction de Marie-Salomé, siège, lieu et durée de conservation des sauvegardes (encore « [À COMPLÉTER] ») ; nommer le prestataire d’e-mails et confirmer Google Analytics une fois choisis ; mettre à jour la date en haut de page

## Questions ouvertes
- Titres à filets sur mobile : un titre trop long pour sa ligne (« Politique de confidentialité » à 375px) perd ses filets (largeur 0), déjà le cas avant les animations
- Boutons pleins : les boutons WordPress de la V1 (ex. « Programmer un atelier ») ont un interligne de 1.65 (52px de haut), le `<Button>` de la V2 1.3 (46px) : aligner sur la V1 partout ?
- Calendrier : le CSS de la V1 limite la liste « À venir » à 880px mais WordPress l’affiche sur 1040px ; la V2 reproduit l’affichage réel
- Cookies : la V1 affiche le bandeau alors qu’aucun traceur n’est actif (GA non configuré) ; CLAUDE.md § 7.5 dit de ne pas l’afficher dans ce cas. La V2 suit la V1 : à trancher quand les statistiques seront décidées
- Cookies : sur la V1 le titre du bandeau disparaît sous 426px et « Toujours activé » est en vert (réglages par défaut de Complianz) : reproduits tels quels, à corriger ?
- Contact : le téléphone (06 48 65 58 16, Marie-Salomé) est affiché sur la V1 mais absent de `siteSettings` (CLAUDE.md § 8 ne prévoit que `legal.phone`) : à ajouter au schéma
- Contact : le texte d’intro est à 1.1rem fixe, la V1 le rend « fluide » (plus petit sur mobile)
- Photos des ateliers démonstratifs, enfants, conférences et expérimentation : à fournir (cadres provisoires, seule la photo de l'atelier participatif existe)
- Logo et burger couleur encre peu lisibles sur la photo du héro tant que l’en-tête est transparent (comme sur la V1) : passer en crème à l’arrivée ?
- Avis de test du WordPress (« pyramide », « INCROYABLE »…) : lesquels garder à la migration ?
- Événement « Atelier participatif au musée de Tautavel » : texte en lorem ipsum sur la V1, à fournir
- Service d’e-mail pour le formulaire de contact
- Statistiques : GA4 ou autre ?
- Stockage des messages de contact dans Sanity : pas pour l’instant
- Liens LinkedIn de l’équipe (seule Marie-Salomé en a un sur la V1)
- Photos de l’équipe et visuel 21/9 de la page À propos : aplats provisoires sur la V1, à fournir
- Accueil : les textes à 1.2rem sont fixes, alors que la V1 les rend « fluides » (plus petits sur mobile) ; les passer au token `text-lead` ?
- À propos : sur la V1, le titre « Notre équipe » touche la première photo (aucun espace) ; reproduit tel quel, à corriger ?
- Livre d’or : la V1 publie les avis en balisage Schema.org (LocalBusiness + AggregateRating) ; Google ignore les avis « auto-hébergés » d’une organisation sur son propre site : garder un JSON-LD ou non ?
- Année du © et du titre SEO du calendrier : à rendre dynamiques ? (le © l’est déjà)
