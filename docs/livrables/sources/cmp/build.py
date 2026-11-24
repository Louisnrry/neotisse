import base64, re
from pathlib import Path

HERE = Path(__file__).parent
LOGO = base64.b64encode((HERE.parent / "logo" / "blank.png").read_bytes()).decode()
TOTAL = 8
DOC = "Néotisse · Analyse comparative et recommandation"


def blocks(word, cls=""):
    out, on = [], True
    for ch in word:
        out.append(f'<span class="{"on" if on else "off"}">{ch}</span>')
        on = not on
    return f'<span class="blocks {cls}">{"".join(out)}</span>'


def page(num, section, body):
    return f'''
<section class="page">
  <header class="run"><span>{section}</span><span>{DOC}</span></header>
  {body}
  <footer class="foot"><img src="data:image/png;base64,{LOGO}" alt="bLaNk"><span>{num:02d} / {TOTAL:02d}</span></footer>
</section>'''


def h1(n, title):
    return f'<div class="h1"><span class="num">{n}</span><h1>{title}</h1></div>'


def dots(n, t=5):
    return f'<span class="dots">{"●" * n}<i>{"●" * (t - n)}</i></span>'


# critère, question, poids, note WP, note SM, texte WP, texte SM, verdict
C = [
    ("Adéquation au besoin", "Quelle solution répond le mieux aux objectifs de la cliente ?", 2, 4, 5,
     "Toutes les pages et fonctions demandées sont là : calendrier, livre d’or, partenaires, contact. L’objectif d’autonomie est atteint, mais au prix d’une interface que la cliente doit apprendre.",
     "Mêmes pages, mêmes fonctions. L’espace de gestion est taillé pour l’association : il répond aussi à l’objectif d’autonomie, sans effort d’apprentissage.",
     "Les deux répondent au besoin ; le site vibe codé sert mieux l’objectif d’autonomie."),
    ("Fonctionnalités et personnalisation", "Quelles différences en matière de fonctionnalités et de possibilités de personnalisation ?", 3, 3, 5,
     "Beaucoup d’extensions prêtes à l’emploi, mais on dépend du thème et de leurs choix : l’extension d’avis, par exemple, impose son propre style, qu’il a fallu reproduire tel quel.",
     "Aucune limite : intro où « Néotisse » s’écrit à la plume, ateliers qui défilent un par un, calendrier avec sélecteur de mois, cartes d’avis dessinées pour le site. Chaque fonction doit en revanche être développée.",
     "Le site vibe codé donne une identité sans compromis."),
    ("Expérience utilisateur", "Quelle solution offre l’expérience la plus adaptée aux utilisateurs ?", 3, 3, 5,
     "Une navigation claire et un site lisible, mais plus lourd à charger, avec moins de finesse dans les animations et sur mobile.",
     "Un site plus fluide : animations d’apparition, défilement doux, calendrier pensé pour le téléphone (liste À venir seule sur mobile). Toutes les animations se coupent si le visiteur le demande.",
     "Le site vibe codé rassure mieux Laurent et convient mieux à Sophie, sur son téléphone."),
    ("Coûts", "Quels coûts de création, d’hébergement et de maintenance ?", 2, 3, 4,
     "40 € par mois de licences (CMS et extensions), 8 € par mois d’hébergement, 9 € par an de nom de domaine : 585 € par an.",
     "20 € par mois d’outils IA, 8 € par mois d’hébergement, 9 € par an de nom de domaine : 345 € par an.",
     "Le site vibe codé coûte 240 € de moins par an."),
    ("Facilité de gestion", "La cliente pourra-t-elle administrer son site en autonomie ?", 4, 3, 5,
     "Oui, mais l’administration WordPress est chargée : de nombreux menus, des réglages d’extensions, des notifications de mises à jour qui n’ont rien à voir avec ses contenus.",
     "Oui, plus facilement : un Studio en français qui ne montre que ses contenus. Ajouter un événement revient à remplir une fiche, valider un avis à cliquer sur « Approuver ».",
     "Le critère n° 1 pour une cliente peu à l’aise avec la technique."),
    ("Maintenance et évolutivité", "Quelle solution sera la plus simple à maintenir et à faire évoluer ?", 1, 4, 3,
     "Très répandu : n’importe quel prestataire WordPress peut reprendre le site. En contrepartie, WordPress et ses 7 extensions doivent être mis à jour régulièrement.",
     "Rien à mettre à jour pour la cliente. Toute évolution du site demande en revanche un prestataire développeur, capable de reprendre le code.",
     "Seul critère où WordPress l’emporte."),
    ("Performance et sécurité", "Quelles garanties, contraintes ou risques pour chaque solution ?", 1, 3, 4,
     "WordPress est le CMS le plus visé par les attaques, et chaque extension est une porte d’entrée possible. Double authentification (WP 2FA) et sauvegardes (UpdraftPlus) sont en place, à condition de suivre les mises à jour.",
     "Pas d’administration exposée sur le site, pas d’extension à surveiller. L’e-mail et l’IP des avis sont rangés à part et jamais publics. Risque : l’offre gratuite de Sanity, à faire évoluer si l’usage grandit.",
     "Moins de surface d’attaque pour le site vibe codé."),
    ("Délais de réalisation", "Quelle approche permet de répondre au besoin dans les délais impartis ?", 1, 5, 5,
     "Environ une semaine de développement, du 3 au 9 novembre.",
     "Environ une semaine aussi, du 9 au 15 novembre, en prenant le site WordPress comme source d’inspiration pour les contenus et le rendu.",
     "Égalité : les deux versions ont tenu les délais."),
]

