# Néotisse V2 : contexte projet pour Claude Code

@AGENTS.md

> Ce fichier donne tout le contexte nécessaire pour reconstruire le site de l’association **Néotisse** en V2.
> La V1 existe et fonctionne (WordPress, voir § 13). La V2 reprend **les mêmes contenus, la même identité visuelle et les mêmes fonctionnalités**, sur une stack moderne.
> Langue du site : **français uniquement**. Ton : chaleureux, précis, vouvoiement.

---

## 0. Règles de travail (à lire en premier, à chaque conversation)

1. **Sources de vérité, par ordre de priorité** :
   1. le **site WordPress V1** (référence visuelle, fonctionnelle et contenus) ;
   2. ce fichier `CLAUDE.md` ;
   3. la maquette Figma.
   Le **cahier des charges PDF** (`docs/Cahier_Des_Charges_Neotisse_V2.pdf`) **n’est pas pris en compte**.
2. **Accès à la V1** : via le serveur MCP **Novamira « neotisse »** (abilities `novamira/execute-php`, `novamira/read-file`, `novamira/list-directory`…). Le site tourne aussi en local sur cette machine : `/Users/louisnourry/Local Sites/neotisse/app/public` (`http://neotisse.local`). Le CSS réel est dans les **styles globaux** (bloc `<style id="global-styles-inline-css">` de n’importe quelle page) et dans l’extension `wp-content/plugins/neotisse-core`. **Ne rien modifier sur le WordPress** : lecture seule.
3. **Tenir les `.md` à jour pendant tout le travail**, pas seulement à la fin :
   - `docs/DESIGN.md` : tout changement de token, composant ou comportement visuel ;
   - `docs/TODO.md` : cocher ce qui est fait, ajouter ce qui est découvert ;
   - `docs/CLAUDE.md` : décisions de projet, écarts constatés avec la V1, nouvelles règles ;
   - `docs/BRIEF.md`, `docs/ARBORESCENCE.md` : si le périmètre ou les pages changent ;
   - `docs/README.md` : commandes et stack, si elles changent.
   Plusieurs conversations se succèdent sur ce projet : ces fichiers sont la mémoire commune.
4. **Git** : le dépôt GitHub `Louisnrry/neotisse` existe.
   - **Committer à chaque changement** (demande de Louis du 09/11/2026) : un commit par modification cohérente, sans attendre qu’on le demande.
   - **Messages de commit simples, concis et explicites** : une seule ligne en français qui dit ce qui change pour le site, sans jargon ni liste de détails. Exemples : « Ajoute le calendrier des ateliers », « Corrige les marges des sections sur mobile », « Rend l’intro visible à chaque visite ».
   - Travail **directement sur `main`**. Ne pas créer de branche (Louis l’a refusé le 09/11/2026).
   - **Ne jamais `git push` sans demande explicite de Louis.** Push de `main` fait le 09/11/2026 à sa demande (accueil) ; chaque nouveau push reste à demander.
   - Ne pas committer `docs/Cahier_Des_Charges_Neotisse_V2.pdf` (fichier de Louis, hors périmètre).
5. **Phase actuelle : contenus et CMS (Sanity)**. Le projet Sanity `t4k96qs7` (dataset `production`) et le Studio embarqué sur `/studio` sont créés, et **toutes les pages lisent Sanity** (09/11/2026, voir « Contenus et Sanity » plus bas). Les contenus de la V1 y sont importés et le site n’affiche plus que ce qui est publié dans le Studio. Restent à faire : le formulaire de contact (e-mails), les analytics, la mise en ligne et le domaine (voir `docs/TODO.md`).
6. Next.js 16 diffère des versions connues : lire la doc embarquée dans `node_modules/next/dist/docs/` avant d’utiliser une API (voir `docs/AGENTS.md`).
7. **Tous les fichiers `.md` du projet vivent dans `docs/`** (demande de Louis du 09/11/2026), y compris ce fichier, `README.md` et `AGENTS.md`. Ne pas en créer à la racine. `next.config.ts` a `agentRules: false` pour que `next dev` ne recrée pas `AGENTS.md` à la racine.

### Décisions prises (09/11/2026)

| Sujet | Décision |
|---|---|
| Hébergement | **Netlify** |
| CMS Sanity | Projet **`t4k96qs7`** créé (dataset `production`), Studio **embarqué sur `/studio`** (décision du 09/11/2026 ; pas de dossier `studio-neotisse/`) |
| Plan Sanity | **Free pour l’instant** : le dataset est public. Ne pas y stocker l’e-mail/IP des avis en production tant que le dataset n’est pas privé (Growth) ou que le stockage n’est pas revu. |
| Domaine, e-mail (Resend), GA4 | Rien n’est acheté ni créé pour l’instant |
| Stockage des messages de contact | Pas pour l’instant |
| Livre d’or | Avis affichés **5 par 5** (« Plus d’avis ») |
| Styles | **Tailwind v4** : tokens en CSS dans `src/app/globals.css` (`@theme`), pas de `tailwind.config.ts` |
| Gestionnaire de paquets | npm |
| Structure | Projet Next.js à la racine du dépôt, code dans `src/`, pages du site dans le groupe de routes `src/app/(site)/` (pour garder `/studio` à part plus tard) |
| Mentions légales | Directrice de la publication : Marie-Salomé Perrichon. Siège, RNA, téléphone, SIRET : à fournir plus tard |

### Écarts constatés entre ce fichier et la V1 (la V1 gagne)

