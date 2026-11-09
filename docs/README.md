# Néotisse 

Site vitrine de l’association Néotisse (médiation autour des savoir-faire textiles anciens), réalisé par bLaNk.

- Contexte, règles et décisions : [`docs/CLAUDE.md`](CLAUDE.md)
- Design : [`docs/DESIGN.md`](DESIGN.md) · aperçu sur `/styleguide`
- Avancement : [`docs/TODO.md`](TODO.md)

## Démarrer

Toutes les commandes se lancent depuis la racine du dépôt.

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000. Le Studio Sanity est sur http://localhost:3000/studio.

Au premier lancement, copier `.env.example` vers `.env.local` et renseigner les variables (le projet Sanity `t4k96qs7` et le dataset `production` sont déjà indiqués).

## Studio Sanity

- URL locale : http://localhost:3000/studio
- Connexion avec le compte Google utilisé pour créer le projet Sanity.
- Les pages et les réglages sont des documents uniques : les remplir puis cliquer sur **Publier**.
- L’interface de travail est en français (plugin `@sanity/locale-fr-fr`).
- Les avis se modèrent dans **Avis → À modérer** (passer le statut en `approved` puis publier).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run lint` | ESLint |
| `npx sanity schemas validate` | vérifie les schémas du Studio |
| `npx sanity documents validate` | vérifie les contenus du dataset |
| `npx sanity exec scripts/import-v1.ts --with-user-token` | importe les contenus de la V1 sans rien écraser (`DRY=1` devant pour simuler) |

Stack : Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, Sanity (Studio embarqué sur `/studio`). Hébergement prévu : Netlify.

Contenu : les pages lisent Sanity via `src/sanity/queries/` ; une publication dans le Studio met le site à jour en quelques secondes (`<SanityLive />`). Les champs encore vides affichent les textes de la V1 (`src/content/`).
