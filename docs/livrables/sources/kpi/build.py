import base64, json, re
from pathlib import Path

HERE = Path(__file__).parent
LOGO = base64.b64encode((HERE.parent / "logo" / "blank.png").read_bytes()).decode()
TOTAL = 10
DOC = "Néotisse · Tableau de bord · Version WordPress"


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


fr = lambda x, d=1: f"{x:.{d}f}".replace(".", ",")

# ---------- Objectifs ----------
# (n, titre, pourquoi, KPI, métrique, référence, seuil bas, action bas, seuil haut, action haut, outil)
O = [
    ("1", "Obtenir plus de demandes d’atelier",
     "Les clientes veulent animer 3 ateliers par mois. Toutes les demandes n’aboutissent pas : il en faut davantage qu’il n’y a d’ateliers.",
     "Demandes d’atelier reçues par mois",
     "Envois réussis du formulaire de contact WPForms (<code>generate_lead</code>). L’objet et le message restent dans l’e-mail : aucune donnée saisie n’est envoyée à Google.",
     "6 demandes par mois, si une demande sur deux devient un atelier (hypothèse à vérifier après trois mois).",
     "Moins de 3 par mois",
     "Tester le formulaire, ajouter un bouton « Organiser un atelier » sur la page Ateliers, relancer par e-mail les musées et festivals déjà partenaires.",
     "Plus de 9 par mois",
     "Repérer la source qui a marché (Google, réseau, lien d’un partenaire) et la renforcer ; prévoir les disponibilités de Marie-Salomé et Émilie.",
     "GA4 (événement clé), lu dans Site Kit · chaque mois. Recoupé avec les e-mails reçus."),
    ("2", "Remplir les événements",
     "Le grand public doit savoir quand et où trouver Néotisse. L’inscription ou la billetterie se fait chez le lieu d’accueil : on mesure donc le clic qui y mène.",
     "Part des fiches d’événement ouvertes qui mènent au site du lieu",
     "Ouvertures d’une fiche dans le calendrier (<code>view_event</code>) et clics sur « Site du musée » (<code>click_lieu</code>), avec le nom de l’événement en paramètre.",
     "20 % des fiches ouvertes, à remplacer par la moyenne des trois premiers événements.",
     "Moins de 10 % ou moins de 20 fiches ouvertes à J-7",
     "Mettre l’événement en avant sur l’accueil (bloc « Prochain événement »), le relayer sur Instagram et Facebook avec un lien UTM, demander au lieu de le partager.",
     "Plus de 40 %",
     "Reproduire le format de la fiche (photo, horaires, texte court) et prévenir le lieu d’une forte affluence.",
     "GA4, lu dans Site Kit · chaque semaine avant un événement."),
    ("3", "Rassurer avec le livre d’or",
     "Les avis d’anciens participants rassurent les musées comme les familles. Un livre d’or vide ou ancien a l’effet inverse.",
     "Avis publiés par mois, et note moyenne",
     "Envois du formulaire du livre d’or (<code>submit_avis</code>, avec la note), puis avis approuvés dans WP Customer Reviews.",
     "2 avis par mois, soit environ un avis pour un atelier sur deux.",
     "Aucun avis en deux mois, ou une note moyenne sous 4/5",
     "Demander un avis à la fin de chaque atelier avec un QR code vers le livre d’or ; lire les remarques et ajuster l’atelier.",
     "Plus de 4 par mois",
     "Mettre deux ou trois avis en avant sur la page Ateliers, celle que lisent les partenaires.",
     "GA4 et administration WordPress · chaque mois."),
    ("4", "Être trouvée sur Google",
     "Sans budget publicitaire, Google est la porte d’entrée des partenaires qui ne connaissent pas encore Néotisse.",
     "Clics depuis Google sur les pages Accueil, Ateliers et À propos",
     "Clics, impressions et position moyenne sur « atelier tissage », « médiation textile » et le nom « Néotisse ».",
     "Le premier mois complet après la mise en ligne.",
     "−20 % sur un mois",
     "Vérifier l’indexation dans Search Console, la vitesse des pages et les contenus des sites concurrents.",
     "+20 % sur un mois",
     "Identifier la page qui progresse et enrichir les autres sur le même modèle (ateliers détaillés, photos, mots du métier).",
     "Search Console, lue dans Site Kit · chaque mois, comparé à la même période de l’année précédente."),
]