- Corps de texte en Quicksand **300** (et non 400).
- Focus visible : contour **garance** 3px, décalage 3px (et non encre). Seules les tuiles ateliers ont un contour encre.
- Pied de page : 3 colonnes (logo + texte / navigation verticale / accroche + bouton + e-mail + réseaux), liens au survol en `#F08C78`.
- Partenaire « Musée Henri Prades » = logo du **Musée de Lattes** (site archéologique Lattara).
- Mise en page des sections : contenu plafonné à **1240px** avec une gouttière `s50` (et non 1340px).
- Cadres photo provisoires : **aplats unis** (la trame rayée est masquée par l’aplat sur la V1).
- Accueil : « Découvrez l’univers Néotisse » n’a pas de photo décalée sur la V1, juste un cadre 4/5 à gauche ; « Et bien plus encore à découvrir » et son bouton sont centrés sur une même ligne ; la note moyenne s’affiche au-dessus des 4 avis.
- Ateliers : chaque atelier a, en plus de CLAUDE.md § 6.2, une accroche et 3 **repères** (Format, Pour qui…) ; mise en page en lignes alternées 40/60 (pas de cartes) ; le bloc rouge final a son titre aligné à gauche (gardé comme la V1, décision de Louis du 09/11/2026). Le gras dans les textes est en 400 (gras relatif sur un corps en 300).
- Intro animée : **jouée à chaque visite de l’accueil**, comme la V1 (décision de Louis du 09/11/2026 ; ce fichier disait « une fois par session »). Y compris en revenant sur l’accueil par un lien interne.
- Intro animée : **écart volontaire avec la V1** depuis le 10/11/2026 (décision de Louis) : « Néotisse » en Eagle Lake qui s’écrit à la plume avec Motion (voir § 5.2), au lieu du mot en Cormorant qui apparaît en fondu.
- Défilement doux avec **Lenis** (ajout du 10/11/2026, demande de Louis ; la V1 n’en avait pas) : inertie légère, molette et pavé tactile seulement, défilement natif au doigt. Détails dans `docs/DESIGN.md` § 10.
- Navbar : **écart volontaire avec la V1** depuis le 10/11/2026 (maquette Figma « navbar à faire ») : barre flottante crème arrondie, « Néotisse » en Eagle Lake au centre, bouton « Contact » au lieu de « Prenez contact ». Les coins arrondis sont la seule exception à la règle des angles droits (§ 12).
- Titres : **Eagle Lake** au lieu de Cormorant Garamond depuis le 10/11/2026 (demande de Louis). Cormorant reste pour la navigation, les **titres des avis** (accueil et livre d’or), les sous-titres et citations en italique, les grands chiffres de dates et les questions de la FAQ. Tailles de titres réduites d’environ 15 %. Détails dans `docs/DESIGN.md` § 3.

- À propos (V1, page 19) : pas de citation isolée. L’ordre réel est : en-tête (H1 à filets, sous-titre, texte) ; « Notre démarche… » (photo 4/5 + texte avec la phrase en exergue « C’est de ce constat qu’est née Néotisse. ») ; « Nos engagements… » (3 cartes, décalages de 48 et 96px seulement à partir de 900px) ; « Une médiation… par le geste et la matière » (visuel 21/9 et encart blanc qui le chevauche, avec une ombre douce) ; « Notre équipe » (fond pierre, rôle « Co-créatrice de Néotisse » pour les deux) ; « Travaillons ensemble » (fond garance). Les titres à fil rouge y sont alignés à gauche.
- WordPress ajoute 1.2rem d’espace entre les grandes sections de la page À propos : reproduit entre sections blanches, **mais pas** la bande blanche qu’il laisse entre « Notre équipe » (pierre) et « Travaillons ensemble » (garance), qui ressemble à un défaut.
- Partenaires (V1, page 13) : le bloc « Devenir l’un de nos partenaires ? » est sur fond **pierre** (titre à fil rouge à gauche, texte centré, bouton plein), pas rouge. Le logo des cartes est posé directement sur la toile de lin (la pastille blanche du § 6.4 est annulée sur la V1). Les noms liés sont soulignés, en garance.

- Contact (V1, page 11) : le H1 « Contact » est à **fil rouge** (aligné à gauche), pas à filets. La colonne gauche liste les coordonnées en tableau (E-mail, **Téléphone 06 48 65 58 16 – Marie-Salomé Perrichon**, Basées à Montpellier, Suivez-nous) puis le bouton contour fin « Lire et laisser un avis dans notre livre d’or ». La FAQ n’est **pas** sur 2 colonnes de questions : photo 4/5 + texte d’intro à gauche (36 %), les 10 questions en une colonne à droite (64 %). Libellés obligatoires avec un astérisque garance. Instagram et Facebook (icône + libellé) sont sur une seule ligne ; le titre de la FAQ garde l’interlettrage des titres (0.01em), pas celui des autres titres à filets.

- Livre d’or (V1, page 126) : une seule colonne de 860px (padding 72px / 112px, écart 28px). Les H2 « Ils nous ont laissé un mot » et « Signer le livre d’or » sont à **fil rouge** alignés à gauche (pas à filets). La carte du formulaire a son propre titre « Laisser un avis ». Champs : Nom, Adresse e-mail (2 colonnes, une sous 561px), Titre de votre avis, Votre note, Votre avis, « Je confirme ne pas être un robot. ». Sur la V1, le CSS de l’extension WP Customer Reviews écrase une partie du style voulu dans `neotisse-core` (titres d’avis en 13,6px, date en italique, double séparateur entre avis) : la V2 reproduit ce rendu **à l’identique** (décision de Louis du 09/11/2026 : titre Cormorant 0.8em, date et auteur en italique, double séparateur filet + pointillés, étoiles sprite de l’extension). Écarts assumés : astérisques sur les champs obligatoires (comme Contact) et confirmation en ligne au lieu de l’alerte en anglais de l’extension.

- Mentions légales (V1, page 197) : en-tête dans une colonne de 860px (H1 à filets, date « Dernière mise à jour » centrée en 0.95rem), corps dans une colonne de 760px, intertitres H2 en `clamp(1.5rem, 2.4vw, 1.9rem)` à 48px au-dessus. Écarts de contenu voulus : hébergeur **Netlify, Inc.** (la V1 cite OVH), directrice « Marie-Salomé Perrichon » et téléphone renseignés. Les champs encore inconnus restent affichés en « [À COMPLÉTER : …] » comme sur la V1.

- Politique de confidentialité (V1, page 201) : même en-tête que les mentions légales ; corps en 760px : intro, « Sommaire » (H2 1.2rem fluide, 40px au-dessus) puis liste numérotée (interligne 1.9, liens encre soulignés d’un filet garance de 1px, garance au survol), 9 H2 numérotés à **56px** au-dessus, H3 en 1.35rem fluide à 32px, listes à puces (retrait 40px, 8px entre éléments). Écarts de contenu voulus pour la V2 : hébergeur **Netlify** (États-Unis, d’où un transfert hors UE) au lieu d’OVH ; **Sanity** (avis) et le prestataire d’e-mails ajoutés aux destinataires ; cookie de consentement `neotisse_consent` (12 mois) au lieu de Complianz ; cookies de commentaires WordPress et stockage des émojis retirés ; accès au Studio au lieu de l’administration WordPress ; représentante « Marie-Salomé Perrichon » renseignée. Les champs inconnus restent en « [À COMPLÉTER : …] ».

