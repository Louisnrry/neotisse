# TODO — Néotisse V2

> À tenir à jour pendant le travail : cocher ce qui est fait, ajouter ce qui est découvert.
> Dernière mise à jour : 09/11/2026.

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

### À faire (design)
- [ ] Cartes « À venir », calendrier mensuel et modale événement
- [ ] Bandeau de cookies sur mesure (§ 7.5) : le lien « Gérer mes cookies » émet déjà l’événement `neotisse:open-cookie-banner`
- [ ] Construire les pages : Calendrier, Mentions légales, Politique de confidentialité
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
- [ ] Décider du stockage de `review.email` / `review.ip` avant la mise en ligne (dataset public en plan Free)
- [ ] Ajouter le domaine de production dans les CORS Sanity et configurer le webhook de revalidation
- [ ] Migrer les contenus de la V1 : textes, 2 événements, 7 partenaires, avis (hors avis de test), 10 questions de FAQ, 2 membres d’équipe
- [ ] Remplacer `src/content/site-settings.ts` par le document `siteSettings`
- [ ] Brancher les pages sur les requêtes GROQ (`sanityFetch` + Cache Components)
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
- [ ] Mentions légales complètes (siège, RNA, téléphone, SIRET bLaNk, hébergeur Netlify)

## Questions ouvertes
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