# ---------- Lighthouse ----------
LH = {}
lh_file = HERE / "lh.json"
if lh_file.exists():
    LH = json.loads(lh_file.read_text())

P = []

# 1. Couverture
P.append(f'''
<section class="page cover">
  <div class="cover-top">
    <p class="kicker">Tableau de bord de suivi des performances</p>
    <p class="kicker light">Novembre 2026</p>
  </div>
  <div class="cover-mid">
    {blocks("Néotisse", "xl")}
    <p class="cover-title">Mesurer pour piloter :<br>le tableau de bord du site WordPress</p>
    <p class="cover-sub">Objectifs, indicateurs et seuils d’alerte, plan de taggage,<br>audit de performance et projection du trafic Google.</p>
  </div>
  <div class="cover-bot">
    <div><p class="label">Cliente</p><p>Association Néotisse<br>Marie-Salomé Perrichon et Émilie Roma Sert</p></div>
    <div><p class="label">Agence</p><p>bLaNk · Louis Nourry</p></div>
    <img src="data:image/png;base64,{LOGO}" alt="bLaNk">
  </div>
</section>''')

# 2. Méthode et objectifs
obj_rows = "".join(f'<li><span>{o[0]}</span><div><b>{o[1]}</b><p>{o[2]}</p></div></li>' for o in O)
P.append(page(2, "01 · Méthode", f'''
<div class="toc"><p class="label">Sommaire</p><ol>
  <li><span>01</span>Méthode et objectifs</li><li><span>04</span>Présentation du tableau de bord</li>
  <li><span>02</span>Tableau de pilotage</li><li><span>05</span>Audit de performance</li>
  <li><span>03</span>Plan de taggage</li><li><span>06</span>Projection SEO et recommandations</li>
</ol></div>
{h1("01", "Méthode et objectifs")}
<p class="lead">On ne part pas de l’outil mais de ce que Néotisse veut obtenir grâce au site. Chaque objectif reçoit un seul indicateur clé, calculé à partir d’une donnée que l’outil collecte, et deux seuils qui déclenchent une action.</p>
<ol class="chain"><li><b>Objectif</b><span>ce que l’association veut obtenir</span></li><li><b>KPI</b><span>le chiffre qui dit si ça avance</span></li><li><b>Métrique</b><span>la donnée collectée</span></li><li><b>Seuils</b><span>quand s’inquiéter, quand se réjouir</span></li><li><b>Outil</b><span>où lire, à quel rythme</span></li></ol>
<h2>Les quatre objectifs de Néotisse</h2>
<ol class="reasons">{obj_rows}</ol>
'''))

# 3. Tableau de pilotage (synthèse)
syn = "".join(f"<tr><td>{o[1]}</td><td>{o[3]}</td><td class='neg'>{o[6]}</td><td class='pos'>{o[8]}</td><td>{o[10].split(' · ')[0]}<br><i>{o[10].split(' · ')[1].split('.')[0]}</i></td></tr>" for o in O)
P.append(page(3, "02 · Tableau de pilotage", f'''
{h1("02", "Tableau de pilotage")}
<p>Le tableau tient sur une page : c’est celui que les clientes relisent chaque mois. Le détail de chaque ligne, avec la valeur de référence et l’action prévue à chaque seuil, suit dans les pages suivantes.</p>
<table class="grid pilot">
  <tr><th>Objectif</th><th>KPI</th><th class="dark">Seuil bas</th><th class="dark">Seuil haut</th><th>Outil · rythme</th></tr>
  {syn}
</table>
<div class="split vanity">
  <div><p class="label inv">Ce qu’on ne suit pas comme KPI</p><p>Les pages vues totales, le nombre d’abonnés Instagram, le temps passé sans contexte. Flatteurs, mais si ces chiffres doublent, l’association n’y gagne rien de concret.</p></div>
  <div><p class="label">Le test appliqué à chaque KPI</p><p>Si ce chiffre double, Néotisse anime-t-elle plus d’ateliers, ou ses événements sont-ils plus fréquentés ? Les quatre indicateurs retenus passent ce test.</p></div>
</div>
<p class="small muted">Seuils indicatifs : la valeur de référence est remplacée par la moyenne des trois premiers mois de données, puis les seuils sont ajustés.</p>
'''))