- Cookies (V1 : bandeau Complianz, pas de page dédiée) : « Gérer mes cookies » **rouvre le bandeau**. La V1 l’affiche même sans traceur actif et garde le choix **365 jours** (et non 6 mois) : la V2 fait pareil. Catégories visibles : Fonctionnel (toujours activé) et Statistiques seulement. Le titre est masqué sous 426px et « Toujours activé » est en vert, comme la V1. Détails : `docs/DESIGN.md` § 9 octies.

- Calendrier (V1, page 17) : sous le H1, une phrase d’intro (« Le calendrier des ateliers Néotisse rassemble… »). « À venir » et « Calendrier des ateliers et événements » sont des **titres à filets** (H2). La liste « À venir » occupe toute la colonne de 1040px (le 880px du CSS n’est pas appliqué). Le bloc final « Comment participer à nos ateliers ? » est en deux colonnes (photo 4/5 à 40 %, texte à 60 %) avec le H3 « Vous êtes un musée ou une structure culturelle ? » et le bouton « Programmer un atelier » ; il n’est pas sur fond de couleur. Sans événement, la liste affiche « Aucun événement programmé pour le moment. » (et non le texte par défaut du schéma Sanity). La modale a deux boutons : lien vers le lieu et « Prenez contact ».

### Contenus et Sanity (branché le 09/11/2026)

- Les pages et composants lisent le contenu **uniquement** par les fonctions de `src/sanity/queries/` (`getHomePage`, `getAllEvents`, `getReviews`, `getContactPage`…). Chaque requête GROQ renvoie **la même forme** que l’ancien contenu local, pour ne pas toucher aux composants.
- `fetchSanity` (`src/sanity/lib/live.ts`) : contenu **publié** seulement (pas de brouillons ni d’aperçu), mis en cache (`"use cache"`, étiquettes posées par `sanityFetch`). `<SanityLive />` (layout du site) invalide ces étiquettes dès qu’un document est publié : **le site se met à jour sans webhook ni redéploiement**. Si Sanity ne répond pas, les sections concernées s’affichent vides et le site réessaie quelques minutes plus tard.
- **Le site = le Studio** (09/11/2026) : plus aucun contenu de secours. `src/content/` a été supprimé (il reste dans l’historique git). Chaque requête complète les champs manquants avec des valeurs **vides** (`withDefaults`, `src/sanity/lib/fallback.ts`) pour garantir la forme des données : un champ vide n’affiche rien, une liste vide n’affiche rien, un bouton sans destination n’est pas affiché (`<Button href="">` → rien), une photo absente laisse le cadre provisoire. Les types des contenus sont dans `src/sanity/types.ts`.
- Seuls quelques libellés d’interface restent dans le code (« En savoir plus », « Prenez contact » de la modale, « Sommaire », libellés du formulaire).
- Texte enrichi : converti par `src/sanity/lib/portableText.ts` vers le format de `<RichText>` (gras, liens, retours à la ligne). Pages légales : un titre 2 ouvre une rubrique (mentions légales) ; un titre 3 regroupe la liste à puces qui suit (confidentialité) ; un lien vers `#cookies` devient le bouton « Gérer mes cookies ».
- Listes (partenaires, ateliers, FAQ, équipe) : **tous les documents publiés s’affichent** (`src/sanity/lib/ordering.ts`). Ceux glissés dans la liste de la page (Partenaires, Ateliers, Contact → Questions, À propos → Membres) viennent d’abord, dans cet ordre ; les autres suivent, triés par « Ordre d’affichage ». Avant le 09/11/2026, seule la liste de la page comptait : un partenaire créé sans y être ajouté n’apparaissait pas.
- Téléphone et ville de la page Contact : page Contact, sinon Réglages du site, sinon la V1.
- Schéma `calendrierPage` adapté au rendu réel : photo « Comment participer », textes en texte enrichi (ils contiennent des liens), titre du calendrier mensuel ; bouton « Comment participer » retiré (absent de la V1).
- **Import de la V1** (09/11/2026) : fait une fois avec un script (`npx sanity exec … --with-user-token`, connexion de la CLI, sans écraser l’existant), supprimé ensuite avec `src/content/` (voir l’historique git, commit « Importe les contenus de la V1 dans Sanity »). Les 6 avis de la V1 ont été repris du WordPress avec leurs e-mails, en « Publiés » (identifiants `review-v1-…`) ; leur script n’a pas été versionné car le dépôt est public.
- Confidentialité : chaque section a un champ « Ancre » (ancres de la V1 : `#responsable`…) ; à défaut, l’ancre est tirée du titre.
- **Bandeau cookies** : document « Bandeau cookies » (`cookieBanner`), lu par le layout du site et passé au composant client.
- **Mentions sous les formulaires** : champ « Mention sous le formulaire » (texte enrichi) dans le formulaire des pages Contact et Livre d’or.
- **Livre d’or** (09/11/2026) : le formulaire envoie à `POST /api/livre-dor/` (`src/app/api/livre-dor/route.ts`), qui valide (règles partagées `src/lib/guestbook.ts`), applique l’anti-spam (champ piège, délai 2 s, au plus 5 avis par IP et par heure, compteur en mémoire) et crée un document `review` en **« À modérer »** avec l’e-mail et l’IP. Écriture avec `SANITY_API_WRITE_TOKEN` (rôle Editor), **serveur uniquement** (`src/sanity/lib/writeClient.ts`). Sans token : réponse 503 et message d’erreur dans le formulaire.
- **E-mail et IP des avis : décision de Louis du 09/11/2026** : on les garde, bien que le dataset soit public en plan Free (lisibles via l’API). Les visiteurs en sont informés sous le formulaire, dans la politique de confidentialité (rubriques « Le livre d’or », destinataires, sécurité) et dans les mentions légales (rubriques « Gestion des contenus » et « Données personnelles »).

---

## 1. Le projet en bref

- **Client** : Néotisse, association loi 1901 basée à Montpellier, fondée en mai 2024.
- **Activité** : médiation scientifique autour des **savoir-faire textiles anciens** (du Néolithique au Moyen Âge) : filage, tissage (dont tissage aux tablettes), teinture végétale. Ateliers démonstratifs et participatifs, ateliers enfants, conférences, expérimentation archéologique.
- **Publics visés** : musées, sites archéologiques, structures culturelles, collectivités, universités/chercheurs ; secondairement le grand public et les familles.
- **Objectifs du site** :
  1. Présenter l’association et ses ateliers.
  2. Afficher l’agenda des interventions.
  3. **Générer des demandes d’atelier** (objectif n°1 : formulaire de contact).
  4. Rassurer par les partenaires et les avis (livre d’or).
