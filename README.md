# Néotisse V2

Site vitrine de l’association Néotisse (médiation autour des savoir-faire textiles anciens), réalisé par bLaNk.

- Contexte, règles et décisions : [`CLAUDE.md`](CLAUDE.md)
- Design : [`docs/DESIGN.md`](docs/DESIGN.md) · aperçu sur `/styleguide`
- Avancement : [`docs/TODO.md`](docs/TODO.md)

## Démarrer

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production |
| `npm run lint` | ESLint |

Stack : Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4. Hébergement prévu : Netlify. CMS prévu : Sanity.