wsum = sum(c[2] for c in C)
wp_w = sum(c[2] * c[3] for c in C)
sm_w = sum(c[2] * c[4] for c in C)
wp_avg = sum(c[3] for c in C) / len(C)
sm_avg = sum(c[4] for c in C) / len(C)
fr = lambda x: f"{x:.1f}".replace(".", ",")

P = []

P.append(f'''
<section class="page cover">
  <div class="cover-top">
    <p class="kicker">Analyse comparative et recommandation</p>
    <p class="kicker light">Novembre 2026</p>
  </div>
  <div class="cover-mid">
    {blocks("Néotisse", "xl")}
    <p class="cover-title">WordPress ou vibe codé :<br>quelle solution pour l’association ?</p>
    <p class="cover-sub">Huit critères, une note sur 5 pour chaque solution,<br>une recommandation classée selon les priorités de la cliente.</p>
  </div>
  <div class="cover-bot">
    <div><p class="label">Cliente</p><p>Association Néotisse<br>Marie-Salomé Perrichon et Émilie Roma Sert</p></div>
    <div><p class="label">Agence</p><p>bLaNk · Louis Nourry</p></div>
    <img src="data:image/png;base64,{LOGO}" alt="bLaNk">
  </div>
</section>''')

prio = [
    ("1", "Autonomie et simplicité", "Facilité de gestion", "× 4"),
    ("2", "Image moderne et professionnelle", "Fonctionnalités et personnalisation, expérience utilisateur", "× 3"),
    ("3", "Coûts", "Coûts, et l’adéquation au besoin, socle de tout le reste", "× 2"),
    ("4", "Entretien et sécurité", "Maintenance et évolutivité, performance et sécurité, délais", "× 1"),
]
prio_rows = "".join(f"<tr><td><span class='rk'>{a}</span>{b}</td><td>{c}</td><td class='c'><b>{d}</b></td></tr>" for a, b, c, d in prio)
P.append(page(2, "01 · Méthode", f'''
{h1("01", "Méthode")}
<p class="lead">Les deux versions du site partagent les mêmes pages, les mêmes contenus et la même identité. La comparaison porte donc sur ce qui les distingue : la technique, l’espace de gestion, les coûts et les risques.</p>
<div class="cols">
  <div><p class="label">La notation</p><p>Chaque solution reçoit une note de 1 à 5 sur les huit critères de la consigne. Les notes s’appuient sur les deux sites réalisés, pas sur des généralités.</p></div>
  <div><p class="label">La pondération</p><p>Toutes les notes ne pèsent pas autant : chaque critère reçoit un coefficient selon les priorités de la cliente, établies au kickoff et dans le cahier des charges.</p></div>
</div>
<h2>Les priorités de la cliente</h2>
<table class="grid prio">
  <tr><th>Priorité</th><th>Critères concernés</th><th class="c">Coefficient</th></tr>
  {prio_rows}
</table>
<h2>Le résultat en bref</h2>
<div class="score">
  <div><p class="label">WordPress</p><p class="big-n">{fr(wp_w / wsum)}<span>/5</span></p><p class="muted small">moyenne pondérée · {fr(wp_avg)}/5 sans pondération</p></div>
  <div class="inv"><p class="label inv">Vibe codé</p><p class="big-n">{fr(sm_w / wsum)}<span>/5</span></p><p class="small">moyenne pondérée · {fr(sm_avg)}/5 sans pondération</p></div>
</div>
'''))