- **Réalisation** : agence bLaNk (Louis Nourry).
- **Domaine cible** : `https://neotisse.fr`

---

## 2. Stack technique

| Couche | Choix |
|---|---|
| UI | **React** + **TypeScript** |
| Framework | **Next.js (App Router)** recommandé pour le SEO (pages rendues côté serveur, métadonnées, sitemap). Si un SPA Vite est imposé, prévoir le pré-rendu des pages. |
| Styles | **Tailwind CSS v4** (tokens de la charte dans `@theme` de `src/app/globals.css`, voir § 4 et `docs/DESIGN.md`) |
| CMS | **Sanity** (headless) : Studio embarqué sur `/studio`, requêtes GROQ, images via `@sanity/image-url` |
| Formulaires | Route API (Next.js) qui écrit dans Sanity et/ou envoie un e-mail (ex. Resend). Anti-spam : champ piège (honeypot) + délai minimal, **pas de reCAPTCHA** (cookies Google). |
| Hébergement | **Netlify** |
| Animations | **Motion** (`motion/react`), **GSAP** (`gsap` + `@gsap/react`, ajouté le 10/11/2026) et **Lenis** (défilement doux). Répartition et règles : `docs/DESIGN.md` § 10 bis |
| Polices | **Auto-hébergées** (`next/font/local` ou `@fontsource`), aucun appel à Google Fonts (RGPD). |

Règles générales :
- Composants petits et réutilisables ; aucune donnée de contenu codée en dur si elle doit être éditable par l’association → **Sanity**.
- Revalidation à la publication Sanity (webhook → `revalidateTag`/`revalidatePath`) pour que le site se mette à jour sans redéploiement.
- Accessibilité **WCAG AA** visée (voir § 10).

---

## 3. Arborescence et routes

| Route | Page | Contenu principal |
|---|---|---|
| `/` | Accueil | Intro animée, héro plein écran, bandeau partenaires défilant, « L’univers Néotisse », prochain événement, tuiles ateliers, 4 derniers avis, bloc contact |
| `/ateliers-tissage-teinture/` | Ateliers | Les 5 formats + bloc « Des ateliers de tissage adaptés à vos projets » |
| `/calendrier-des-ateliers/` | Calendrier | Liste « À venir » + calendrier mensuel + modale détail + « Comment participer » |
| `/partenaires/` | Partenaires | Grille de cartes partenaires + « Devenir l’un de nos partenaires ? » |
| `/livre-dor/` | Livre d’or | Liste des avis + formulaire « Signer le livre d’or » |
| `/savoir-faire-textiles-anciens-a-propos/` | À propos | Démarche, 3 engagements, citation, équipe, « Travaillons ensemble » |
| `/contact-organiser-un-atelier/` | Contact | Formulaire « Écrivez-nous » + FAQ en accordéon (10 questions) |
| `/mentions-legales/` | Mentions légales | noindex |
| `/politique-de-confidentialite/` | Politique de confidentialité | noindex, sommaire cliquable |
| `/studio/` | Sanity Studio | non indexé |

**Conserver ces URL, barre finale comprise**, comme la V1 (référencement et liens existants). `next.config.ts` a `trailingSlash: true` : une URL sans barre finale redirige vers celle avec. Les liens passent par `src/lib/routes.ts`.

**Navigation principale** : Ateliers · Calendrier · Partenaires · Livre d’or · À propos, + bouton **« Prenez contact »** (→ Contact).

**Pied de page** (fond encre `#1E2B33`, texte crème) :
- « Néotisse » + « Association de médiation autour des savoir-faire textiles anciens, basée à Montpellier. »
- « Un projet d’atelier, de conférence ou d’expérimentation ? » + bouton **« Écrivez-nous »** + `asso.neotisse@gmail.com`
- Liens sociaux (icônes seules) : Instagram `https://www.instagram.com/neotisse.asso/`, Facebook `https://www.facebook.com/p/Neotisse-61558744726575/`
- Ligne basse (0.88rem, séparée par un filet clair) : `© 2026 Association Néotisse · Mentions légales · Gérer mes cookies · Politique de confidentialité`

---

## 4. Identité visuelle

### 4.1 Couleurs

| Token | Nom | Hex | Usage |
|---|---|---|---|
| `garance` | Rouge garance | `#C8361F` | Couleur signature : boutons, liens, filets, accents, fonds forts |
| `garance-dark` | Garance foncé | `#9E2A17` | Survol des boutons et liens, variantes de tuiles |
| `ink` | Encre | `#1E2B33` | Texte principal, titres, pied de page, filets des titres |
| `creme` | Crème | `#FFF8F0` | Texte sur fond rouge/encre, fonds doux |
| `pierre` | Pierre claire | `#FBF9F7` | Fonds de cartes (liste À venir, sections alternées) |
| `filet` | Filet | `#ECE4DC` | Bordures fines, séparateurs |
| `gris` | Gris | `#5B6670` | Texte secondaire, métadonnées, mentions sous formulaires |
| `blanc` | Blanc | `#FFFFFF` | Fond par défaut du site |

```css
/* src/app/globals.css (extrait) : Tailwind v4, liste complète dans docs/DESIGN.md */
@theme {
  --color-garance: #c8361f;
  --color-garance-dark: #9e2a17;
  --color-ink: #1e2b33;
  --color-creme: #fff8f0;
  --color-pierre: #fbf9f7;
  --color-filet: #ece4dc;
  --color-gris: #5b6670;
}
```

> Retour cliente sur la maquette d’origine : couleurs jugées « pas assez flashy ». Le rouge garance est donc utilisé **franchement** (fonds pleins de sections, intro, modale), pas seulement en accent.

### 4.2 Typographie

| Rôle | Police | Graisses |
|---|---|---|
| Titres, navigation, chiffres de dates, citations | **Cormorant Garamond** | 500, 600, 700, 600 italique |
| Texte courant, boutons, formulaires, étiquettes | **Quicksand** | 400, 500, 600, 700 |

- Corps : Quicksand **1.0625rem**, interligne **1.65**, couleur `ink`.
- Titres : **Eagle Lake 400** (depuis le 10/11/2026, voir § 0), interligne 1.08, letter-spacing 0.01em, couleur `ink`.
  - H1 : `clamp(2.8rem, 6vw, 4.6rem)`
  - H2 : `clamp(2rem, 3.6vw, 2.9rem)`
  - H3 : `clamp(1.5rem, 2.2vw, 1.9rem)`
