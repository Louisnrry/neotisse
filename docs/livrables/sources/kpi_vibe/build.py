import base64, json, re
from pathlib import Path

HERE = Path(__file__).parent
LOGO = base64.b64encode((HERE.parent / "logo" / "blank.png").read_bytes()).decode()
TOTAL = 11
DOC = "Néotisse · Tableau de bord · Version vibe codée"
fr = lambda x, d=1: f"{x:.{d}f}".replace(".", ",")


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


# n, titre, pourquoi, KPI, métrique, référence, seuil bas, action, seuil haut, action, outil, rythme
O = [
    ("1", "Remplir les événements",
     "Priorité du site vibe codé : amener un public plus jeune aux ateliers et aux festivals. L’inscription se fait chez le lieu d’accueil, on mesure donc le clic qui y mène.",
     "Part des fiches d’événement ouvertes qui mènent au site du lieu",
     "Clics sur le lien du lieu (<code>click_lieu</code>) divisés par les ouvertures de fiche (<code>view_event</code>), événement par événement.",
     "30 %, avec 40 fiches ouvertes par événement (WordPress : 20 % et 20 fiches comme minimum).",
     "Moins de 20 %, ou moins de 30 fiches à J-7",
     "Publier une vidéo courte du geste présenté, remonter l’événement sur l’accueil, demander au lieu de relayer le lien UTM.",
     "Plus de 50 %",
     "Reprendre la même fiche et le même type de publication pour l’événement suivant ; prévenir le lieu de l’affluence.",
     "GA4, dans le rapport Looker Studio", "chaque semaine avant un événement"),
    ("2", "Être découverte par les 18-35 ans",
     "Hypothèse de départ : ce public découvre les sorties sur les réseaux avant Google. C’est là que le site doit aller le chercher.",
     "Visites engagées venues des réseaux sociaux, par mois",
     "Sessions avec engagement du canal Organic Social, précisées par les liens UTM (Instagram, Facebook, TikTok si un compte est ouvert).",
     "200 visites par mois, d’après le besoin calculé page 10.",
     "Moins de 100 par mois",
     "Vérifier les liens UTM et le lien en bio, publier plus régulièrement, tester un autre format (coulisses, avant / après, gestes).",
     "Plus de 300 par mois",
     "Repérer la publication qui a marché, la décliner et renvoyer vers la fiche du prochain événement.",
     "GA4, dans le rapport Looker Studio", "chaque mois"),
    ("3", "Faire participer avec le livre d’or",
     "Ce public commente beaucoup en ligne : laisser un avis doit prendre une minute sur téléphone.",
     "Avis publiés par mois, avec la note moyenne",
     "Envois réussis du livre d’or (<code>submit_avis</code>), puis avis approuvés dans le Studio.",
     "4 avis par mois, pour 3 ateliers (WordPress : 2).",
     "Moins de 2 par mois, ou une note sous 4/5",
     "Afficher un QR code vers le livre d’or en fin d’atelier ; lire les remarques et ajuster l’atelier.",
     "Plus de 6 par mois",
     "Reprendre les meilleurs avis, avec l’accord de leurs auteurs, dans les publications.",
     "GA4 et Studio Sanity", "chaque mois"),
    ("4", "Obtenir plus de demandes d’atelier",
     "Les clientes veulent animer 3 ateliers par mois. Viser plus jeune ne change pas le besoin des partenaires : l’exigence reste la même que sur WordPress.",
     "Demandes d’atelier reçues par mois",
     "Envois réussis du formulaire de contact (<code>generate_lead</code>), une fois l’envoi d’e-mails branché.",
     "6 par mois, si une demande sur deux devient un atelier (hypothèse).",
     "Moins de 3 par mois",
     "Tester le formulaire, relancer par e-mail les musées et festivals déjà partenaires.",
     "Plus de 9 par mois",
     "Repérer la source qui a marché et la renforcer ; prévoir les disponibilités.",
     "GA4, recoupé avec les e-mails reçus", "chaque mois"),
    ("5", "Être trouvée sur Google",
     "Google devrait surtout servir à retrouver Néotisse après l’avoir vue ailleurs : sur un réseau, dans un musée, sur un festival.",
     "Clics depuis Google sur les pages Accueil, Ateliers et Calendrier",
     "Clics, impressions et position moyenne, dont la recherche du nom « Néotisse ».",
     "Le premier mois complet après la mise en ligne.",
     "−20 % sur un mois",
     "Vérifier l’indexation et la vitesse sur téléphone, puis les pages en recul.",
     "+20 % sur un mois",
     "Identifier la page qui progresse et enrichir les autres sur le même modèle.",
     "Search Console, dans le rapport Looker Studio", "chaque mois"),
]
LH = json.loads((HERE / "lh.json").read_text())
P = []

