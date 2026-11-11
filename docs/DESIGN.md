# Design — Néotisse V2

> **Source de vérité : le site WordPress V1** (`http://neotisse.local`, styles globaux du thème + extension `neotisse-core`).
> En cas d'écart entre ce fichier, `CLAUDE.md` et la V1, **c'est la V1 qui fait foi**.
> Ce fichier décrit ce qui est **réellement implémenté** dans la V2. À tenir à jour à chaque modification du design.

Aperçu de tous les éléments : page **`/styleguide`** (non indexée).

---

## 1. Où vit le design dans le code

| Élément | Fichier |
|---|---|
| Tokens (couleurs, polices, tailles, espacements, largeurs) | `src/app/globals.css` (bloc `@theme`, Tailwind v4) |
| Styles de base (body, titres, liens, focus, reduced-motion) | `src/app/globals.css` (`@layer base`) |
| Utilitaires sur mesure : `ruled`, `thread`, `thread-center`, `bg-trame`, `bg-hachures`, `bg-lin` | `src/app/globals.css` (`@utility`) |
| Polices auto-hébergées | `src/app/fonts/*.woff2` chargées par `next/font/local` dans `src/app/layout.tsx` |
| Bouton | `src/components/ui/Button.tsx` |
| Titres à filets, fil rouge, surtitre, sous-titre, citation, petite capitale | `src/components/ui/Typography.tsx` |
| Section, conteneur | `src/components/ui/Layout.tsx` |
| Cadre photo provisoire, carte à filet rouge, étoiles | `src/components/ui/Media.tsx` |
| Sections de l'accueil, intro animée | `src/components/home/*` (voir § 9 bis) |
| Page Partenaires (carte partenaire) | `src/components/partenaires/PartnerCard.tsx` (voir § 9 quinquies) |
| Page Contact (coordonnées, formulaire, FAQ) | `src/components/contact/*` (voir § 9 sexies) |
| Page Livre d'or (liste des avis, formulaire) | `src/components/livre-dor/*` (voir § 9 septies) |
| Page Calendrier (liste « À venir », calendrier mensuel, modale) | `src/components/calendrier/*` (voir § 9 octies) |
| Texte enrichi des contenus provisoires (gras, liens) | `src/components/ui/RichText.tsx` |
| Icônes Instagram et Facebook | `src/components/ui/SocialIcons.tsx` (pied de page, page Contact) |
| Page Ateliers (ligne d'atelier) | `src/components/ateliers/WorkshopRow.tsx` (voir § 9 ter) |
| Styles de l'intro, du héro et du bandeau défilant | `src/app/globals.css` (`@layer components`) |
| Champs de formulaire, case à cocher, message, mention RGPD | `src/components/ui/Field.tsx` |
| En-tête, pied de page | `src/components/layout/Header.tsx`, `Footer.tsx` |
| Bandeau cookies, chargement des statistiques | `src/components/layout/CookieBanner.tsx`, `Analytics.tsx`, `src/lib/consent.ts` (voir § 9 octies) |

Tailwind v4 : **il n'y a pas de `tailwind.config.ts`**. Les tokens sont déclarés en CSS dans `@theme` et génèrent les classes (`bg-garance`, `text-h2`, `px-s50`, `max-w-wide`…). Les palettes Tailwind par défaut sont **désactivées** (`--color-*: initial`) : seules les couleurs de la charte existent.

---

## 2. Couleurs

| Token Tailwind | Hex | Usage |
|---|---|---|
| `garance` | `#C8361F` | Couleur signature : boutons, liens, filets, accents, **fonds pleins de sections** |
| `garance-dark` | `#9E2A17` | Survol des boutons et liens, tuile « Ateliers démonstratifs », texte d'erreur |
| `garance-soft` | `#F08C78` | **Uniquement** le survol des liens du pied de page (sur fond encre) |
| `ink` | `#1E2B33` | Texte principal, titres, pied de page, filets des titres |
| `ink-deep` | `#141D22` | Voile et ombre de la modale événement |
| `creme` | `#FFF8F0` | Texte sur fond rouge ou encre, bouton sur fond rouge |
| `pierre` | `#FBF9F7` | Fonds de cartes (« À venir »), sections alternées |
| `filet` | `#ECE4DC` | Bordures fines, séparateurs |
| `gris` | `#5B6670` | Texte secondaire, **sur fond clair uniquement** (contraste AA) |
| `blanc` | `#FFFFFF` | Fond par défaut |
| `champ` | `#CFC7BF` | Bordure des champs de formulaire |
| `lin` | `#E9E2D6` | Couleur sous la texture de lin |
| `erreur-bg` | `#FDF1EE` | Fond d'un champ en erreur |
| `alerte-bg` | `#FBE7E2` | Fond du message d'erreur d'un formulaire |
| `succes-bg` | `#F3F7F2` | Fond du message de succès d'un formulaire |

Règles :
- Le rouge garance s'utilise **franchement** (retour cliente : « pas assez flashy ») : sections pleines, intro, colonne de la modale.
- Jamais de noir pur pour le texte. Pas de bleu ni de jaune (une ancienne piste « bleu guède / safran » a été abandonnée).

---

## 3. Typographie

| Rôle | Police | Graisse |
|---|---|---|
| **Titres** (h1–h6, titres à filets, titres de cartes et d'événements — sauf les titres des avis, tuiles des ateliers, « Néotisse » du pied de page, titre du bandeau de cookies, mois du calendrier) | **Eagle Lake** (`font-display`, SIL Open Font License, auto-hébergée) | 400 seulement, pas d'italique (`font-synthesis: none` : jamais de faux gras) |
| Navigation, **titres des avis** (accueil et livre d'or, gardés en Cormorant à la demande de Louis), grands chiffres de dates, sous-titres et citations en italique, questions de la FAQ | **Cormorant Garamond** (`font-serif`) | 700 ; 600 pour certains textes d'accroche ; italique 600–700 |
| « Néotisse » de l'intro animée et de la navbar | **Eagle Lake** converti en tracés SVG | 400 |
| Texte courant, boutons, formulaires, étiquettes | **Quicksand** (`font-sans`) | **300** pour le corps (comme la V1) ; 500, 600, 700 |

Cormorant et Quicksand sont des **fichiers variables** (axe de graisse 300–700), sous-ensemble latin, repris de la V1.

| Token | Valeur | Usage |
|---|---|---|
| `text-body` | `clamp(0.875rem, …, 1.063rem)` | Corps de texte (interligne 1.65) |
| `text-button` | `clamp(0.875rem, …, 1rem)` | Boutons |
| `text-h1` | `clamp(1.85rem, 0.9rem + 4.4vw, 3.9rem)` | H1 |
| `text-h2` | `clamp(1.6rem, 0.9rem + 2.6vw, 2.5rem)` | H2, titres à filets |
| `text-h3` | `clamp(1.3rem, 1rem + 1vw, 1.65rem)` | H3 |
| `text-hero` | `clamp(3.4rem, 10vw, 7.4rem)` | « Néotisse » du héro (interligne 0.95) |
| `text-lead` | `clamp(0.875rem, …, 1.2rem)` | Textes d’introduction centrés (V1 : 1.2rem rendu « fluide » par WordPress) |
| `text-tagline` | `clamp(0.875rem, …, 1.3rem)` | Accroches italiques des cartes engagements, rôle des membres |
| `text-subtitle-lg` | `clamp(1.198rem, …, 1.9rem)` | Sous-titre de l’en-tête À propos |
| `text-pull` | `clamp(1.6rem, 2.6vw, 2.1rem)` | Phrase en exergue (Cormorant italique 700 garance) |
| `text-kicker` | `0.78rem` | Surtitres et petites capitales |
| `text-small` | `0.85rem` | Labels, mentions sous formulaires |
| `text-legal` | `0.88rem` | Ligne basse du pied de page |

Titres : **Eagle Lake 400** (passage de Cormorant à Eagle Lake le 10/11/2026, demande de Louis), interligne 1.08, letter-spacing **-0.05em** (choisi par Louis le 10/11/2026 avec un panneau de réglage provisoire, retiré depuis ; avant 0.01em), `text-wrap: balance`, coupure des mots trop longs avec trait d'union (`hyphens: auto`). Tailles réduites d'environ 15 % par rapport à Cormorant, car Eagle Lake a des lettres plus hautes et plus larges ; sur mobile, le H1 descend à 1.85rem pour que les mots longs (« confidentialité », « partenaires ») tiennent avec leurs filets. Les titres à filets ont `min-w-0` pour pouvoir rétrécir dans une grille.
Liens : `garance`, survol `garance-dark`.


**Écart V1 vs `CLAUDE.md`** : le corps de texte est en Quicksand **300** dans la V1 (CLAUDE.md disait 400). On suit la V1.

---

## 4. Espacements et largeurs

| Token | Valeur | Usage |
|---|---|---|
| `s20` | 10px | |
| `s30` | 20px | Écart des champs de formulaire |
| `s40` | 30px | |
| `s50` | `clamp(30px, 5vw, 50px)` | **Gouttière latérale du site** (`px-s50`) |
| `s60` | `clamp(30px, 7vw, 70px)` | |
| `s70` | `clamp(50px, 7vw, 90px)` | Padding vertical d'une section standard |
| `s80` | `clamp(70px, 10vw, 140px)` | Padding vertical d'une grande section |
| `max-w-content` | 645px | Colonne de texte centrée |
| `max-w-reading` | 880px | Liste « À venir », formulaires |
| `max-w-section` | 1240px | **Contenu des sections** (`<Section>`, largeur par défaut) |
| `max-w-wide` | 1340px | En-tête et pied de page |

Mise en page des sections (mesurée sur la V1) : padding latéral `s50` puis contenu plafonné à 1240px. À 1440px le contenu commence à 100px du bord ; à 375px, à 30px (contenu de 315px). L'en-tête et le pied de page, eux, vont jusqu'à 1340px.

Point de rupture spécifique : **`nav:` = 1200px** (75rem), passage au menu burger : la barre flottante à 5 liens + mot centré a besoin de cette largeur.

---

## 5. Signes graphiques

- **Titre à filets** (`<RuledTitle>`, utilitaire `ruled`) : texte centré entre deux lignes de 2px de la couleur du texte, `gap: clamp(16px, 3vw, 40px)`, letter-spacing **-0.03em** (choisi par Louis le 10/11/2026 ; avant 0.06em). `tone="creme"` sur fond rouge ou encre. Mettre `as="p"` quand c'est un surtitre de section suivi d'un H2.
- **Fil rouge** (`<ThreadHeading>`, utilitaire `thread`) : trait 64×4px garance sous le titre, à 0.45em. `center` pour le centrer, `tone="creme"` pour un fil crème.
- **Surtitre** (`<Kicker>`) : 0.78rem, 700, letter-spacing 0.14em, majuscules, garance, trait de 3px au-dessus (padding-top 12px).
- **Sous-titre** (`<Subtitle>`) : Cormorant italique 600, garance.
- **Citation** (`<PullQuote>`) : Cormorant italique 700, garance, interligne 1.2.
- **Angles droits partout** : le token de rayon est vidé (`--radius-*: initial`), donc les classes `rounded-*` n'existent pas. Exceptions (seules les valeurs arbitraires `rounded-[…]` existent) : **tous les boutons 4px** (depuis le 10/11/2026, demande de Louis : composant `Button`, bandeau cookies, « Plus d'avis », boutons de la modale du calendrier ; pas les flèches du calendrier ni le bouton fermer), bouton « Contact » de la navbar 16px, navbar 24px, cartes des ateliers de l'accueil 8px.
- **Filet rouge en haut des cartes** (`<Card>`) : bordure `filet` + `border-top: 4px garance`.
- **Texture de lin** (`bg-lin`) : `lin-brut.jpg` en 260px sur `#E9E2D6`, derrière les logos partenaires, avec un filet garance de 3px en bas.
- **Cadre photo provisoire** (`<PhotoPlaceholder>`) : **aplat uni** (garance, garance-dark, ink ou lin) + petite icône. Sur la V1 la trame rayée est masquée par l'aplat, donc on ne la montre pas par défaut ; `trame` l'active (`bg-trame`). À remplacer par les images Sanity.
- **Hachures** (`bg-hachures`) : jours hors mois du calendrier.

---

## 6. Boutons (`<Button>`)

| Variante | Rendu | Survol |
|---|---|---|
| `primary` (défaut) | fond garance, texte crème | fond garance-dark |
| `outline` | bordure 2px encre, texte encre | fond encre, texte blanc |
| `outline-thin` | bordure **1px** encre, texte encre, padding 15px × 35px et interligne 1.65 en taille `default` (« Lire et laisser un avis… » de la page Contact, comme la V1) | fond encre, texte blanc |
| `outline-garance` | bordure 1px garance, texte garance | fond garance, texte blanc |
| `on-red` | fond crème, texte garance-dark (sur fond rouge) | fond encre, texte blanc |
| `on-ink` | fond crème, texte garance-dark (sur fond encre : pied de page, menu mobile) | **fond garance, texte crème** (un survol encre serait invisible sur fond encre) |

| Taille | Padding | Texte |
|---|---|---|
| `default` | `0.85em 1.7em` | `text-button` |
| `compact` | `0.5em 1.1em` | 0.9rem (bouton de la navbar) |
| `large` | `0.95em 2.4em` | 1.05rem (boutons d'envoi des formulaires) |

Quicksand 600, **coins arrondis 4px** (depuis le 10/11/2026 ; un `className` qui contient `rounded-` remplace ce rayon, ex. « Contact » de la navbar à 16px), transitions 0.2s. `href` interne → `next/link`, `href` externe/`mailto:` → `<a>`, sans `href` → `<button>`.

---

## 7. Formulaires (`Field.tsx`)

- Label : Quicksand 700, 0.85rem, interligne 1.4, letter-spacing 0.04em, 7px au-dessus du champ.
- Champ : padding 14px, interligne 1.65 (56px de haut), zone de texte 160px, bordure `champ`, fond blanc, texte encre. Focus : bordure encre + halo `rgba(200,54,31,.18)` de 3px.
- Erreur : `aria-invalid`, bordure garance, fond `erreur-bg`, message 0.88rem 600 `garance-dark` relié par `aria-describedby`.
- Deux colonnes Nom / Prénom au-dessus de 640px, une seule en dessous.
- Message de retour : bordure gauche 4px (encre + `succes-bg` pour un succès ; garance + `alerte-bg` pour une erreur).
- Mention RGPD (`<FormLegal>`) : 0.85rem, gris, liens garance.
- Champ obligatoire : astérisque garance après le libellé (`aria-hidden`, l'obligation est portée par `required`).

---

## 8. En-tête

Refait le 10/11/2026 d'après la maquette Figma **« navbar à faire »** (node `407:10`), couleurs adaptées à la DA. Le comportement est inchangé.

- **Barre flottante** : décollée des bords (`px-s50`, 16px en haut), **largeur ajustée au contenu** sur grand écran (`w-fit` : le fond dépasse le texte d'environ 25px de chaque côté, ≈ 1017px de large à 1440px ; pleine largeur sur mobile), **coins arrondis 24px** (exception voulue à la règle des angles droits), fond `creme/95` + flou 8px, filet `filet`, ombre douce `0 10px 30px -18px` encre. Padding 12px / 24px (10px / 12px sur mobile), symétrique pour que le mot soit exactement centré.
- **Disposition** (grille `1fr auto 1fr`, colonnes de même largeur pour garder le mot centré) : Ateliers · Calendrier · Partenaires à gauche, calés sur le bord gauche (l'espace en trop va entre « Partenaires » et le mot) ; **« Néotisse » en Eagle Lake** au centre (`<Wordmark>`, mêmes tracés que l'intro, 40px de haut, 32px sur mobile ; ramène à l'accueil ; zoom ×1.05 au survol) ; Livre d'or · À propos + bouton **« Contact »** à droite (bouton garance, **coins arrondis 16px**). Écart 56px entre les trois blocs, 36px entre les liens.
- Liens Cormorant 700 1.2rem, encre ; soulignement garance de 2px qui se déploie de gauche à droite au survol et sur la page active (page active en garance, `aria-current="page"`).
- Se cache au scroll vers le bas (seuil 6px, à partir de 80px), revient au scroll vers le haut ou quand le focus entre dans l'en-tête ; transition 0.35s.
- **Accueil** : `position: fixed` par-dessus le héro, **transparent** (sans fond, filet ni ombre) jusqu'au premier défilement (> 10px), puis crème définitivement. Pendant la transparence, le texte passe en **crème** (mot, liens avec une légère ombre portée, soulignement crème, burger) pour rester lisible sur la photo.
- **Sous 1200px** (`nav:` = 75rem) : mot centré + bouton burger à droite → menu plein écran fond encre, liens Cormorant 2.2rem crème (survol `garance-soft`), bouton « Contact » `on-ink` arrondi 16px. Focus piégé, Échap ferme et rend le focus au burger, défilement de la page bloqué.

## 9. Pied de page

- Fond encre, texte crème, padding `72px` en haut, `28px` en bas.
- Trois colonnes 38 % / 24 % / 38 % (une seule sous 768px) : logo blanc 56px + « Néotisse » (Cormorant 2.1rem) + texte ; navigation verticale Cormorant 1.25rem ; accroche Cormorant 600 1.45rem + bouton `on-ink` « Écrivez-nous » + e-mail + icônes Instagram et Facebook.
- Liens texte crème, survol `garance-soft` (classes posées sur chaque lien : un style global sur tous les `<a>` du pied de page rendait le bouton « Écrivez-nous » crème sur crème, corrigé le 09/11/2026).
- Ligne basse 0.88rem séparée par un filet crème à 14 % : © année · Mentions légales · Gérer mes cookies · Politique de confidentialité.

---

## 9 bis. Accueil (`src/components/home/`)

Textes dans Sanity (repris de la V1). Mesures prises sur la V1 à 1440px ; les hauteurs de section de la V2 sont à quelques pixels près (héro 900, partenaires 462, univers 899, événement 895, ateliers 1200, avis 650, contact 473).

| Section | Composant | Détails |
|---|---|---|
| Intro animée | `Intro.tsx` + `intro-glyphs.ts` + `intro-script.ts` | Fond garance. « Néotisse » en **Eagle Lake**, crème, `min(88vw, 1180px)` de large, dessiné en tracés SVG (générés par `scripts/generate-intro-glyphs.mjs`) et animé avec **Motion** : le « N » se trace seul et centré (0,15 → 1,05 s, trait 14 unités, `pathLength`), se remplit, puis glisse à sa place (1 → 1,6 s) ; « éotisse » s'écrit lettre par lettre à partir de 1,25 s (tracé 0,45 s, décalage 0,13 s, remplissage 0,35 s). Fil crème 3px tracé entre « Néo » et « tisse » à 2,75 s, ouverture à 3,1 s (translateX ±101 %, 1.25s, `ease-reveal`), fin ≈ 4,3 s (8 s maximum). Le mot est dessiné deux fois (une copie par moitié, superposées au pixel près) ; la coupe est calculée en JS selon la taille réelle du mot, et la moitié gauche déborde d'1px pour masquer la jointure. Clic, touche, molette ou glissé : le mot finit de s'écrire en 0,3 s pendant l'ouverture. Jouée **à chaque visite de l'accueil**, sauf en reduced-motion ou dans une iframe. Au chargement, le script du `<head>` (layout racine) pose la classe `intro-play` avant l'affichage ; en arrivant par un lien interne, `Intro` la pose dans un `useLayoutEffect`, donc sans flash du héro. |
| Héro | `Hero.tsx` | `min-h-svh`, fond encre, 2 photos côte à côte (une seule sous 640px), voile `neo-hero__veil` (sombre en bas à gauche + léger en haut). H1 « Néotisse » `text-hero`, accroche `clamp(1.15rem,1.8vw,1.5rem)`, bouton 1.075rem. Avec l'intro : contenu en fondu (délai 0.6s) et photos qui dézooment de 1.12 à 1 (1.8s). |
| Ils nous ont fait confiance | `PartnersBand.tsx` | Fond garance, padding 72px, titre à filets crème sur toute la largeur. Logos 196×140 (padding 14px, logo 80px de haut max) sur toile de lin, écart 20px, défilement 45s linéaire, masque en dégradé sur 8 % de chaque bord, pause au survol et au focus. Liste doublée (copie `aria-hidden`, liens hors tabulation). Reduced-motion : logos statiques centrés, copie masquée. Survol : liseré intérieur encre 2px. Bouton `on-red` centré. |
| Découvrez l'univers Néotisse | `Univers.tsx` | Padding 64px / 112px. Titre à filets (`<p>`), puis grille 42 % / 58 % centrée verticalement : cadre 4/5 garance, H2 à fil rouge, 2 paragraphes, bouton. |
| Prochain événement | `NextEvent.tsx` | Fond garance, padding 96px, titre à filets crème. Grille 58 % / 42 %, écart 88px : date **en surtitre** (depuis le 10/11/2026, demande de Louis ; avant : grande date Cormorant `clamp(2.2rem,4.5vw,3.4rem)`) : Quicksand 700 majuscules `clamp(0.95rem,1.2vw,1.1rem)`, interlettrage 0.14em, crème, trait crème de 3px au-dessus, H2 crème, lieu en 600, extrait (ou 45 premiers mots), bouton `on-red` ; image 4/5 (aplat garance-dark sinon). Sans événement : message centré + bouton. Composant mis en cache 1 heure (`"use cache"` + `cacheLife("hours")`). |
| Nos ateliers de médiation textile | `WorkshopTiles.tsx` + `WorkshopScroller.tsx` | **Refait le 10/11/2026** d'après une maquette de Louis (« Refonte de site »), à la place de la mosaïque de 3 tuiles. Padding 112px, titre à filets, intro centrée 1.2rem, puis les ateliers (tuiles choisies dans Sanity, avec l'accroche de chaque atelier). **À partir de 900px : section épinglée** (`position: sticky`, hauteur d'écran) sur une zone de `3 × 70 + 100` svh : chaque atelier dure 70 % d'écran de défilement (Motion `useScroll`). À gauche, compteur « 01 / 03 » (petites capitales garance), titre H3 en `text-h2` avec fil rouge, accroche 1.1rem grise, lien « Découvrir l'atelier → » ; à droite (colonnes 1fr / 1.15fr, écart `clamp(48px,7vw,112px)`), **carte sans cadre, haute** (74 % de la hauteur d'écran, entre 420 et 760px ; 4/5 sur mobile) : photo de l'atelier ou aplat de sa couleur (`PhotoPlaceholder`), **coins arrondis 8px** (exception voulue, demande de Louis du 10/11/2026), léger zoom de la photo au survol. Changement d'atelier : le texte sort vers le haut (-20px) et le suivant entre en fondu en remontant de 32px (0,9 s) ; la carte suivante entre en remontant de 56px et se pose sur la précédente, qui recule à 97 %. **Fil vertical en 3 parties** calé sur le bord gauche de l'écran (traits de 3×48px, écart 12px, fond `filet`) : chaque partie se remplit en garance pendant son atelier. Clavier : le focus sur le lien d'un atelier caché fait défiler jusqu'à lui. **Sous 900px** : ateliers empilés (carte puis texte), chacun en fondu et montée de 28px à son entrée à l'écran, sans épinglage ni fil. Puis « Et bien plus encore à découvrir » + bouton contour, centrés sur une ligne. |
| Ils nous ont laissé un mot | `LatestReviews.tsx` | Padding 96px / 32px. Ligne « Note moyenne : ★★★★★ 4,9 sur 5 · N avis » (`ReviewSummary`, filet encre en bas), puis 4 cartes (4 colonnes, 2 sous 1280px, 1 sous 640px, écart 20px) : carte d’avis commune `ui/ReviewCard.tsx` (choix de Louis du 11/11/2026, piste « B » sans pastille d’initiales) : fond pierre, filet garance 4px en haut, padding 24px ; nom en 600 et date `text-small` grise à gauche, étoiles garance à droite ; titre en police de titre (`font-display`) 1.35rem ; texte interligne 1.7. Bouton contour centré. |
| Contact | `ContactCta.tsx` | Padding 112px, titre à filets, texte centré 1.2rem, bouton 1.075rem centré. |

---

## 9 ter. Ateliers (`/ateliers-tissage-teinture/`)

Textes dans Sanity (repris de la V1). Page comparée à la V1 à 1440px : positions identiques au pixel pour l'en-tête et les 4 premiers ateliers ; à 375px, pas de débordement.

| Bloc | Détails |
|---|---|
| En-tête de page | Padding 72px / 24px. H1 à filets « Nos ateliers », intro centrée 1.2rem (24px au-dessus), ligne « Pour les musées… » en 600 `gris` centrée, puis **index** (`<nav>`) 32px plus bas : liens Quicksand 600 **garance** (survol **garance foncé**), **séparés par des filets verticaux encre de 1px** (padding 6px / 20px par lien), **sans filets horizontaux** (retirés le 10/11/2026), padding 14px ; sous 700px, liens empilés et centrés, sans filets verticaux (depuis le 10/11/2026, maquette de Louis). |
| Ligne d'atelier (`WorkshopRow`) | Grille 40 % visuel / 60 % texte, écart 88px, padding vertical `clamp(48px,7vw,96px)`, filet `filet` en bas (sauf la dernière). Une ligne sur deux inversée (60/40, visuel à droite). Sous **782px** : une colonne, écart 50px, visuel toujours au-dessus. Visuel 4/5 (photo ou aplat garance / garance-dark / ink). |
| Texte d'un atelier | **Pas de surtitre** (retiré le 10/11/2026, demande de Louis), H2 (ancre `id`), sous-titre Cormorant italique 600 garance 1.5rem, accroche 1.22rem 500 interligne 1.55, puis **repères** (`<dl>`, max 600px, sans filet encre en haut (retiré le 10/11/2026), lignes `filet` en bas, padding 10px, colonnes 150px / reste, une seule colonne sous 521px, libellé garance en 400) et paragraphes interligne 1.75 : **seul le 1er paragraphe est visible**, la suite est repliée derrière « En savoir plus » (`WorkshopMore.tsx`, texte garance 600 + chevron, ouverture en douceur 0,5 s, devient « Voir moins » ; replié = `inert`). Un clic sur l'atelier dans l'index en haut de page (ou une URL `#ancre`) déplie directement son texte. Depuis le 10/11/2026, demande de Louis ; écart de 1.2rem entre blocs. Le gras des paragraphes est en **400** (gras relatif sur un corps en 300, comme la V1). |
| Bloc final | Fond garance, padding 96px, colonne de 760px, écart 28px : H2 à fil crème **aligné à gauche**, texte centré 1.2rem, bouton `on-red` centré (comme la V1). |

---

## 9 quater. À propos (`src/components/a-propos/`)

Textes dans Sanity (repris de la V1). Comparée à la V1 à 1024 et 375px : positions identiques. Les sections blanches sont séparées de 1.2rem comme sur la V1.

| Section | Composant | Détails |
|---|---|---|
| En-tête | `AboutIntro.tsx` | Colonne de 860px, padding 72px / 40px, écart 20px : H1 à filets, sous-titre Cormorant italique 600 garance `text-subtitle-lg`, texte centré `text-lead`. |
| Notre démarche | `Demarche.tsx` | Padding 48px / 96px. Grille 42 % / 58 %, écart 88px (30px une fois empilée sous 768px), alignée en haut : photo 4/5 (`hero-atelier.jpg`), H2 à fil rouge, texte, phrase en exergue `text-pull`, texte terminé par la conviction en gras. |
| Nos engagements | `Engagements.tsx` | Padding 96px. H2 à fil rouge à gauche, intro centrée `text-lead`, 3 cartes (padding 36/32px, écart interne 12px, 24px entre cartes) : garance + texte crème ; contour 2px garance ; encre + accroche `garance-soft`. Décalages de 48 et 96px **à partir de 900px** seulement. |
| Médiation par le geste | `Mediation.tsx` | Padding 48px / 96px. Visuel 21/9 (aplat garance-dark provisoire), puis encart blanc de 640px aligné à droite, padding 44px, qui chevauche le visuel de 96px (40px sous 700px), ombre `0 30px 60px -34px rgba(30,43,51,.3)` comme la V1. |
| Notre équipe | `Team.tsx` | Fond pierre, colonne de 1040px, padding 96px / 112px. Titre à filets collé aux membres (comme la V1), un membre par ligne (photo 4/5 à 26 %, texte à 74 %, écart 48px ; 64px entre membres). Rôle en Cormorant italique garance `text-tagline`. Lien LinkedIn sous un filet `filet`, en 600. |
| Travaillons ensemble | `WorkTogether.tsx` | Fond garance, colonne de 760px, padding 96px, écart 28px : H2 à fil rouge crème à gauche, texte centré `text-lead`, bouton `on-red` centré. |

---

## 9 quinquies. Partenaires (`/partenaires/`)

Textes dans Sanity (repris de la V1). Comparée à la V1 à 1024px (positions identiques à 3–5px près) et à 375px.

| Bloc | Détails |
|---|---|
| En-tête | Colonne de 860px, padding 72px / 24px, écart 20px : H1 à filets, intro centrée `text-lead`. |
| Grille | 1.2rem sous l'en-tête, padding 32px / 112px, contenu 1240px. Colonnes `repeat(auto-fill, minmax(16rem, 1fr))`, écart 28px (4 colonnes à 1440px, 3 à 1024px, 1 sur mobile). |
| Carte (`PartnerCard`) | Fond blanc, bordure 1px `filet` → `garance` au survol (et au focus du lien). Zone logo 170px sur toile de lin (`bg-lin`), filet garance 3px en bas, logo centré 104px de haut max, 80 % de large max, **sans pastille blanche** (comme la V1). Nom en H3 1.5rem interligne 1.15, padding 20px 22px ; lien vers le site (nouvel onglet, souligné, garance) s'il existe. Description interligne 1.6, padding 8px 22px 24px. Sans description, le H3 prend 24px en bas. |
| Devenir partenaire | Fond **pierre**, colonne de 760px, padding 96px, écart 28px : H2 à fil rouge à gauche, texte centré `text-lead`, bouton plein centré. |

## 9 sexies. Contact (`/contact-organiser-un-atelier/`)

Textes dans Sanity (repris de la V1), espaces insécables avant « ? » et « : ». Comparée à la V1 à 1024px et 1440px (positions mesurées identiques à 4px près) et à 375px (pas de débordement).

| Bloc | Composant | Détails |
|---|---|---|
| Coordonnées + formulaire | `page.tsx`, `ContactDetails.tsx` | Padding 80px / 112px. Grille 45 % / 55 %, écart 112px (une colonne sous **782px**, écart 56px). À gauche : H1 **à fil rouge** (pas à filets, comme la V1) `clamp(3rem,6vw,4.6rem)` interligne 1, texte 1.1rem (28px au-dessus, 40px dessous), liste de coordonnées (`<dl>`, filet encre en haut, lignes à filet `filet`, padding 18px, colonnes 130px / reste, une seule sous 521px ; libellés en petites capitales grises 0.78rem ; téléphone en 600 chiffres tabulaires + nom en gris ; Instagram et Facebook icône 24px + libellé, **sur une seule ligne** (écart 1.2rem, 1.2rem sous le haut de la ligne, comme la V1)), puis bouton `outline-thin` vers le livre d'or (32px au-dessus, 15px × 35px, interligne 1.65, comme la V1). À droite : H2 « Écrivez-nous » `clamp(1.6rem,2.4vw,2rem)` (28px dessous), formulaire, mention RGPD 1.2rem dessous. |
| Formulaire | `ContactForm.tsx` | Écart 20px, 34px avant le bouton. Nom / Prénom sur 2 colonnes (une sous 521px), e-mail, objet, projet, bouton `large` « Envoyer ». Validation côté client au clic (focus sur le premier champ en erreur), champ piège + délai de 2s. Pour l'instant un envoi valide affiche directement « Merci, votre message est bien parti ! » (route API en phase 3). |
| FAQ | `Faq.tsx` | 1.2rem sous la section précédente, padding 96px / 112px, écart 40px. Titre à filets (interlettrage -0.05em, celui des titres, comme la V1, au lieu des -0.03em des autres titres à filets), puis grille 36 % / 64 %, écart 80px (une colonne sous 782px) : photo 4/5 (`hero-tissage.jpg`) + texte d'intro à gauche ; accordéon `<details>` natif à droite : question Cormorant 700 1.35rem, padding 20px 44px 20px 0, « + » en deux traits garance 16×2px qui devient « − » (0.25s), question ouverte ou survolée en garance, filet encre au-dessus de la première, filets `filet` entre les autres ; réponse interligne 1.7, 64ch max. Balisage JSON-LD `FAQPage`. |

## 9 septies. Livre d’or (`/livre-dor/`)

Textes dans Sanity (repris de la V1). Comparée à la V1 à 1440px (en-tête, titre et note moyenne aux mêmes positions au pixel) et à 375px (pas de débordement).

| Bloc | Composant | Détails |
|---|---|---|
| Page | `page.tsx` | Une colonne de 860px, padding 72px / 112px, écart 28px. H1 à filets, intro centrée `text-lead`, H2 à fil rouge à gauche 48px puis 64px sous le bloc précédent. |
| Avis | `livre-dor/ReviewList.tsx` | Même rendu que l’accueil (remplace la copie du rendu WP Customer Reviews de la V1, le 11/11/2026) : ligne de note moyenne (`ReviewSummary`), puis carte d’avis commune `ui/ReviewCard.tsx` (choix de Louis du 11/11/2026, piste « B » sans pastille d’initiales) : fond pierre, filet garance 4px en haut, padding 24px ; nom en 600 et date `text-small` grise à gauche, étoiles garance à droite ; titre en police de titre (`font-display`) 1.35rem ; texte interligne 1.7. Deux colonnes au-dessus de 640px, écart 20px. 5 par 5 avec « Plus d’avis » (contour 1px garance, 0.95rem 700), focus sur le premier avis ajouté. |
| Formulaire | `livre-dor/GuestbookForm.tsx` | Carte à filet rouge, padding `clamp(24px,4vw,40px)`, titre « Laisser un avis » Cormorant 700 `clamp(1.6rem,2.4vw,2rem)`. Nom / E-mail sur 2 colonnes (une sous 561px), titre, **note** (5 boutons radio natifs masqués sous des étoiles garance de 28px, survol qui prévisualise, contour garance au focus clavier), avis, case anti-robot, bouton `large` « Envoyer ». Validation côté client, champ piège + délai de 2s. Mention RGPD 60px sous la carte, sur toute la largeur (comme la V1). |

## 9 octies. Politique de confidentialité (`/politique-de-confidentialite/`)

Textes dans Sanity (repris de la V1). Comparée à la V1 à 1024px (positions identiques à 1px près) et à 375px (pas de débordement).

| Bloc | Détails |
|---|---|
| En-tête | Colonne de 860px, padding 72px / 24px, écart 20px : H1 à filets, « Dernière mise à jour » centrée en 0.95rem fluide. |
| Corps | Colonne de 760px, 1.2rem plus bas, padding 8px / 112px ; 1.2rem entre les blocs. Gras en 400, liens garance soulignés, `<code>` en police à chasse fixe. |
| Sommaire | `<nav>` : H2 « Sommaire » `text-lead` à 40px au-dessus, liste numérotée (retrait 1.4em, interligne 1.9, 8px entre éléments) ; liens encre **sans soulignement**, filet garance de 1px en bas, garance au survol et au focus. |
| Sections | H2 numérotés `clamp(1.5rem,2.4vw,1.9rem)` à 56px au-dessus (ancres `#responsable`… `#modifications`), H3 1.35rem fluide à 32px, listes à puces retrait 40px, 8px entre éléments. |
| Gérer mes cookies | `confidentialite/CookieSettingsInline.tsx` : bouton dans le texte, style de lien (garance souligné), rouvre le bandeau via `reopenConsent()`. |

## 9 octies. Bandeau cookies (« Gérer mes cookies »)

Copie du bandeau **Complianz de la V1** (mêmes textes, mêmes mesures : hauteurs identiques au pixel à 1440px, vue simple 242px, vue « Personnaliser » 349px). Textes dans Sanity (document « Bandeau cookies »). Affiché sur toutes les pages tant qu’aucun choix n’est enregistré ; le lien « Gérer mes cookies » du pied de page le rouvre et met le focus sur « Accepter ».

| Élément | Détails |
|---|---|
| Encart | Fixe en bas à gauche (10px des bords), fond crème, filet garance 4px en haut, angles droits, ombre `rgba(0,0,0,.19) 0 10px 20px, rgba(0,0,0,.23) 0 6px 6px`, padding 24px 24px 20px, écart 10px entre les lignes, 440px de large minimum (499px réels, imposés par l’en-tête 100px / titre / 100px). Sous 768px : pleine largeur, collé en bas, boutons empilés. |
| Titre | « Cookies & confidentialité », Eagle Lake 1.55rem, interligne 1.1, centré. **Masqué sous 426px**, comme la V1. |
| Texte | 14px, interligne 1.6, 398px de large au-dessus de 768px. |
| Boutons | 45px de haut, 15px Quicksand 500, interlettrage 0.04em, bordure 1px : « Accepter » plein garance (survol garance-dark), « Refuser » contour garance (se remplit au survol), « Personnaliser » souligné sans bordure (survol garance). Focus : contour encre 3px, décalage 2px. |
| Personnaliser | Les catégories apparaissent en fondu (1s) : fond `rgba(239,239,239,.5)`, padding 10px, 10px entre elles ; titre 14px 500 ; « Toujours activé » 12px 500 **vert** (`#008000`, comme la V1) pour Fonctionnel ; interrupteur 28×15px (gris → garance, pastille crème) pour Statistiques ; chevron qui déplie la description (14px). « Personnaliser » laisse la place à « Enregistrer mes choix ». |
| Choix | Cookie propriétaire `neotisse_consent` (JSON `{statistics, date}`), **365 jours** comme la V1. Refuser ou retirer son accord supprime les cookies `_ga`. |
| Statistiques | `Analytics.tsx` charge GA4 seulement si « Statistiques » est accepté **et** si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est renseigné (cookie `_ga` limité à 13 mois). Aucune requête Google avant. |

## 9 octies. Calendrier (`/calendrier-des-ateliers/`)

Textes dans Sanity (repris de la V1). Reprend `templates/agenda.html`, `a-venir.html` et `assets/js/calendrier.js` de l’extension `neotisse-core`. Comparée à la V1 à 1024px (positions identiques au pixel jusqu’au bas du calendrier) et à 375px (identique, pas de débordement).

| Bloc | Composant | Détails |
|---|---|---|
| En-tête | `page.tsx` | Colonne de 860px, padding 72px / 16px, écart 20px : H1 à filets, intro centrée `text-lead`. |
| Sections | `page.tsx`, `EventCalendar.tsx` | Séparées de **1.2rem** comme la V1 (espace WordPress entre groupes). « À venir » : 1040px, padding 40px, écart 32px. Calendrier : 1240px, padding 40px, écart 32px. Titres à filets. |
| À venir | `EventCalendar.tsx` | Liste `<ol>` sur **toute la largeur** de la colonne (le `max-width: 880px` du CSS de la V1 n’est pas appliqué à l’écran), écart 14px. Carte-bouton fond pierre, bordure 1.5px transparente → garance + translateX(4px) au survol, padding 18px 24px, colonnes 104px / texte / « En savoir plus → » (72px / texte, « En savoir plus » dessous sous 641px). Jour Cormorant 700 2.8rem garance ; mois, année et type en petites capitales grises 0.78rem ; titre Cormorant 700 1.6rem ; « dates · lieu » 0.95rem 600 garance. Un clic place le calendrier sur le mois de l’événement et ouvre la modale. Sans événement : « Aucun événement programmé pour le moment. » |
| Calendrier mensuel | `EventCalendar.tsx` | Cadre bordure `filet` + filet garance 4px en haut, padding `clamp(16px,3vw,32px)`. Barre « ‹ mois année › » : boutons 46px bordure encre 2px (survol encre), mois Cormorant 700 `clamp(1.9rem,3.5vw,2.6rem)`, annoncé (`aria-live`). Grille 7 colonnes lundi → dimanche (`role="grid"`), en-têtes 0.75rem gris (0.62rem sous 721px). Cases **141px** de haut (73px sous 721px : la V1 est en `content-box`, 124px + padding + filet), jours hors mois hachurés (`bg-hachures`, numéro à 35 %), jour courant en pastille garance (`aria-current="date"`). **Barres d’événement continues** (écart volontaire avec la V1, demande de Louis du 11/11/2026 : un événement de plusieurs jours y était découpé en pastilles par jour, peu lisible) : une barre par semaine, posée dans la case du premier jour et étirée sur toutes les cases couvertes (filets compris), 24px de haut, 0.8rem 600 blanc ; atelier garance, festival encre, conférence garance-dark, autre gris. Coins arrondis 4px au vrai début et à la vraie fin ; à une coupure de semaine, bord droit collé au bord de la grille et flèche « → » / « ← ». Barres qui se chevauchent sur des lignes séparées (5px d’écart), la case s’agrandit si besoin. **Cliquables** (demande de Louis du 11/11/2026) : icône « ⊕ » (cercle + plus, 14px) à droite de chaque barre ; au survol ou au focus clavier, la barre fonce (garance → garance-dark, encre → ink-deep, garance-dark et gris → encre), se soulève de 1px avec une ombre douce, le titre se souligne et l’icône tourne d’un quart de tour — toutes les barres d’un même événement réagissent ensemble. Sous 721px : barres de 8px sans texte. Mois affiché à l’arrivée : celui du prochain événement. |
| Modale | `EventCalendar.tsx` (`EventDialog`) | `<dialog>` natif (Échap, focus sur « Fermer », focus rendu au déclencheur, clic sur le voile pour fermer), 1080×720 max, voile `ink-deep` 60 % flouté 3px, ombre `0 40px 100px -30px`. Colonne garance 4/12 : jour(s) Cormorant 700 `clamp(4.5rem,9vw,7.5rem)` (« 9–10 »), mois Cormorant 600, type en bas sous un filet crème. Colonne texte : titre Cormorant `clamp(1.9rem,3.2vw,2.7rem)`, « dates · horaires · lieu » 600 garance, texte qui défile (barre fine garance, atteignable au clavier), boutons « Site du lieu ↗ » (plein garance) et « Prenez contact » (contour encre 2px). Sous 761px : une colonne, bandeau garance en ligne. La page est figée tant qu’une modale est ouverte (`html:has(dialog[open])` dans `globals.css`). |
| Comment participer | `page.tsx` | Padding 32px / 112px. Photo 4/5 (`hero-atelier.jpg`) à 40 %, texte à 60 %, écart 80px, centrés verticalement (une colonne sous 782px, écart 30px) ; H2 à fil rouge, paragraphes en `text-wrap: pretty` (comme la V1), H3 « Vous êtes un musée… », bouton plein « Programmer un atelier ». Écart de 1.2rem entre les blocs. |
| Données structurées | `CalendarBoard.tsx` | JSON-LD `Event` pour chaque événement à venir (comme la V1). Liste et date du jour calculées côté serveur (fuseau Europe/Paris), page régénérée toutes les heures ; le navigateur remet la date du jour à jour à l’hydratation. |

## 10. Accessibilité et mouvement

- Focus visible : **contour 3px garance, décalage 3px** (comme la V1 ; CLAUDE.md indiquait encre). Exception : tuiles ateliers, contour encre.
- Lien d'évitement « Aller au contenu » en premier élément focusable.
- `prefers-reduced-motion` : toutes les transitions et animations sont neutralisées dans `@layer base`.
- `scroll-margin-top: 110px` sur les éléments à ancre (place pour l'en-tête).
- **Défilement doux avec Lenis** (`src/components/layout/SmoothScroll.tsx`, monté dans le layout du site, ajouté le 10/11/2026 à la demande de Louis) : inertie **légère** (`duration: 1`), à la molette et au pavé tactile uniquement (au doigt, défilement natif du téléphone : `syncTouch: false`). Les ancres d'une même page défilent en douceur en respectant `scroll-margin-top` (110px sous l'en-tête). Changement de page : arrivée **instantanée** en haut (Lenis est remis à 0 sans animation). Lenis est **en pause** pendant l'intro, le menu mobile et la modale du calendrier (classes `intro-play`, `overflow-hidden` ou `<dialog open>`), et les fenêtres qui défilent seules (`<dialog>`, `role="dialog"` : modale, menu, bandeau de cookies) gardent leur défilement natif. Reduced-motion : Lenis désactive le lissage. Il n'y a plus de `scroll-behavior: smooth` en CSS, qui entrerait en conflit avec Lenis.

## 10 bis. Bibliothèques d'animation

Trois bibliothèques sont installées (GSAP ajouté le 10/11/2026, avant le chantier des animations) :

| Bibliothèque | Paquet | Usage |
|---|---|---|
| **Motion** | `motion` (`motion/react`) | Animations liées à l'état d'un composant React : intro de l'accueil (tracés SVG, `pathLength`), apparitions et disparitions (`AnimatePresence`), survols et petits gestes d'interface. |
| **GSAP** | `gsap` + `@gsap/react` | Animations pilotées par le défilement (**ScrollTrigger**) et longues séquences (timelines) : apparition des sections, titres à filets et fils rouges qui se tracent, parallaxe. Les plugins (ScrollTrigger, SplitText, DrawSVG…) sont gratuits et inclus dans `gsap` depuis la 3.13. |
| **Lenis** | `lenis` | Défilement doux (voir § 10). |

Règles :
- Composants d'animation en **client** (`"use client"`), le contenu reste rendu côté serveur : l'animation ne doit jamais cacher un texte si le JavaScript ne charge pas.
- GSAP : toujours dans **`useGSAP()`** (de `@gsap/react`, nettoyage automatique au démontage et au changement de page), avec un `scope` sur le conteneur ; plugins enregistrés une fois avec `gsap.registerPlugin(...)` côté client.
- **ScrollTrigger et Lenis** : à la première utilisation de ScrollTrigger, brancher Lenis dessus dans `SmoothScroll.tsx` (`lenis.on("scroll", ScrollTrigger.update)`, et `ScrollTrigger.refresh()` après un changement de page), sinon les déclencheurs se décalent.
- Ne pas animer le même élément avec Motion **et** GSAP.
- `prefers-reduced-motion` : passer par `gsap.matchMedia()` (GSAP) ou `useReducedMotion()` (Motion) et afficher l'état final directement. Le reset CSS du § 10 ne suffit pas, car il ne neutralise pas les animations en JavaScript.
- Animer de préférence `transform` et `opacity` (pas de `top`, `width`, `height`) pour rester fluide sur mobile.

## 10 ter. Animations d'apparition au défilement (`src/components/ui/Reveal.tsx`)

Ajoutées le 10/11/2026 à la demande de Louis (écart voulu avec la V1, qui n'en avait pas). Faites avec **Motion**, jouées **une seule fois**, quand l'élément entre à l'écran (30 % visible, 20 % pour les images). Courbe commune `cubic-bezier(.22, 1, .36, 1)` (départ rapide, arrivée très lente, sans rebond).

| Élément | Composant | Animation |
|---|---|---|
| **Titres à filets** et **titres à fil rouge** (`<RuledTitle>`, `<ThreadHeading>`, donc tous les titres de section et les H1 des pages) | `AnimatedHeading`, appelé par `Typography.tsx` | Les **mots montent en fondu** l'un après l'autre (0.35em, 0,8 s, 70 ms d'écart). En même temps, les **filets s'étendent lentement depuis le titre** vers les bords (1,6 s) ; le **fil rouge se déroule** de gauche à droite (depuis le centre s'il est centré), avec 0,35 s de retard. Les traits restent des pseudo-éléments CSS : leur `scaleX` suit les variables `--rule-progress` / `--thread-progress` (1 par défaut), que Motion fait passer de 0 à 1. Les espaces insécables gardent leurs voisins ensemble (« Contact ? »). Un titre qui contient autre chose que du texte apparaît en fondu d'un bloc. |
| **Images** et cadres photo provisoires du contenu | `RevealImage` | **Fondu et montée de 24px**, 1,1 s. Posé sur : univers (accueil), prochain événement, lignes d'ateliers, démarche, médiation, équipe, FAQ, « Comment participer ». Pas sur le héro (il a sa propre animation), ni sur les logos partenaires et les tuiles d'ateliers. |
| **Paragraphes courts** | `TypeText` | Le texte **s'écrit lettre par lettre**, vite : 16 ms par lettre, **1,2 s au plus** quelle que soit la longueur (chaque lettre apparaît en 0,12 s). Gras et liens conservés. Posé sur les intros sous les H1, les textes de sections et les accroches (accueil, ateliers, à propos, calendrier, partenaires, contact, livre d'or). **Pas** sur les pages légales, la FAQ, les avis, la modale du calendrier, les cartes partenaires ni les formulaires (trop longs ou à lire tout de suite). |

Accessibilité et robustesse :
- Le texte est toujours rendu côté serveur, en entier (référencement). Pour les paragraphes, les lecteurs d'écran lisent une copie entière masquée (`sr-only`) et ignorent les lettres découpées ; un paragraphe qui contient un lien est lu tel quel, pour que le lien reste utilisable.
- **Sans JavaScript**, une balise `<noscript>` du layout racine affiche tout (`[data-reveal]`, `[data-reveal-item]`, `[data-c]`).
- **Reduced-motion** : `useReducedMotion()` met les durées à 0, l'état final s'affiche directement.
- Mots et lettres découpés en `<span>` sans espace entre eux : les lignes se coupent comme avant (aucun débordement à 375px sur les 9 pages).

---

## 11. Assets repris de la V1

| Fichier | Origine |
|---|---|
| `public/images/logo-neotisse.png` (+ `src/app/icon.png`) | logo du site WordPress |
| `public/images/textures/lin-brut.jpg`, `lin-texture.png` | textures de lin |
| `public/images/photos/hero-tissage.jpg`, `hero-atelier.jpg` | photos du héro |
| `public/images/partenaires/*` | logos détourés des 7 partenaires (Lattes = Musée Henri Prades) |

Ces images sont provisoires dans `public/` : elles passeront dans Sanity quand le CMS sera en place.

---

## 12. Reste à faire côté design

Voir `docs/TODO.md`.