- Liens : `garance`, survol `garance-dark`.

### 4.3 Signes graphiques distinctifs (à reproduire)

- **Titre à filets** (`Ruled`) : titre centré entre deux lignes horizontales de 2px `ink` (flex, `gap: clamp(16px,3vw,40px)`, lignes en `flex:1`), letter-spacing 0.06em. Sur fond rouge : lignes et texte **crème**. Utilisé pour les grands titres de section (« Ils nous ont fait confiance », « Nos ateliers… », « Ils nous ont laissé un mot », « Contact », « Découvrez l’univers Néotisse », « Tenez-vous au courant des prochains événements », H1 des pages internes).
- **Fil rouge** (`Thread`) : trait `garance` de 64×4px sous un titre (centré si le titre est centré ; crème sur fond rouge/encre).
- **Surtitre** (`Kicker`) : 0.78rem, 700, letter-spacing 0.14em, MAJUSCULES, `garance`, trait de 3px `garance` au-dessus.
- **Sous-titre / citation** : Cormorant italique 600–700, `garance`.
- **Angles droits partout** : `border-radius: 0` (boutons, cartes, champs, modale).
- **Filet rouge en haut des cartes** : `border-top: 4px solid garance` (avis, formulaire du livre d’or).
- **Fond de lin** derrière les logos partenaires (texture de toile écrue, image fournie), avec un filet `garance` de 3px en bas.
- **Cadres photo provisoires** : aplats de couleur avec fine trame rayée en attendant les vraies photos (à remplacer par les images Sanity).

### 4.4 Boutons

- Plein (défaut) : fond `garance`, texte `creme`, Quicksand 600, 1rem, padding `0.85em 1.7em`, radius 0 ; survol fond `garance-dark`.
- Contour : bordure `ink`, survol fond `ink` + texte blanc.
- Sur fond rouge : fond `creme`, texte `garance-dark` ; survol fond `ink` + texte blanc.
- Transitions 0.2s sur fond et couleur.

---

## 5. En-tête, intro et animations

### 5.1 En-tête (navbar)
- **Refaite le 10/11/2026** d’après la maquette Figma « navbar à faire » (node `407:10`), à la demande de Louis : barre **flottante** crème aux **coins arrondis** (24px ; bouton « Contact » à 16px), trois liens à gauche, **« Néotisse » en Eagle Lake au centre** (lien vers l’accueil, remplace le logo), deux liens et le bouton « Contact » à droite. Détails dans `docs/DESIGN.md` § 8.
- Comportement conservé : collante, **se cache au scroll vers le bas, réapparaît au scroll vers le haut** (transition 0.35s) ; sur l’accueil, fixée par-dessus le héro et **transparente à l’arrivée** (texte crème), crème dès qu’on défile ; soulignement garance au survol et sur la page active.
- Mobile (sous 1200px) : mot centré + menu burger accessible (focus piégé, Échap pour fermer).

### 5.2 Intro animée (accueil, à chaque visite)
- **Refaite le 10/11/2026 à la demande de Louis** (elle ne reprend plus la V1 sur ce point) : le mot « Néotisse » est en **Eagle Lake** (police réservée à l’intro) et **s’écrit à la plume** sur fond garance, avec la librairie **Motion** (`motion/react`).
- Déroulé (≈ 4,3 s) : le **« N » se trace seul, centré**, puis se remplit ; il **glisse vers la gauche** pour laisser la place au reste ; « éotisse » s’écrit lettre par lettre (contour puis remplissage) ; le **fil crème vertical** (3px) se trace entre « Néo » et « tisse » ; les **deux moitiés s’écartent** (translateX ±101%, 1.25s, `cubic-bezier(.77,0,.18,1)`) pour révéler le héro.
- Les lettres sont des **tracés SVG** générés depuis la police (`scripts/generate-intro-glyphs.mjs` → `src/components/home/intro-glyphs.ts`) : aucune police à télécharger pour le visiteur.
- Le contenu du héro arrive ensuite en fondu (délai 0.6s) et la photo dézoome (scale 1.12 → 1, 1.8s).
- Clic, touche, molette ou glissé pour passer (le mot finit de s’écrire en 0,3 s pendant l’ouverture). **Désactivée** si `prefers-reduced-motion` ou dans une iframe. Jouée **à chaque visite** de l’accueil (comme la V1, voir § 0).

### 5.3 Autres animations
- **Bandeau partenaires** (accueil, fond rouge) : logos qui **défilent en boucle** (45s, linéaire), masque en dégradé sur les bords, **pause au survol/focus** ; avec `reduced-motion` : logos statiques centrés.
- **Tuiles ateliers** (accueil) : entièrement cliquables, **léger zoom (scale 1.03) au survol, sans ombre**.
- **Cartes « À venir »** (calendrier) : bordure `garance` + translateX(4px) au survol ; « En savoir plus → » dont la flèche avance de 4px.
- **Logos / cartes partenaires** : bordure `filet` → `garance` au survol.
- Toutes les animations respectent `prefers-reduced-motion`.

---

## 6. Détail des pages

### 6.1 Accueil
1. **Héro** plein écran (`min-height: 100svh`, fond `ink`) : deux photos côte à côte en `object-fit: cover` (une seule sur mobile), voile en dégradé sombre en bas à gauche ; en bas : H1 « Néotisse » (crème, `clamp(4rem,11vw,8.5rem)`), accroche, bouton « Découvrir nos ateliers ».
2. **« Ils nous ont fait confiance »** : section fond rouge, titre à filets crème, bandeau de logos défilant, bouton « Découvrir tous nos partenaires ».
3. **« Découvrez l’univers Néotisse »** (titre à filets, en paragraphe) puis H2 avec fil rouge « Néotisse : l’art de faire revivre un savoir-faire », texte, photo décalée, bouton « Connaître notre histoire ».
4. **« Tenez-vous au courant des prochains événements »** : section fond rouge, titre à filets crème ; **prochain événement dynamique** (§ 7.1) : grande date en Cormorant (`clamp(2.2rem,4.5vw,3.4rem)`), titre H2 crème, lieu (600), extrait, bouton « Voir tous nos événements » ; à droite l’image de l’événement au format **4/5** (aplat `garance-dark` tramé si pas d’image). Sans événement à venir : « Pas d’événement programmé pour le moment, revenez bientôt ! » + bouton.
5. **« Nos ateliers de médiation textile »** : titre à filets, texte d’intro, **3 tuiles** en mosaïque (une grande à gauche 55% / 600px de haut, deux empilées à droite 290px) : « Atelier participatif » (garance), « Ateliers pour enfants » (ink), « Ateliers démonstratifs » (garance-dark) ; libellé Cormorant 700 crème en bas à gauche suivi de « → » ; lien vers l’ancre correspondante de la page Ateliers. Puis « Et bien plus encore à découvrir » + bouton « Voir tous nos ateliers ».
6. **« Ils nous ont laissé un mot »** : titre à filets, **4 derniers avis approuvés** sur une ligne (2 colonnes < 1100px, 1 < 640px), cartes blanches à filet rouge en haut, titre de l’avis en Cormorant, étoiles, texte avec liseré gauche `garance` ; bouton « Lire tout le livre d’or ».
7. **« Contact »** : titre à filets, texte d’invitation, bouton « Prenez contact ».