def crit_block(i, c):
    name, q, w, a, b, ta, tb, v = c
    return f'''
<div class="cb">
  <div class="cb-head"><span class="cn">{i:02d}</span><div><h3>{name}</h3><p class="q">{q}</p></div><span class="coef">coef. {w}</span></div>
  <div class="cb-body">
    <div><p class="who">WordPress <span>{dots(a)} {a}/5</span></p><p>{ta}</p></div>
    <div><p class="who">Vibe codé <span>{dots(b)} {b}/5</span></p><p>{tb}</p></div>
  </div>
  <p class="verdict">{v}</p>
</div>'''


P.append(page(3, "02 · Analyse par critère", h1("02", "Analyse par critère") + "".join(crit_block(i + 1, C[i]) for i in range(0, 3))))
P.append(page(4, "02 · Analyse par critère", "".join(crit_block(i + 1, C[i]) for i in range(3, 6))))
P.append(page(5, "02 · Analyse par critère", "".join(crit_block(i + 1, C[i]) for i in range(6, 8)) + f'''
<h2>Le détail des coûts</h2>
<table class="grid costs">
  <tr><th>Poste</th><th class="c">WordPress</th><th class="c dark">Vibe codé</th></tr>
  <tr><td>Création et maintenance par l’agence</td><td class="c">0 €</td><td class="c">0 €</td></tr>
  <tr><td>Licence : CMS et extensions / outils IA</td><td class="c">40 € / mois</td><td class="c">20 € / mois</td></tr>
  <tr><td>Hébergement</td><td class="c">8 € / mois</td><td class="c">8 € / mois</td></tr>
  <tr><td>Nom de domaine en .fr</td><td class="c">9 € / an</td><td class="c">9 € / an</td></tr>
  <tr class="total"><td>Total sur un an</td><td class="c">585 €</td><td class="c">345 €</td></tr>
</table>
<p class="small muted">Création et maintenance à 0 € : projet réalisé dans un cadre pédagogique. L’hébergeur définitif sera choisi à la mise en ligne.</p>
'''))

rows = "".join(
    f"<tr><td>{n}</td><td class='c'>{w}</td><td class='c'>{dots(a)}<b>{a}</b></td><td class='c'>{dots(b)}<b>{b}</b></td><td class='c'>{w * a}</td><td class='c'>{w * b}</td></tr>"
    for n, q, w, a, b, *_ in C)
P.append(page(6, "03 · Tableau comparatif", f'''
{h1("03", "Tableau comparatif")}
<p>Notes sur 5, puis notes multipliées par le coefficient de chaque critère.</p>
<table class="grid synth">
  <tr><th>Critère</th><th class="c">Coef.</th><th class="c">WordPress</th><th class="c dark">Vibe codé</th><th class="c">WP pondéré</th><th class="c">SM pondéré</th></tr>
  {rows}
  <tr class="total"><td>Total</td><td class="c">{wsum}</td><td class="c">{sum(c[3] for c in C)} / 40</td><td class="c">{sum(c[4] for c in C)} / 40</td><td class="c">{wp_w} / {wsum * 5}</td><td class="c">{sm_w} / {wsum * 5}</td></tr>
  <tr class="avg"><td>Moyenne pondérée</td><td></td><td></td><td></td><td class="c">{fr(wp_w / wsum)} / 5</td><td class="c">{fr(sm_w / wsum)} / 5</td></tr>
</table>
<div class="split">
  <div><p class="label">Ce qu’il faut retenir</p><p>Le site vibe codé l’emporte sur six critères, dont les trois qui comptent le plus pour la cliente. Les deux sont à égalité sur les délais.</p></div>
  <div><p class="label">Le point fort de WordPress</p><p>La maintenance : un outil très répandu, que de nombreux prestataires savent reprendre. C’est le seul critère où il passe devant.</p></div>
</div>
'''))