P.append(f'''
<section class="page cover">
  <div class="cover-top"><p class="kicker">Tableau de bord de suivi des performances</p><p class="kicker light">Novembre 2026</p></div>
  <div class="cover-mid">
    {blocks("Néotisse", "xl")}
    <p class="cover-title">Viser plus jeune, viser plus haut :<br>le tableau de bord du site vibe codé</p>
    <p class="cover-sub">Objectifs, indicateurs et seuils d’alerte, plan de taggage,<br>audit de performance et projection du trafic.</p>
  </div>
  <div class="cover-bot">
    <div><p class="label">Cliente</p><p>Association Néotisse<br>Marie-Salomé Perrichon et Émilie Roma Sert</p></div>
    <div><p class="label">Agence</p><p>bLaNk · Louis Nourry</p></div>
    <img src="data:image/png;base64,{LOGO}" alt="bLaNk">
  </div>
</section>''')

P.append(page(2, "01 · Public et objectifs", f'''
<div class="toc"><p class="label">Sommaire</p><ol>
  <li><span>01</span>Public et objectifs</li><li><span>04</span>Présentation du tableau de bord</li>
  <li><span>02</span>Tableau de pilotage</li><li><span>05</span>Audit de performance</li>
  <li><span>03</span>Plan de taggage</li><li><span>06</span>Projection et recommandations</li>
</ol></div>
{h1("01", "Public et objectifs")}
<p class="lead">Le site vibe codé vise un grand public plus jeune, les 18-35 ans. Les attentes montent donc sur ce public : la même méthode que pour WordPress, avec un objectif de plus et des seuils plus hauts.</p>
<div class="cols three facts">
  <div><p class="big">90 %</p><p class="small">des internautes utilisent les réseaux sociaux et les plateformes de vidéos</p></div>
  <div><p class="big">52 %</p><p class="small">des utilisateurs de moins de 25 ans y publient ou commentent chaque jour, contre un tiers en moyenne</p></div>
  <div><p class="big">85 %</p><p class="small">des 18-24 ans utilisent l’IA générative en 2025, contre 48 % de la population</p></div>
</div>
<p class="small muted">Baromètre du numérique 2026, Crédoc pour l’Arcep, l’Arcom, le CGE et l’ANCT.</p>
<h2>Cinq objectifs, les trois premiers pour le grand public</h2>
<ol class="reasons">{"".join(f"<li><span>{o[0]}</span><div><b>{o[1]}</b><p>{o[2]}</p></div></li>" for o in O)}</ol>
'''))