def detail(o):
    return f'''
<div class="ob">
  <div class="ob-head"><span class="cn">{o[0]}</span><h3>{o[1]}</h3></div>
  <div class="ob-body">
    <div>
      <p class="label">KPI</p><p>{o[3]}</p>
      <p class="label">Métrique</p><p>{o[4]}</p>
      <p class="label">Référence</p><p>{o[5]}</p>
      <p class="label">Outil et rythme</p><p>{o[10]}</p>
    </div>
    <div class="th">
      <div class="th-neg"><p class="label">Seuil bas · {o[6]}</p><p>{o[7]}</p></div>
      <div class="th-pos"><p class="label inv">Seuil haut · {o[8]}</p><p>{o[9]}</p></div>
    </div>
  </div>
</div>'''


P.append(page(4, "02 · Tableau de pilotage", detail(O[0]) + detail(O[1])))
P.append(page(5, "02 · Tableau de pilotage", detail(O[2]) + detail(O[3]) + '''
<h2>Ce qu’on regarde aussi, sans en faire un KPI</h2>
<table class="grid compact">
  <tr><th>Donnée</th><th>Pourquoi</th><th>Où dans GA4</th></tr>
  <tr><td>Sources de trafic</td><td>Savoir d’où viennent les visiteurs qui envoient une demande</td><td>Acquisition › Acquisition de trafic</td></tr>
  <tr><td>Pages d’entrée</td><td>Voir par où arrivent les partenaires et s’ils atteignent la page Contact</td><td>Engagement › Pages de destination</td></tr>
  <tr><td>Appareils</td><td>Repérer ce qui bloque sur téléphone</td><td>Technologie › Vue d’ensemble</td></tr>
</table>'''))

# 6. Plan de taggage
tags = [
    ("generate_lead", "Le formulaire de contact est envoyé avec succès", "form_name", "Oui", "1"),
    ("click_lieu", "Clic sur le lien vers le lieu d’un événement", "event_name, link_url", "Oui", "2"),
    ("submit_avis", "Le formulaire du livre d’or est envoyé", "rating", "Oui", "3"),
    ("view_event", "Une fiche est ouverte dans le calendrier", "event_name, event_type", "Non", "2"),
    ("click_contact", "Clic sur l’e-mail, Instagram ou Facebook", "contact_type", "Non", "1"),
]
tag_rows = "".join(f"<tr><td><code>{a}</code></td><td>{b}</td><td><code>{c}</code></td><td class='c'>{e}</td><td class='c'><b>{d}</b></td></tr>" for a, b, c, d, e in tags)
P.append(page(6, "03 · Plan de taggage", f'''
{h1("03", "Plan de taggage")}
<p>Dans Google Analytics 4, chaque action du visiteur est un événement. Les pages vues, le défilement et les clics sortants sont collectés d’office. Les cinq événements ci-dessous sont propres au site de Néotisse : c’est le document remis au développeur pour les configurer.</p>
<table class="grid tags">
  <tr><th>Événement</th><th>Se déclenche quand…</th><th>Paramètre</th><th class="c">Objectif</th><th class="c dark">Clé ?</th></tr>
  {tag_rows}
</table>
<div class="cols">
  <div><p class="label">Trois événements clés</p><p>Un par objectif mesuré sur le site, en restant entre 3 et 5 événements clés. Le quatrième objectif se lit dans Search Console, avant le clic.</p></div>
  <div><p class="label">Les règles de nommage</p><p>Minuscules et tirets bas, logique action_objet, ni accent ni espace. Les noms recommandés par Google sont repris quand ils existent (<code>generate_lead</code>).</p></div>
</div>
<h2>Mise en place sur le WordPress</h2>
<table class="grid compact">
  <tr><th>Étape</th><th>Comment</th></tr>
  <tr><td>Balise GA4</td><td>Installée par Site Kit, sans code, et chargée seulement après accord dans le bandeau Complianz</td></tr>
  <tr><td>Formulaire WPForms et livre d’or</td><td>Déclencheurs Google Tag Manager sur l’affichage du message de confirmation</td></tr>
  <tr><td>Fiches du calendrier</td><td>Une ligne <code>dataLayer.push</code> ajoutée dans l’extension <code>neotisse-core</code>, à l’ouverture d’une fiche</td></tr>
  <tr><td>Clics sur les liens</td><td>Déclencheurs de clic dans Google Tag Manager, branché par Site Kit</td></tr>
</table>
<h2>Les liens UTM</h2>
<p class="small">Pour les e-mails aux musées, la bio Instagram et les liens confiés aux lieux partenaires, qui arrivent sinon en « Direct » :</p>
<pre>neotisse.fr/ateliers-tissage-teinture/?utm_source=prospection&amp;utm_medium=email&amp;utm_campaign=musees_2027</pre>
'''))

