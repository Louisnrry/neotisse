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
| Icônes Instagram et Facebook | `src/components/ui/SocialIcons.tsx` (pied de page, page Contact) |
| Page Ateliers (ligne d'atelier) | `src/components/ateliers/WorkshopRow.tsx` (voir § 9 ter) |
| Styles de l'intro, du héro et du bandeau défilant | `src/app/globals.css` (`@layer components`) |
| Champs de formulaire, case à cocher, message, mention RGPD | `src/components/ui/Field.tsx` |
| En-tête, pied de page | `src/components/layout/Header.tsx`, `Footer.tsx` |

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
| Titres, navigation, grands chiffres de dates, citations | **Cormorant Garamond** (`font-serif`) | 700 ; 600 pour certains textes d'accroche ; italique 600–700 |
| Texte courant, boutons, formulaires, étiquettes | **Quicksand** (`font-sans`) | **300** pour le corps (comme la V1) ; 500, 600, 700 |

Les deux polices sont des **fichiers variables** (axe de graisse 300–700), sous-ensemble latin, repris de la V1.

| Token | Valeur | Usage |
|---|---|---|
| `text-body` | `clamp(0.875rem, …, 1.063rem)` | Corps de texte (interligne 1.65) |
| `text-button` | `clamp(0.875rem, …, 1rem)` | Boutons |
| `text-h1` | `clamp(2.8rem, 6vw, 4.6rem)` | H1 |
| `text-h2` | `clamp(2rem, 3.6vw, 2.9rem)` | H2, titres à filets |
| `text-h3` | `clamp(1.5rem, 2.2vw, 1.9rem)` | H3 |
| `text-hero` | `clamp(4rem, 11vw, 8.5rem)` | « Néotisse » du héro (interligne 0.95) |
| `text-intro` | `clamp(4.5rem, 18vw, 19rem)` | Mot coupé de l'intro animée |
| `text-event-date` | `clamp(2.2rem, 4.5vw, 3.4rem)` | Grande date du prochain événement |
| `text-lead` | `clamp(0.875rem, …, 1.2rem)` | Textes d’introduction centrés (V1 : 1.2rem rendu « fluide » par WordPress) |
| `text-tagline` | `clamp(0.875rem, …, 1.3rem)` | Accroches italiques des cartes engagements, rôle des membres |
| `text-subtitle-lg` | `clamp(1.198rem, …, 1.9rem)` | Sous-titre de l’en-tête À propos |
| `text-pull` | `clamp(1.6rem, 2.6vw, 2.1rem)` | Phrase en exergue (Cormorant italique 700 garance) |
| `text-kicker` | `0.78rem` | Surtitres et petites capitales |
| `text-small` | `0.85rem` | Labels, mentions sous formulaires |
| `text-legal` | `0.88rem` | Ligne basse du pied de page |

Titres : Cormorant 700, interligne 1.08, letter-spacing 0.01em, `text-wrap: balance`.
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

Point de rupture spécifique : **`nav:` = 960px**, passage au menu burger.

---

## 5. Signes graphiques

- **Titre à filets** (`<RuledTitle>`, utilitaire `ruled`) : texte centré entre deux lignes de 2px de la couleur du texte, `gap: clamp(16px, 3vw, 40px)`, letter-spacing 0.06em. `tone="creme"` sur fond rouge ou encre. Mettre `as="p"` quand c'est un surtitre de section suivi d'un H2.
- **Fil rouge** (`<ThreadHeading>`, utilitaire `thread`) : trait 64×4px garance sous le titre, à 0.45em. `center` pour le centrer, `tone="creme"` pour un fil crème.
- **Surtitre** (`<Kicker>`) : 0.78rem, 700, letter-spacing 0.14em, majuscules, garance, trait de 3px au-dessus (padding-top 12px).
- **Sous-titre** (`<Subtitle>`) : Cormorant italique 600, garance.
- **Citation** (`<PullQuote>`) : Cormorant italique 700, garance, interligne 1.2.
- **Angles droits partout** : le token de rayon est vidé (`--radius-*: initial`), donc les classes `rounded-*` n'existent pas.
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
| `outline-thin` | bordure **1px** encre, texte encre (« Lire et laisser un avis… » de la page Contact, comme la V1) | fond encre, texte blanc |
| `outline-garance` | bordure 1px garance, texte garance | fond garance, texte blanc |
| `on-red` | fond crème, texte garance-dark (sur fond rouge) | fond encre, texte blanc |
| `on-ink` | fond crème, texte garance-dark (sur fond encre : pied de page, menu mobile) | **fond garance, texte crème** (un survol encre serait invisible sur fond encre) |

| Taille | Padding | Texte |
|---|---|---|
| `default` | `0.85em 1.7em` | `text-button` |
| `compact` | `0.5em 1.1em` | 0.9rem (bouton de la navbar) |
| `large` | `0.95em 2.4em` | 1.05rem (boutons d'envoi des formulaires) |

Quicksand 600, angles droits, transitions 0.2s. `href` interne → `next/link`, `href` externe/`mailto:` → `<a>`, sans `href` → `<button>`.

---

## 7. Formulaires (`Field.tsx`)

- Label : Quicksand 700, 0.85rem, letter-spacing 0.04em, 7px au-dessus du champ.
- Champ : padding 14px, bordure `champ`, fond blanc, texte encre. Focus : bordure encre + halo `rgba(200,54,31,.18)` de 3px.
- Erreur : `aria-invalid`, bordure garance, fond `erreur-bg`, message 0.88rem 600 `garance-dark` relié par `aria-describedby`.
- Deux colonnes Nom / Prénom au-dessus de 640px, une seule en dessous.
- Message de retour : bordure gauche 4px (encre + `succes-bg` pour un succès ; garance + `alerte-bg` pour une erreur).
- Mention RGPD (`<FormLegal>`) : 0.85rem, gris, liens garance.
- Champ obligatoire : astérisque garance après le libellé (`aria-hidden`, l'obligation est portée par `required`).

---

## 8. En-tête

- Collant, fond `blanc/96` + flou 8px, filet bas `filet`, padding vertical 4px.
- Logo 52px, zoom ×1.12 au survol et au focus, sans contour au clic.
- Liens Cormorant 700 1.2rem, écart 32px ; soulignement garance de 2px qui se déploie de gauche à droite (survol et page active, page active en garance, `aria-current="page"`).
- Bouton « Prenez contact » en taille `compact`.
- Se cache au scroll vers le bas (seuil 6px, à partir de 80px), revient au scroll vers le haut ou quand le focus entre dans l'en-tête ; transition 0.35s.
- **Accueil** : `position: fixed` par-dessus le héro, **transparent** jusqu'au premier défilement (> 10px), puis fond blanc définitivement (comme la V1).
- **Sous 960px** : bouton burger → menu plein écran fond encre, liens Cormorant 2.2rem crème (survol `garance-soft`), bouton « Prenez contact » `on-ink`. Focus piégé, Échap ferme et rend le focus au burger, défilement de la page bloqué.

## 9. Pied de page

- Fond encre, texte crème, padding `72px` en haut, `28px` en bas.
- Trois colonnes 38 % / 24 % / 38 % (une seule sous 768px) : logo blanc 56px + « Néotisse » (Cormorant 2.1rem) + texte ; navigation verticale Cormorant 1.25rem ; accroche Cormorant 600 1.45rem + bouton `on-ink` « Écrivez-nous » + e-mail + icônes Instagram et Facebook.
- Liens texte crème, survol `garance-soft` (classes posées sur chaque lien : un style global sur tous les `<a>` du pied de page rendait le bouton « Écrivez-nous » crème sur crème, corrigé le 09/11/2026).
- Ligne basse 0.88rem séparée par un filet crème à 14 % : © année · Mentions légales · Gérer mes cookies · Politique de confidentialité.

---

## 9 bis. Accueil (`src/components/home/`)

Textes dans `src/content/home.ts` (provisoire, en attendant Sanity). Mesures prises sur la V1 à 1440px ; les hauteurs de section de la V2 sont à quelques pixels près (héro 900, partenaires 462, univers 899, événement 895, ateliers 1200, avis 650, contact 473).

| Section | Composant | Détails |
|---|---|---|
| Intro animée | `Intro.tsx` + `intro-script.ts` | Deux moitiés garance avec « Néo » / « tisse » (Cormorant 700 crème, `text-intro`), apparition en fondu + translateY 40px (0.9s), fil crème 3px tracé de haut en bas à 1s, ouverture à 1,65s (translateX ±101 %, 1.25s, `ease-reveal`), fin à 3s (6s maximum). Clic, touche, molette ou glissé pour passer. Jouée **à chaque visite de l'accueil** (comme la V1), sauf en reduced-motion ou dans une iframe. Au chargement, le script du `<head>` (layout racine) pose la classe `intro-play` avant l'affichage ; en arrivant par un lien interne (sans rechargement), `Intro` la pose dans un `useLayoutEffect`, donc sans flash du héro. Le point de coupe est recentré selon la largeur des deux mots. |
| Héro | `Hero.tsx` | `min-h-svh`, fond encre, 2 photos côte à côte (une seule sous 640px), voile `neo-hero__veil` (sombre en bas à gauche + léger en haut). H1 « Néotisse » `text-hero`, accroche `clamp(1.15rem,1.8vw,1.5rem)`, bouton 1.075rem. Avec l'intro : contenu en fondu (délai 0.6s) et photos qui dézooment de 1.12 à 1 (1.8s). |
| Ils nous ont fait confiance | `PartnersBand.tsx` | Fond garance, padding 72px, titre à filets crème sur toute la largeur. Logos 196×140 (padding 14px, logo 80px de haut max) sur toile de lin, écart 20px, défilement 45s linéaire, masque en dégradé sur 8 % de chaque bord, pause au survol et au focus. Liste doublée (copie `aria-hidden`, liens hors tabulation). Reduced-motion : logos statiques centrés, copie masquée. Survol : liseré intérieur encre 2px. Bouton `on-red` centré. |
| Découvrez l'univers Néotisse | `Univers.tsx` | Padding 64px / 112px. Titre à filets (`<p>`), puis grille 42 % / 58 % centrée verticalement : cadre 4/5 garance, H2 à fil rouge, 2 paragraphes, bouton. |
| Prochain événement | `NextEvent.tsx` | Fond garance, padding 96px, titre à filets crème. Grille 58 % / 42 %, écart 88px : date `text-event-date` Cormorant 700, H2 crème, lieu en 600, extrait (ou 45 premiers mots), bouton `on-red` ; image 4/5 (aplat garance-dark sinon). Sans événement : message centré + bouton. Composant mis en cache 1 heure (`"use cache"` + `cacheLife("hours")`). |
| Nos ateliers de médiation textile | `WorkshopTiles.tsx` | Padding 112px. Intro centrée 1.2rem (marges de 8 %). Mosaïque 55 % / 45 %, écart 20px : grande tuile 600px (420px sur mobile), deux tuiles 290px. Couleurs garance / encre / garance-dark. Libellé Cormorant 700 `clamp(1.6rem,2.6vw,2.2rem)` crème en bas à gauche + « → ». Tuile entière cliquable, zoom ×1.03 au survol et au focus clavier (contour encre 3px). Puis « Et bien plus encore à découvrir » + bouton contour, centrés sur une ligne. |
| Ils nous ont laissé un mot | `LatestReviews.tsx` | Padding 96px / 32px. Ligne « Note moyenne : ★★★★★ N avis » (filet encre en bas), puis 4 cartes (4 colonnes, 2 sous 1280px, 1 sous 640px) : titre Cormorant 1.5rem, étoiles, date et auteur en 0.85rem, texte avec liseré garance 3px. Bouton contour centré. |
| Contact | `ContactCta.tsx` | Padding 112px, titre à filets, texte centré 1.2rem, bouton 1.075rem centré. |

---

## 9 ter. Ateliers (`/ateliers-tissage-teinture/`)

Textes dans `src/content/ateliers.ts` (provisoire, en attendant Sanity). Page comparée à la V1 à 1440px : positions identiques au pixel pour l'en-tête et les 4 premiers ateliers ; à 375px, pas de débordement.

| Bloc | Détails |
|---|---|
| En-tête de page | Padding 72px / 24px. H1 à filets « Nos ateliers », intro centrée 1.2rem (24px au-dessus), ligne « Pour les musées… » en 600 `gris` centrée, puis **index** (`<nav>`) 32px plus bas : liens Quicksand 600 encre (survol garance), écart 36px, entre deux filets encre de 1px, padding 14px. |
| Ligne d'atelier (`WorkshopRow`) | Grille 40 % visuel / 60 % texte, écart 88px, padding vertical `clamp(48px,7vw,96px)`, filet `filet` en bas (sauf la dernière). Une ligne sur deux inversée (60/40, visuel à droite). Sous **782px** : une colonne, écart 50px, visuel toujours au-dessus. Visuel 4/5 (photo ou aplat garance / garance-dark / ink). |
| Texte d'un atelier | Surtitre (`Kicker`), H2 8px dessous (ancre `id`), sous-titre Cormorant italique 600 garance 1.5rem, accroche 1.22rem 500 interligne 1.55, puis **repères** (`<dl>`, max 600px, filet encre en haut, lignes `filet` en bas, padding 10px, colonnes 150px / reste, une seule colonne sous 521px, libellé garance en 400) et paragraphes interligne 1.75 ; écart de 1.2rem entre blocs. Le gras des paragraphes est en **400** (gras relatif sur un corps en 300, comme la V1). |
| Bloc final | Fond garance, padding 96px, colonne de 760px, écart 28px : H2 à fil crème **aligné à gauche**, texte centré 1.2rem, bouton `on-red` centré (comme la V1). |

---

## 9 quater. À propos (`src/components/a-propos/`)

Textes dans `src/content/a-propos.ts` (provisoire, en attendant Sanity). Comparée à la V1 à 1024 et 375px : positions identiques. Les sections blanches sont séparées de 1.2rem comme sur la V1.

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

Textes dans `src/content/partenaires.ts`, cartes depuis `src/content/partners.ts` (provisoire, en attendant Sanity). Comparée à la V1 à 1024px (positions identiques à 3–5px près) et à 375px.

| Bloc | Détails |
|---|---|
| En-tête | Colonne de 860px, padding 72px / 24px, écart 20px : H1 à filets, intro centrée `text-lead`. |
| Grille | 1.2rem sous l'en-tête, padding 32px / 112px, contenu 1240px. Colonnes `repeat(auto-fill, minmax(16rem, 1fr))`, écart 28px (4 colonnes à 1440px, 3 à 1024px, 1 sur mobile). |
| Carte (`PartnerCard`) | Fond blanc, bordure 1px `filet` → `garance` au survol (et au focus du lien). Zone logo 170px sur toile de lin (`bg-lin`), filet garance 3px en bas, logo centré 104px de haut max, 80 % de large max, **sans pastille blanche** (comme la V1). Nom en H3 1.5rem interligne 1.15, padding 20px 22px ; lien vers le site (nouvel onglet, souligné, garance) s'il existe. Description interligne 1.6, padding 8px 22px 24px. Sans description, le H3 prend 24px en bas. |
| Devenir partenaire | Fond **pierre**, colonne de 760px, padding 96px, écart 28px : H2 à fil rouge à gauche, texte centré `text-lead`, bouton plein centré. |

## 9 sexies. Contact (`/contact-organiser-un-atelier/`)

Textes dans `src/content/contact.ts` (provisoire, en attendant Sanity), espaces insécables avant « ? » et « : ». Comparée à la V1 à 1024px (positions identiques à quelques pixels près) et à 375px (pas de débordement).

| Bloc | Composant | Détails |
|---|---|---|
| Coordonnées + formulaire | `page.tsx`, `ContactDetails.tsx` | Padding 80px / 112px. Grille 45 % / 55 %, écart 112px (une colonne sous **782px**, écart 56px). À gauche : H1 **à fil rouge** (pas à filets, comme la V1) `clamp(3rem,6vw,4.6rem)` interligne 1, texte 1.1rem (28px au-dessus, 40px dessous), liste de coordonnées (`<dl>`, filet encre en haut, lignes à filet `filet`, padding 18px, colonnes 130px / reste, une seule sous 521px ; libellés en petites capitales grises 0.78rem ; téléphone en 600 chiffres tabulaires + nom en gris ; Instagram et Facebook icône 24px + libellé, empilés), puis bouton `outline-thin` vers le livre d'or (32px au-dessus). À droite : H2 « Écrivez-nous » `clamp(1.6rem,2.4vw,2rem)` (28px dessous), formulaire, mention RGPD 1.2rem dessous. |
| Formulaire | `ContactForm.tsx` | Écart 20px. Nom / Prénom sur 2 colonnes (une sous 521px), e-mail, objet, projet, bouton `large` « Envoyer ». Validation côté client au clic (focus sur le premier champ en erreur), champ piège + délai de 2s. Pour l'instant un envoi valide affiche directement « Merci, votre message est bien parti ! » (route API en phase 3). |
| FAQ | `Faq.tsx` | 1.2rem sous la section précédente, padding 96px / 112px, écart 40px. Titre à filets, puis grille 36 % / 64 %, écart 80px (une colonne sous 782px) : photo 4/5 (`hero-tissage.jpg`) + texte d'intro à gauche ; accordéon `<details>` natif à droite : question Cormorant 700 1.35rem, padding 20px 44px 20px 0, « + » en deux traits garance 16×2px qui devient « − » (0.25s), question ouverte ou survolée en garance, filet encre au-dessus de la première, filets `filet` entre les autres ; réponse interligne 1.7, 64ch max. Balisage JSON-LD `FAQPage`. |

## 10. Accessibilité et mouvement

- Focus visible : **contour 3px garance, décalage 3px** (comme la V1 ; CLAUDE.md indiquait encre). Exception : tuiles ateliers, contour encre.
- Lien d'évitement « Aller au contenu » en premier élément focusable.
- `prefers-reduced-motion` : toutes les transitions et animations sont neutralisées dans `@layer base`.
- `scroll-margin-top: 110px` sur les éléments à ancre (place pour l'en-tête).

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