### 6.2 Ateliers
- H1 à filets « Nos ateliers », intro, **index** (liste de liens d’ancre entre deux filets `ink`).
- 5 sections avec ancre, surtitre + H2 + sous-titre italique + texte + visuel :
  - `#demonstratifs` Ateliers démonstratifs (filage, tissage, teinture végétale ; 3 pôles combinables)
  - `#participatif` Atelier participatif (tissage aux tablettes ; chaque participant repart avec son galon)
  - `#enfants` Ateliers pour enfants (tissage sur carton, teinture végétale)
  - `#conferences` Conférences (archéologie des textiles)
  - `#experimentation` Expérimentation archéologique (ex. ceintures à chevrons inspirées des statues-menhirs)
- Bloc final fond rouge « Des ateliers de tissage adaptés à vos projets » + bouton « Prenez contact ».

### 6.3 Calendrier
- H1 à filets « Calendrier ».
- **« À venir »** : liste de cartes-boutons (fond `pierre`) : colonne date (jour en Cormorant 2.8rem `garance`, mois/année en petites capitales `gris`, filet vertical), puis type (petites capitales), titre (Cormorant 1.6rem), « dates · lieu » (600, `garance`), et **« En savoir plus → »** à droite (sous le texte sur mobile). Clic → modale détail.
- **Calendrier mensuel** : barre « ‹ Mois année › » (boutons carrés 46px bordure `ink`), grille 7 colonnes (lun → dim), en-têtes en petites capitales `gris`, cases à bordures `filet` (min-height 124px, 64px mobile), jours hors mois hachurés, **jour courant en pastille `garance`**, événements sous forme de pastilles cliquables (barres de 8px sur mobile).
- **Modale détail** (`<dialog>`, 1080×720 max, fond flouté) : colonne gauche `garance` (grand jour Cormorant 4.5–7.5rem, mois, type en bas), colonne droite : titre, lieu, horaires, texte complet, lien vers le lieu ; bouton fermer carré en haut à droite ; Échap pour fermer, focus géré.
- Bloc « Comment participer à nos ateliers ? » + « Vous êtes un musée ou une structure culturelle ? » + bouton « Programmer un atelier ».

### 6.4 Partenaires
- H1 à filets « Nos partenaires » + intro « Musées, sites archéologiques, festivals et universités : ils ont accueilli nos ateliers et nos conférences. »
- Grille (min 16rem par colonne) de cartes : zone logo sur fond de lin (170px de haut, logo centré sur pastille blanche, filet `garance` en bas), nom (H3), description (ce que Néotisse y a animé), lien vers le site si renseigné ; bordure `filet` → `garance` au survol.
- Bloc « Devenir l’un de nos partenaires ? » + « Prenez contact ».
- 7 partenaires actuels, dans cet ordre : Festival du Lin, Musée Henri Prades, Musée de Gergovie, CERAC, Musée de Tautavel, Lozère Tourisme, Université Paul-Valéry Montpellier 3.

### 6.5 Livre d’or
- H1 « Livre d’or » + intro.
- « Ils nous ont laissé un mot » : note moyenne + liste des avis approuvés (étoiles, date, « par Nom », titre, texte avec liseré rouge), séparés par des filets ; **bouton « Plus d’avis »** (contour garance) pour afficher la suite.
- « Signer le livre d’or » : formulaire toujours ouvert dans une carte blanche à filet rouge : **Nom*** et **E-mail*** (2 colonnes), Titre, Note (5 étoiles), Avis, case « Je confirme ne pas être un robot », bouton plein. Mention RGPD dessous (§ 9).

### 6.6 À propos
- H1 « À propos de Néotisse », sous-titre italique.
- « Notre démarche autour des savoir-faire textiles anciens ».
- « Nos engagements… » : 3 cartes décalées verticalement : **L’originalité** (fond `garance`, texte crème), **La rigueur scientifique** (bordure 2px `garance`, décalée de 48px), **La flexibilité** (fond `ink`, décalée de 96px).
- Citation en grand italique `garance`.
- « Notre équipe » : 2 membres, **Émilie Roma Sert** et **Marie-Salomé Perrichon** (photo, nom, rôle, bio, lien).
- Agencement réel de la V1 (ordre, encart chevauchant, phrase en exergue) : voir § 0 « Écarts constatés ». Implémenté dans `src/components/a-propos/`.
- « Travaillons ensemble » + « Prenez contact ».

### 6.7 Contact
- H1 « Contact ».
- Colonne gauche : texte, coordonnées, réseaux. Colonne droite (55%) : **« Écrivez-nous »** formulaire (§ 7.4).
- « Organiser un atelier : vos questions » : **FAQ en accordéon** sur 2 colonnes : question en Cormorant 1.35rem, icône « + » en deux traits `garance` qui devient « − », question active en `garance`, premier élément avec filet `ink` au-dessus, séparateurs `filet`. Les 10 questions :
  1. Qui peut organiser un atelier avec Néotisse ?
  2. Quels formats peut-on vous demander ?
  3. Peut-on adapter le contenu à notre public ?
  4. Peut-on combiner plusieurs ateliers ?
  5. Où intervenez-vous ?
  6. Comment se passe la préparation ?
  7. Que préciser dans votre message ?
  8. Pourquoi organiser un atelier textile dans votre structure ?
  9. Proposez-vous des activités pour les enfants ?
  10. Travaillez-vous avec des chercheurs ?
- Lien « Lire et laisser un avis dans notre livre d’or ».
- Ajouter le balisage **FAQPage** (JSON-LD).

---

## 7. Fonctionnalités