# 7. Présentation du tableau de bord
months = [("Janv.", 2), ("Févr.", 3), ("Mars", 4), ("Avr.", 4), ("Mai", 6), ("Juin", 5)]
bars = "".join(f'<div class="bar"><span style="height:{v * 9}mm"><b>{v}</b></span><i>{m}</i></div>' for m, v in months)
P.append(page(7, "04 · Présentation du tableau de bord", f'''
{h1("04", "Présentation du tableau de bord")}
<p>Les clientes ne vont pas dans Google Analytics. Site Kit affiche les chiffres utiles dans l’administration WordPress, là où elles ajoutent déjà leurs événements. La page ci-dessous montre la lecture mensuelle attendue.</p>
<div class="dash">
  <div class="dash-top"><p class="label inv">Tableau de bord · juin</p><p class="small">Exemple illustratif, chiffres fictifs</p></div>
  <div class="tiles">
    <div class="tile"><p class="label">Demandes d’atelier</p><p class="big-n">5<span>/ 6</span></p><p class="small">zone normale</p></div>
    <div class="tile"><p class="label">Fiches → lieu</p><p class="big-n">24<span>%</span></p><p class="small">objectif 20 %</p></div>
    <div class="tile"><p class="label">Avis du mois</p><p class="big-n">3<span>· 4,8/5</span></p><p class="small">12 avis au total</p></div>
    <div class="tile inv"><p class="label inv">Clics Google</p><p class="big-n">+18<span>%</span></p><p class="small">sous le seuil de +20 %</p></div>
  </div>
  <div class="chart"><p class="label">Demandes d’atelier par mois</p><div class="bars">{bars}<div class="goal-line"><span>objectif 6</span></div></div></div>
</div>
<h2>Les outils de mesure</h2>
<table class="grid compact">
  <tr><th>Outil</th><th>Ce qu’il mesure pour Néotisse</th><th>Coût</th></tr>
  <tr><td>Google Analytics 4</td><td>Visiteurs, sources de trafic, événements clés</td><td>Gratuit</td></tr>
  <tr><td>Search Console</td><td>Recherches Google qui mènent au site, clics et position</td><td>Gratuit</td></tr>
  <tr><td>Site Kit by Google</td><td>Réunit les deux dans l’administration WordPress</td><td>Gratuit</td></tr>
  <tr><td>Google Tag Manager</td><td>Événements personnalisés sans toucher au thème</td><td>Gratuit</td></tr>
  <tr><td>PageSpeed Insights</td><td>Vitesse et Core Web Vitals, mobile et ordinateur</td><td>Gratuit</td></tr>
</table>
'''))