P.append(page(7, "04 · Recommandation", f'''
<div class="reco">
  <p class="label inv">Notre recommandation</p>
  <p class="reco-t">La version vibe codée</p>
  <p>{fr(sm_w / wsum)}/5 contre {fr(wp_w / wsum)}/5 une fois les critères pondérés. Elle répond le mieux aux deux priorités de Néotisse : faire vivre son site seule, et donner une image moderne et professionnelle à ses partenaires.</p>
</div>
<h2>Nos raisons, par ordre de priorité</h2>
<ol class="reasons">
  <li><span>1</span><div><b>La simplicité de l’espace de gestion</b><p>Un Studio en français, limité aux contenus de l’association. Les clientes, peu à l’aise avec la technique, ajoutent un événement ou valident un avis sans formation.</p></div></li>
  <li><span>2</span><div><b>La modernité du site</b><p>Un site fluide, animé avec soin et entièrement à l’image de Néotisse : de quoi rassurer un directeur de musée dès la première visite.</p></div></li>
  <li><span>3</span><div><b>Des coûts plus faibles</b><p>345 € par an contre 585 €, soit 240 € d’économie chaque année pour une association.</p></div></li>
  <li><span>4</span><div><b>Moins d’entretien et de risques</b><p>Aucune extension à mettre à jour, donc moins de failles possibles et rien à surveiller pour les clientes.</p></div></li>
</ol>
'''))

P.append(page(8, "04 · Recommandation", f'''
<h2>Limites et risques, et comment les traiter</h2>
<table class="grid">
  <tr><th>Risque</th><th>Réponse</th></tr>
  <tr><td>Les évolutions du site demandent un prestataire développeur</td><td>Un code documenté et versionné, écrit avec des outils très répandus (Next.js, React) : n’importe quel développeur peut le reprendre, pas seulement l’agence d’origine</td></tr>
  <tr><td>L’offre gratuite de Sanity a des limites</td><td>Largement suffisante pour le volume de Néotisse ; passage à une offre payante seulement si l’usage grandit</td></tr>
  <tr><td>Le formulaire de contact n’envoie pas encore d’e-mails</td><td>Branchement à un service d’envoi avant la mise en ligne, testé sur ordinateur et téléphone</td></tr>
  <tr><td>Le choix de l’hébergeur</td><td>Le site n’est lié à aucun hébergeur : il pourra être installé chez celui retenu à la mise en ligne</td></tr>
</table>
<h2>Quand WordPress serait le meilleur choix</h2>
<p>Si l’association voulait changer souvent de prestataire, ou ajouter elle-même de nombreuses fonctions à l’aide d’extensions, WordPress reprendrait l’avantage grâce à son écosystème. Ce n’est pas le cas de Néotisse aujourd’hui : son besoin est stable, et sa priorité est la simplicité.</p>
<div class="band"><p>Un site que Néotisse fait vivre seule,<br>à l’image de ses savoir-faire.</p></div>
'''))

CSS = (HERE.parent / "dossier" / "style.css").read_text() + (HERE / "extra.css").read_text()
html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Néotisse · Analyse comparative</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{"".join(P)}</body></html>'''


def nbsp(text):
    parts = re.split(r"(<[^>]+>)", text)
    for i, p in enumerate(parts):
        if not p.startswith("<"):
            p = re.sub(r" ([:;?!»])", "\u00a0\\1", p)
            p = p.replace("« ", "«\u00a0")
            p = re.sub(r"(\d) (€|%|h\b|px)", "\\1\u00a0\\2", p)
            parts[i] = p
    return "".join(parts)


(HERE / "cmp.html").write_text(nbsp(html))
print("html ok", wp_w, sm_w, wsum)