### 7.1 Événements
- Type Sanity `event` (§ 8). Affichés dans : la liste « À venir », le calendrier mensuel, la modale, et le bloc « prochain événement » de l’accueil.
- **Prochain événement** = événement publié dont `endDate ?? startDate` ≥ aujourd’hui (fuseau **Europe/Paris**), trié par `startDate` croissant, le premier.
- **À venir** = tous les événements non passés, triés par date.
- **Format des dates en français**, règles de la V1 :
  - un jour : « 26 octobre 2027 » (« 1er » pour le premier du mois)
  - deux jours consécutifs du même mois : « 9 et 10 octobre 2027 »
  - plage dans le même mois : « 3 au 7 octobre 2027 »
  - plage sur deux mois : « 30 septembre au 2 octobre 2027 »
- Types : `atelier` (Atelier), `festival` (Festival), `conference` (Conférence), `autre` (Autre).

### 7.2 Partenaires
- Type `partner`, ordre manuel (`order`), logo (PNG fond transparent conseillé), description courte, site web optionnel.

### 7.3 Livre d’or
- Soumission publique → document `review` créé avec `status: "pending"` (via route API avec token d’écriture Sanity côté serveur uniquement).
- **Modération par l’association** dans le Studio (passer en `approved`). Seuls les avis `approved` s’affichent.
- E-mail et IP **jamais affichés** ; IP stockée uniquement pour prévenir les abus (mentionnée dans la politique de confidentialité).
- Accueil : 4 derniers avis approuvés ; page Livre d’or : tous, 5 par 5 avec le bouton « Plus d’avis ».

### 7.4 Formulaire de contact
- Champs (tous obligatoires) : **Nom**, **Prénom** (2 colonnes), **Adresse e-mail**, **Objet** (placeholder « Organiser un atelier, conférence, partenariat… »), **Votre projet** (textarea, placeholder « Parlez-nous de votre projet : lieu, public, dates envisagées… »).
- Bouton « Envoyer ». Confirmation inline : « **Merci, votre message est bien parti !** Nous revenons vers vous très vite. »
- Envoi d’un e-mail à l’adresse configurée dans Sanity (`siteSettings.contactRecipient`), objet `[Néotisse] {objet}`, `Reply-To` = e-mail du visiteur.
- Validation côté client et serveur, messages d’erreur accessibles (`aria-invalid`, `aria-describedby`), erreurs en `garance-dark`.
- Champs : padding 14px, bordure `#CFC7BF`, fond blanc, focus bordure `ink` + halo `rgba(200,54,31,.18)` ; labels Quicksand 700, 0.85rem, letter-spacing 0.04em.
- Anti-spam : honeypot + temps minimal (2s) + limite de débit par IP.

### 7.5 Cookies & statistiques
- **Bandeau de consentement sur mesure** aux couleurs du site (pas d’outil tiers lourd) :
  - Encart **en bas à gauche**, 440px max, fond `creme`, **filet `garance` de 4px en haut**, angles droits, légère ombre.
  - Titre « Cookies & confidentialité » (Eagle Lake, ~1.55rem).
  - Texte : « Nous utilisons des cookies de mesure d’audience pour comprendre comment le site est utilisé. Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment. »
  - Boutons **« Accepter »** (plein garance) et **« Refuser »** (contour garance, se remplit au survol) **de même taille** ; **« Personnaliser »** en lien souligné → interrupteurs par catégorie (Fonctionnel : toujours actif ; Statistiques : désactivé par défaut), bouton « Enregistrer mes choix ».
  - Choix mémorisé **365 jours** comme la V1 (13 mois max), puis redemandé.
- **Google Analytics 4** chargé **uniquement après acceptation** de « Statistiques » (aucune requête Google avant). Cookie `_ga` limité à 13 mois. ID GA dans les variables d’environnement.
- Lien **« Gérer mes cookies »** dans le pied de page qui rouvre le bandeau.
- Si aucun traceur n’est actif, ne pas afficher le bandeau.

---

## 8. Modèle de contenu Sanity

```
siteSettings (singleton)
  title, description, contactEmail, contactRecipient,
  social { instagram, facebook, linkedin }, gaMeasurementId?,
  footerText, legal { siegeAddress, rna, publicationDirector, phone }

event
  title (string, requis)
  slug
  startDate (date, requis), endDate (date), hours (string, ex. "10h – 18h")
  place (string), placeUrl (url), placeUrlLabel (string)
  type ("atelier" | "festival" | "conference" | "autre")
  excerpt (text, 2–3 phrases → accueil)
  body (portable text → modale)
  image (image + alt obligatoire, ratio d’affichage 4/5)

partner
  name, logo (image + alt), description (text), url, order (number)

review
  name (requis), email (requis, privé), title, rating (1–5), text,
  status ("pending" | "approved" | "rejected"), createdAt, ip (privé)

workshop (5 documents, ordonnés)
  title, anchor, kicker, subtitle, body, image, tileColor

teamMember
  name, role, bio, photo, link, order

faqItem
  question, answer (portable text), order

page (singletons : home, ateliers, calendrier, partenaires, livreDor, aPropos, contact, mentionsLegales, politiqueConfidentialite)
  seo { title, description, focusKeyword, noindex }
  sections (blocs typés selon la page)
```

- Tous les champs image exigent un **texte alternatif**.
- Studio en français, aperçu des pages si possible.
- Documents privés (`review.email`, `review.ip`) jamais exposés côté client : requêtes publiques filtrées sur les champs publics.

**Implémentation (09/11/2026)** :

- Configuration du Studio : `sanity.config.ts` ; schémas : `src/sanity/schemaTypes/` ; navigation en français : `src/sanity/structure.ts` ; route Next.js : `src/app/studio/[[...tool]]/page.tsx`.
- Interface de travail traduite en français avec le plugin `@sanity/locale-fr-fr`.
- Les pages et les réglages sont des **singletons** : un seul document par type, avec un identifiant fixe égal au nom du type (`siteSettings`, `homePage`…). Le menu « Créer » ne les propose pas et les actions « Supprimer » / « Dupliquer » sont masquées.
- Les listes ordonnées (tuiles d’ateliers de l’accueil, ateliers, partenaires, équipe, questions) utilisent des **références Sanity** : l’ordre se règle en faisant glisser les éléments dans le Studio.
- Modération des avis : Studio → **Avis → À modérer** (statut `pending`), puis passage en `approved` ou `rejected`.
- Les formulaires publics n’écrivent pas encore dans Sanity : il faudra une route API avec un token d’écriture **côté serveur uniquement**.
- Le Studio embarqué est `noindex` via les métadonnées de `next-sanity/studio`.