# 8. Audit de performance
def score(v):
    return "—" if v is None else str(v)


if LH:
    m, d = LH["mobile"], LH["desktop"]
    cats = [("Performance", "performance"), ("Accessibilité", "accessibility"), ("Bonnes pratiques", "best-practices"), ("SEO", "seo")]
    srows = "".join(f"<tr><td>{n}</td><td class='c'><b>{m[k]}</b></td><td class='c'><b>{d[k]}</b></td></tr>" for n, k in cats)
    mets = [("LCP · plus grand élément affiché", "lcp"), ("CLS · décalage de mise en page", "cls"), ("TBT · temps de blocage", "tbt")]
    mrows = "".join(f"<tr><td>{n}</td><td class='c'>{m[k]}</td><td class='c'>{d[k]}</td></tr>" for n, k in mets)
    fixes = "".join(f'<li><span>{i + 1}</span><div><b>{t}</b><p>{x}</p></div></li>' for i, (t, x) in enumerate(LH["fixes"]))
    audit = f'''
<div class="cols">
<table class="grid compact">
  <tr><th>Score</th><th class="c">Mobile</th><th class="c dark">Ordinateur</th></tr>{srows}
</table>
<table class="grid compact">
  <tr><th>Métrique de laboratoire</th><th class="c">Mobile</th><th class="c dark">Ordinateur</th></tr>{mrows}
</table>
</div>
<p class="small muted">{LH["note"]}</p>
<h2>Ce que disent les scores</h2>
<p>{LH["constat"]}</p>
<h2>Deux corrections prioritaires</h2>
<ol class="reasons">{fixes}</ol>'''
else:
    audit = "<p><b>Mesure à faire.</b></p>"

P.append(page(8, "05 · Audit de performance", f'''
{h1("05", "Audit de performance")}
<p>Le site WordPress a été mesuré en local, où PageSpeed Insights ne peut pas l’analyser. Le même moteur, Lighthouse, a donc été lancé en local sur la page d’accueil, en simulation mobile puis ordinateur.</p>
{audit}
'''))

# 9. Projection SEO
VOL = 200
CONV = 1.7
sc = [("Prudent · 3 mois", 10, 0.2, 0.5), ("Réaliste · 6 mois", 5, 0.7, 2.5), ("Ambitieux · 12 mois", 3, 1.7, 5.8)]
prow = ""
for name, pos, lo, hi in sc:
    prow += f"<tr><td>{name}</td><td class='c'>{pos}</td><td class='c'>{fr(lo)} à {fr(hi)} %</td><td class='c'>{fr(VOL * lo / 100)} à {fr(VOL * hi / 100)}</td><td class='c'><b>{'moins de 0,1' if VOL * hi * CONV / 1e4 < .05 else 'au plus ' + fr(VOL * hi * CONV / 1e4)}</b></td></tr>"