syn = "".join(f"<tr><td>{o[1]}</td><td>{o[3]}</td><td class='neg'>{o[6]}</td><td class='pos'>{o[8]}</td><td>{o[10]}<br><i>{o[11]}</i></td></tr>" for o in O)
P.append(page(3, "02 · Tableau de pilotage", f'''
{h1("02", "Tableau de pilotage")}
<table class="grid pilot">
  <tr><th>Objectif</th><th>KPI</th><th class="dark">Seuil bas</th><th class="dark">Seuil haut</th><th>Outil · rythme</th></tr>
  {syn}
</table>
<h2>Ce qui monte par rapport au WordPress</h2>
<table class="grid compact">
  <tr><th>Attente</th><th>WordPress</th><th class="dark">Vibe codé</th></tr>
  <tr><td>Fiches menant au site du lieu</td><td>référence 20 %, alerte sous 10 %</td><td><b>référence 30 %, alerte sous 20 %</b></td></tr>
  <tr><td>Fiches ouvertes à J-7</td><td>alerte sous 20</td><td><b>alerte sous 30</b></td></tr>
  <tr><td>Avis au livre d’or</td><td>2 par mois</td><td><b>4 par mois</b></td></tr>
  <tr><td>Visites engagées des réseaux</td><td>non suivies comme KPI</td><td><b>200 par mois</b></td></tr>
  <tr><td>Demandes d’atelier</td><td>6 par mois</td><td>6 par mois, inchangé</td></tr>
</table>
<p class="small muted">Ces références sont des ambitions, pas des moyennes constatées : elles seront remplacées par les trois premiers mois de données. Les seuils des objectifs 2, 3 et 4 sont fixés à −50 % et +50 % de la référence.</p>
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
      <p class="label">Outil et rythme</p><p>{o[10]} · {o[11]}.</p>
    </div>
    <div class="th">
      <div class="th-neg"><p class="label">Seuil bas · {o[6]}</p><p>{o[7]}</p></div>
      <div class="th-pos"><p class="label inv">Seuil haut · {o[8]}</p><p>{o[9]}</p></div>
    </div>
  </div>
</div>'''


P.append(page(4, "02 · Tableau de pilotage", detail(O[0]) + detail(O[1]) + '''
<div class="split"><div><p class="label inv">Pourquoi pas l’âge comme KPI ?</p><p>GA4 ne connaît l’âge que d’une partie des visiteurs, et masque ces données quand ils sont peu nombreux. Le chiffre ne serait pas fiable pour une association.</p></div>
<div><p class="label">Ce qu’on lit à la place</p><p>Le canal d’arrivée (réseaux sociaux), la part du téléphone et le taux d’engagement : trois signes indirects, mais mesurables dès le premier mois.</p></div></div>'''))
P.append(page(5, "02 · Tableau de pilotage", detail(O[2]) + detail(O[3])))
P.append(page(6, "02 · Tableau de pilotage", detail(O[4]) + '''
<h2>Ce qu’on regarde aussi, sans en faire un KPI</h2>
<table class="grid compact">
  <tr><th>Donnée</th><th>Pourquoi pour un public jeune</th><th>Où</th></tr>
  <tr><td>Part du téléphone</td><td>Si elle est forte et l’engagement faible, la page est trop lente ou le geste trop difficile</td><td>GA4, Technologie</td></tr>
  <tr><td>Visites venues des assistants IA</td><td>Voir si ChatGPT et les autres envoient des visiteurs, puisque ce public les utilise</td><td>GA4, sources de trafic</td></tr>
  <tr><td>Pages d’entrée</td><td>Savoir si l’on arrive directement sur le calendrier depuis une publication</td><td>GA4, pages de destination</td></tr>
  <tr><td>Clics vers Instagram et Facebook</td><td>Le site et les réseaux se renvoient-ils du public ?</td><td>GA4, <code>click_social</code></td></tr>
</table>
<div class="split"><div><p class="label inv">Métriques de vanité</p><p>Abonnés, « j’aime » et vues d’une vidéo : elles flattent, mais ne remplissent pas un atelier à elles seules.</p></div>
<div><p class="label">Le test</p><p>Si ce chiffre double, y a-t-il plus de monde aux événements ou plus de demandes ? Sinon, on l’observe sans le piloter.</p></div></div>'''))

tags = [
    ("click_lieu", "Clic sur le lien du lieu, dans une fiche", "event_name, link_url", "1", "Oui"),
    ("submit_avis", "Le serveur confirme l’envoi d’un avis", "rating", "3", "Oui"),
    ("generate_lead", "Le serveur confirme l’envoi du formulaire de contact", "form_name", "4", "Oui"),
    ("view_event", "Une fiche s’ouvre dans le calendrier", "event_name, event_type", "1", "Non"),
    ("click_social", "Clic vers Instagram ou Facebook", "network", "2", "Non"),
    ("click_contact", "Clic sur l’adresse e-mail", "contact_type", "4", "Non"),
]
P.append(page(7, "03 · Plan de taggage", f'''
{h1("03", "Plan de taggage")}
<p>Pas d’extension ni de Site Kit ici : les six événements sont écrits dans le code du site, au moment exact où l’action réussit. Aucune donnée saisie par le visiteur n’est envoyée à Google.</p>
<table class="grid tags">
  <tr><th>Événement</th><th>Se déclenche quand…</th><th>Paramètre</th><th class="c">Objectif</th><th class="c dark">Clé ?</th></tr>
  {"".join(f"<tr><td><code>{a}</code></td><td>{b}</td><td><code>{c}</code></td><td class='c'>{d}</td><td class='c'><b>{e}</b></td></tr>" for a, b, c, d, e in tags)}
</table>
<h2>Où en est le site aujourd’hui</h2>
<table class="grid compact">
  <tr><th>Élément</th><th>État</th></tr>
  <tr><td>Bandeau de consentement</td><td>En place : aucune requête vers Google avant l’accord</td></tr>
  <tr><td>Balise GA4</td><td>Prête dans le code, en attente de l’identifiant GA4 de l’association</td></tr>
  <tr><td>Six événements</td><td>À développer, avec une seule fonction commune qui vérifie le consentement</td></tr>
  <tr><td>Formulaire de contact</td><td>L’envoi d’e-mails reste à brancher : <code>generate_lead</code> n’a de sens qu’après</td></tr>
</table>
<h2>Les liens UTM, indispensables pour les réseaux</h2>
<pre>neotisse.fr/calendrier-des-ateliers/?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=atelier_mars_2027</pre>
<p class="small muted">Un lien par publication importante, un pour la bio, un par QR code affiché en festival (<code>utm_medium=qr</code>). Noms en minuscules, sans accent ni espace.</p>
'''))

months = [("Janv.", 40), ("Févr.", 60), ("Mars", 75), ("Avr.", 95), ("Mai", 130), ("Juin", 115)]
bars = "".join(f'<div class="bar"><span style="height:{v * .38:.1f}mm"><b>{v}</b></span><i>{m}</i></div>' for m, v in months)
P.append(page(8, "04 · Présentation du tableau de bord", f'''
{h1("04", "Présentation du tableau de bord")}
<p>Sans administration WordPress, les chiffres sont réunis dans un rapport Looker Studio : un lien que les clientes ouvrent sur leur téléphone, sans passer par Google Analytics. Les avis se comptent dans le Studio du site.</p>
<div class="dash">
  <div class="dash-top"><p class="label inv">Tableau de bord · juin</p><p class="small">Exemple illustratif, chiffres fictifs</p></div>
  <div class="tiles">
    <div class="tile"><p class="label">Fiches → lieu</p><p class="big-n">32<span>%</span></p><p class="small">référence 30 %</p></div>
    <div class="tile"><p class="label">Visites réseaux</p><p class="big-n">185<span>/ 200</span></p><p class="small">zone normale</p></div>
    <div class="tile"><p class="label">Avis du mois</p><p class="big-n">5<span>/ 4</span></p><p class="small">zone normale</p></div>
    <div class="tile inv"><p class="label inv">Demandes</p><p class="big-n">5<span>/ 6</span></p><p class="small">zone normale</p></div>
  </div>
  <div class="chart"><p class="label">Fiches d’événement ouvertes par mois</p><div class="bars">{bars}<div class="goal-line" style="bottom:45.6mm"><span>référence 120</span></div></div></div>
</div>
<h2>Les outils de mesure</h2>
<table class="grid compact">
  <tr><th>Outil</th><th>Ce qu’il mesure pour Néotisse</th><th>Coût</th></tr>
  <tr><td>Google Analytics 4</td><td>Sources de trafic, engagement, événements clés</td><td>Gratuit</td></tr>
  <tr><td>Search Console</td><td>Recherches Google, clics et position</td><td>Gratuit</td></tr>
  <tr><td>Looker Studio</td><td>Réunit les deux dans un rapport partagé par lien</td><td>Gratuit</td></tr>
  <tr><td>Studio Sanity</td><td>Avis reçus, approuvés, note de chacun</td><td>Offre gratuite</td></tr>
  <tr><td>PageSpeed Insights</td><td>Vitesse sur téléphone, une fois le site en ligne</td><td>Gratuit</td></tr>
</table>
'''))

cats = [("Performance", "performance"), ("Accessibilité", "accessibility"), ("Bonnes pratiques", "best-practices"), ("SEO", "seo"), ("LCP", "lcp"), ("CLS", "cls"), ("TBT", "tbt")]
rows = "".join(f"<tr><td>{n}</td>" + "".join(f"<td class='c'>{'<b>' if i < 4 else ''}{LH[p][v][k]}{'</b>' if i < 4 else ''}</td>" for p in ("home", "cal") for v in "md") + "</tr>" for i, (n, k) in enumerate(cats))
P.append(page(9, "05 · Audit de performance", f'''
{h1("05", "Audit de performance")}
<table class="grid compact">
  <tr><th></th><th class="c">Accueil mobile</th><th class="c">Accueil ordinateur</th><th class="c">Calendrier mobile</th><th class="c">Calendrier ordinateur</th></tr>{rows}
</table>
<p class="small muted">Lighthouse 12.6, médiane de trois mesures par page, site de production lancé en local le 25 novembre 2026. « Bonnes pratiques » perd quatre points sur une connexion à Sanity refusée à cette adresse locale : le domaine définitif devra être autorisé.</p>
<h2>Ce que disent les scores</h2>
<p>Accessibilité et SEO sont à 100, et l’ordinateur est presque instantané. Sur téléphone, l’accueil obtient 84 (WordPress : 74), mais son plus grand élément s’affiche en 4,6 s (WordPress : 5,0 s) : c’est encore trop pour un public attendu surtout sur téléphone. La cible est de 2,5 s. Sur l’accueil mobile, cet élément est le texte du bandeau de cookies.</p>
<p class="small muted">Comparaison indicative : une seule mesure côté WordPress, sur un autre serveur local.</p>
<h2>Deux corrections prioritaires</h2>
<ol class="reasons">
  <li><span>1</span><div><b>Afficher plus tôt le contenu et le bandeau</b><p>Le bandeau n’apparaît qu’une fois le JavaScript chargé, ce qui repousse le LCP. L’afficher dès le premier rendu, avec un texte plus court sur téléphone, agit sur le seul indicateur de l’accueil mobile dans le rouge.</p></div></li>
  <li><span>2</span><div><b>Alléger le JavaScript de l’accueil</b><p>Lighthouse relève environ 80 Ko de JavaScript inutilisé : repérer les modules chargés trop tôt, animations en premier, et les différer.</p></div></li>
</ol>
<p><b>Objectif avant la mise en ligne :</b> moins de 2,5 s de LCP sur mobile, pour l’accueil et le calendrier.</p>
'''))

VOL, CONV = 200, 1.7
sc = [("Prudent · 3 mois", 10, .2, .5), ("Réaliste · 6 mois", 5, .7, 2.5), ("Ambitieux · 12 mois", 3, 1.7, 5.8)]
prow = "".join(f"<tr><td>{n}</td><td class='c'>{p}</td><td class='c'>{fr(a)} à {fr(b)} %</td><td class='c'>{fr(VOL * a / 100)} à {fr(VOL * b / 100)}</td><td class='c'><b>{'moins de 0,1' if VOL * b * CONV / 1e4 < .05 else 'au plus ' + fr(VOL * b * CONV / 1e4)}</b></td></tr>" for n, p, a, b in sc)
P.append(page(10, "06 · Projection", f'''
{h1("06", "Projection du trafic")}
<h2>Ce que Google peut apporter</h2>
<table class="grid compact">
  <tr><th>Scénario</th><th class="c">Position visée</th><th class="c">Taux de clic</th><th class="c">Visites / mois</th><th class="c dark">Demandes / mois</th></tr>
  {prow}
</table>
<p class="small muted">200 recherches par mois : « atelier tissage » 110 et « atelier de tissage » 90 (Ubersuggest, France, 24 novembre 2026), requêtes proches qui peuvent se recouper. Taux de clic : First Page Sage 2026, données américaines, avec puis sans réponse IA. Conversion 1,7 % : Ruler Analytics, formulaires, citée par WPForms (2026).</p>
<h2>Ce qu’il faut pour atteindre l’objectif grand public</h2>
<table class="grid compact">
  <tr><th>Étape</th><th>Calcul</th><th class="c dark">Par mois</th></tr>
  <tr><td>Fiches à ouvrir</td><td>3 événements × 40 fiches</td><td class="c"><b>120</b></td></tr>
  <tr><td>Visites nécessaires</td><td>un visiteur sur quatre ouvre une fiche (hypothèse)</td><td class="c"><b>480</b></td></tr>
  <tr><td>Clics vers le lieu</td><td>120 fiches × 30 %</td><td class="c"><b>36</b></td></tr>
  <tr><td>Part attendue des réseaux</td><td>environ 40 % des 480 visites (choix de répartition)</td><td class="c"><b>200</b></td></tr>
  <tr><td>Le reste</td><td>lieux partenaires, QR codes en festival, accès direct, Google</td><td class="c"><b>280</b></td></tr>
</table>
<div class="split">
  <div><p class="label inv">Comparé aux seuils</p><p>Sur ces recherches, Google amène au mieux une douzaine de visites, pour 480 nécessaires, et bien moins d’une demande, pour un seuil bas de 3.</p></div>
  <div><p class="label">Ce qu’on en tire</p><p>Le grand public jeune se gagne sur les réseaux et sur place, avec le site comme destination. Les partenaires se gagnent par la prospection.</p></div>
</div>
<p class="small muted">Le second tableau calcule un besoin, ce n’est pas une prévision : rien ne permet encore d’estimer la portée des réseaux de Néotisse.</p>
'''))

P.append(page(11, "06 · Recommandations de suivi", f'''
<h2>Consentement : ce qu’il change dans les chiffres</h2>
<p>Sur le site vibe codé, rien n’est envoyé à Google avant l’accord du visiteur, et le choix est gardé un an. Les visiteurs qui refusent n’apparaissent pas : les visites et les clics sont sous-estimés. Le Consent Mode de Google pourra être ajouté pour mieux interpréter ces refus. Les avis (Studio) et les demandes (e-mails) restent, eux, comptés en entier.</p>
<h2>Le rythme de suivi</h2>
<table class="grid compact">
  <tr><th>Quand</th><th>Qui</th><th>Quoi</th></tr>
  <tr><td>Chaque semaine avant un événement</td><td>Les clientes</td><td>Fiches ouvertes et clics vers le lieu ; relance sur les réseaux sous le seuil bas à J-7</td></tr>
  <tr><td>Chaque mois</td><td>Les clientes</td><td>Le rapport Looker Studio : une action par seuil franchi</td></tr>
  <tr><td>Chaque trimestre</td><td>Les clientes et le prestataire</td><td>Ajuster les seuils, relancer Lighthouse, comparer les réseaux entre eux</td></tr>
</table>
<h2>Nos recommandations</h2>
<ol class="reasons">
  <li><span>1</span><div><b>Terminer la mesure avant la mise en ligne</b><p>Identifiant GA4, envoi du formulaire, six événements testés dans DebugView, rapport Looker Studio.</p></div></li>
  <li><span>2</span><div><b>Montrer le geste en vidéo courte</b><p>Filage, tissage, teinture : une publication avant chaque événement, avec un lien direct vers sa fiche.</p></div></li>
  <li><span>3</span><div><b>Ajouter « Partager » et « Ajouter à mon agenda » aux fiches</b><p>Ces deux boutons n’existent pas encore : ils facilitent le bouche-à-oreille et deviendraient deux événements à suivre.</p></div></li>
  <li><span>4</span><div><b>Relier les ateliers au site par un QR code</b><p>Vers le livre d’or en fin d’atelier, vers le calendrier en festival, chacun avec son lien UTM.</p></div></li>
</ol>
'''))

CSS = "".join((HERE.parent / d / f).read_text() for d, f in (("dossier", "style.css"), ("kpi", "extra.css")))
html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Néotisse · Tableau de bord vibe codé</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{"".join(P)}</body></html>'''


def nbsp(text):
    parts = re.split(r"(<[^>]+>)", text)
    for i, p in enumerate(parts):
        if not p.startswith("<"):
            p = re.sub(r" ([:;?!»])", "\u00a0\\1", p)
            p = p.replace("« ", "«\u00a0")
            p = re.sub(r"(\d) (€|%|h\b|px|s\b|Ko)", "\\1\u00a0\\2", p)
            parts[i] = p
    return "".join(parts)


(HERE / "kpi_vibe.html").write_text(nbsp(html))
print("ok")