---

## 9. RGPD & mentions légales

- **Mentions légales** : propriétaire et éditeur Néotisse (association loi 1901) ; directrice de la publication Marie Salomé ; conception et réalisation bLaNk (Louis Nourry, EI, lien `https://blank-stud.netlify.app/`) ; hébergeur à mettre à jour selon la V2 (Vercel/Netlify : société américaine, à mentionner) ; propriété intellectuelle ; liens externes ; droit français. Les infos manquantes (siège, RNA, téléphone, SIRET bLaNk) viennent de `siteSettings.legal`.
- **Politique de confidentialité** (9 sections avec sommaire) : responsable ; données collectées (contact : 3 ans après le dernier échange ; livre d’or : jusqu’à demande de suppression ; statistiques : consentement, 14 mois ; journaux techniques : 12 mois) ; cookies ; réseaux sociaux (simples liens, rien chargé avant clic) ; destinataires ; transferts hors UE (Google via Data Privacy Framework, hébergeur si US) ; sécurité ; droits (accès, rectification, effacement, limitation, opposition, portabilité, retrait du consentement, directives post-mortem, réclamation CNIL) ; date de mise à jour.
- **Mention sous chaque formulaire** (0.85rem, `gris`, lien `garance`) :
  - Contact : « Les informations recueillies servent uniquement à répondre à votre demande. Elles sont lues par les membres du bureau de Néotisse et conservées 3 ans après notre dernier échange. Vous pouvez y accéder ou demander leur suppression à asso.neotisse@gmail.com. En savoir plus sur vos données »
  - Livre d’or : « Seuls votre nom, le titre, la note et le texte de votre avis sont publiés, après relecture par l’association. Votre adresse e-mail et votre adresse IP restent confidentielles. Vous pouvez demander la suppression de votre avis à tout moment à asso.neotisse@gmail.com. En savoir plus sur vos données »
- Pas de case de consentement obligatoire sur le formulaire de contact (base légale : intérêt légitime).
- Aucune ressource tierce chargée sans consentement (pas de Google Fonts, pas d’embed YouTube/Maps sans bandeau).

---

## 10. Accessibilité & qualité

- Contrastes AA (ex. texte `gris` uniquement sur fond clair).
- Navigation clavier complète, focus visible (`outline: 3px solid garance`, offset 3px, comme la V1).
- Un seul H1 par page ; hiérarchie de titres respectée (les « titres à filets » de surtitre de section sont des `<p>` stylés quand un H2 suit).
- Liens explicites ; les « En savoir plus → » répétés sont `aria-hidden` si la carte entière a déjà un nom accessible.
- Images avec `alt` ; images décoratives `alt=""`.
- `prefers-reduced-motion` respecté partout.
- Performance : images Sanity optimisées (`next/image`, formats modernes), polices préchargées, LCP < 2.5s.

---

## 11. SEO

| Page | Mot-clé principal | Title |
|---|---|---|
| Accueil | médiation textile | Médiation textile : 5 ateliers uniques \| Néotisse |
| Ateliers | tissage | Tissage et teinture : 5 ateliers passionnants \| Néotisse |
| Calendrier | calendrier des ateliers | Calendrier des ateliers et festivals 2027 \| Néotisse |
| Partenaires | partenaires | Partenaires : 7 musées et lieux qui nous accueillent |
| Livre d’or | livre d’or | Livre d’or : avis sur nos ateliers textiles \| Néotisse |
| Contact | organiser un atelier | Organiser un atelier : 10 réponses essentielles \| Néotisse |
| À propos | savoir-faire textiles anciens | Savoir-faire textiles anciens : 3 engagements uniques |

- Stratégie : mots-clés **de niche peu concurrencés** (site neuf). Ubersuggest (06/11/2026, France) : « médiation textile » difficulté 17 (volume non mesurable) ; « tissage » difficulté 31 ; « savoir-faire textiles anciens » non mesurable.
- Meta description par page (dans Sanity), Open Graph, `sitemap.xml`, `robots.txt`, canonical.
- JSON-LD : `Organization` (Néotisse), `Event` pour chaque événement, `FAQPage` (Contact), `Review`/`AggregateRating` si pertinent.
- Pages légales et `/studio` en `noindex`.

---

## 12. Ce qu’il ne faut pas faire

- Pas de `border-radius` (seule exception : la navbar flottante et son bouton « Contact », voir § 5.1), pas d’ombres portées décoratives sur les tuiles (retirées volontairement).
- Pas de Google Fonts distantes, pas de reCAPTCHA, pas de script tiers avant consentement.
- Ne pas changer les URL existantes.
- Ne pas exposer de token Sanity d’écriture côté client.
- Ne pas mettre de contenu éditable en dur dans le code.
- Ne pas mettre d’identifiants ou de mots de passe dans le dépôt (utiliser `.env.local`, ignoré par git).

---

## 13. Référence V1

- WordPress 7.1 (thème Twenty Twenty-Five personnalisé + extension sur mesure « Néotisse, fonctions du site »), en local sur `http://neotisse.local`, mise en ligne prévue sur OVH. Accès en lecture via le MCP Novamira (voir § 0).
- Extensions actives : Complianz (cookies), Rank Math (SEO), WP Customer Reviews (livre d’or), WPForms Lite, WP 2FA, UpdraftPlus, Simply Static. Types de contenu : `evenement`, `partenaire`, `neo_message`, `wpcr3_review`.
- La V1 est la **référence visuelle et fonctionnelle** : en cas de doute sur un comportement, reproduire la V1.
- Maquette Figma d’origine : https://www.figma.com/design/MLL8ytRLSshn523UZ4Kig3/Projet-N%C3%A9otisse?node-id=193-2
- Contenus à migrer depuis la V1 : textes des pages, 2 événements, 7 partenaires (logos), avis du livre d’or (hors avis de test), 10 questions de FAQ, 2 membres d’équipe.

---

## 14. Variables d’environnement

```
NEXT_PUBLIC_SANITY_PROJECT_ID=t4k96qs7
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-11-09
SANITY_API_WRITE_TOKEN=          # serveur uniquement (avis, messages)
SANITY_REVALIDATE_SECRET=
RESEND_API_KEY=                  # ou autre service d’e-mail
CONTACT_FROM_EMAIL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # chargé seulement après consentement
NEXT_PUBLIC_SITE_URL=https://neotisse.fr
```

`.env.local` contient les valeurs locales et n’est jamais commité. `.env.example` documente les variables attendues (commité).