P.append(page(9, "06 · Projection SEO", f'''
{h1("06", "Projection du trafic Google")}
<p class="lead">Trafic estimé = volume de recherche × taux de clic de la position. Demandes estimées = trafic estimé × taux de conversion.</p>
<h2>Les hypothèses et leurs sources</h2>
<table class="grid compact kw">
  <tr><th>Donnée</th><th>Valeur retenue</th><th>Source</th></tr>
  <tr><td>« atelier tissage »</td><td>110 recherches par mois</td><td>Ubersuggest, France, relevé le 24 novembre 2026</td></tr>
  <tr><td>« atelier de tissage »</td><td>90 recherches par mois</td><td>Ubersuggest, France, relevé le 24 novembre 2026</td></tr>
  <tr><td>Taux de clic</td><td>Une fourchette par position : avec les réponses IA de Google, puis sans</td><td>First Page Sage, rapport 2026 (septembre 2026, données américaines)</td></tr>
  <tr><td>Taux de conversion</td><td>1,7 % des visites</td><td>Ruler Analytics, valeur propre aux formulaires, citée par WPForms (2026) ; le taux tous canaux du même institut est de 5,13 %</td></tr>
</table>
<h2>Trois scénarios, sur 200 recherches par mois</h2>
<table class="grid compact">
  <tr><th>Scénario</th><th class="c">Position visée</th><th class="c">Taux de clic</th><th class="c">Visites / mois</th><th class="c dark">Demandes / mois</th></tr>
  {prow}
</table>
<div class="split">
  <div><p class="label inv">Comparé au seuil du KPI</p><p>Même dans le scénario ambitieux, ces recherches apportent bien moins d’une demande par mois, loin des 6 visées et sous le seuil bas de 3.</p></div>
  <div><p class="label">Ce qu’on en tire</p><p>La prospection auprès des musées et festivals doit rester la première source de demandes. Les liens UTM permettront de vérifier d’où elles viennent.</p></div>
</div>
<p class="small muted">« Médiation textile » et « savoir-faire textiles anciens » n’ont pas de volume mesurable (Ubersuggest, 6 novembre 2026). Les deux requêtes retenues sont proches et peuvent se recouper ; les recherches sur le nom « Néotisse » ne sont pas comptées.</p>
'''))

# 10. Consentement et recommandations
P.append(page(10, "06 · Recommandations de suivi", f'''
<h2>Consentement : ce qu’il change dans les chiffres</h2>
<p>En France, les cookies de Google Analytics demandent l’accord du visiteur. Le bandeau Complianz, déjà installé, sera réglé pour ne charger GA4 qu’après un clic sur « Accepter ». Le Consent Mode de Google, à configurer avec le bandeau, transmet ce choix aux outils Google. Les visiteurs qui refusent n’apparaissent donc pas dans les chiffres : les visites sont sous-estimées. C’est pourquoi les demandes sont aussi comptées dans la boîte e-mail de l’association, et les avis dans l’administration WordPress.</p>
<h2>Le rythme de suivi</h2>
<table class="grid compact">
  <tr><th>Quand</th><th>Qui</th><th>Quoi</th></tr>
  <tr><td>Chaque semaine avant un événement</td><td>Les clientes</td><td>Fiches ouvertes et clics vers le lieu ; relance si le seuil bas est atteint à J-7</td></tr>
  <tr><td>Chaque mois</td><td>Les clientes</td><td>Le tableau de pilotage dans Site Kit : demandes, avis, clics Google ; une action par seuil franchi</td></tr>
  <tr><td>Chaque trimestre</td><td>Les clientes et le prestataire</td><td>Ajuster les seuils sur les vraies moyennes, relancer Lighthouse, revoir les mots-clés</td></tr>
  <tr><td>Chaque année</td><td>Les clientes et le prestataire</td><td>Comparer à l’année précédente, choisir les objectifs de l’année suivante</td></tr>
</table>
<h2>Nos recommandations</h2>
<ol class="reasons">
  <li><span>1</span><div><b>Installer la mesure avant la mise en ligne</b><p>Site Kit, GA4, Search Console et les cinq événements, testés avec le mode DebugView de GA4 : un mois sans données est un mois sans référence.</p></div></li>
  <li><span>2</span><div><b>Compter les demandes à la source</b><p>Le nombre d’e-mails reçus par le formulaire reste la donnée la plus fiable ; GA4 dit d’où viennent les demandes.</p></div></li>
  <li><span>3</span><div><b>Ajuster les seuils après trois mois</b><p>Les valeurs de ce document sont des hypothèses : elles sont remplacées par les moyennes réelles.</p></div></li>
  <li><span>4</span><div><b>Tracer chaque lien partagé</b><p>Un lien UTM par campagne (prospection, Instagram, lieux partenaires) pour savoir ce qui amène vraiment des demandes.</p></div></li>
</ol>
'''))

CSS = (HERE.parent / "dossier" / "style.css").read_text() + (HERE / "extra.css").read_text()
html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Néotisse · Tableau de bord</title>
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


(HERE / "kpi.html").write_text(nbsp(html))
print("ok")
