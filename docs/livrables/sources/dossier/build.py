import base64, re, sys
from pathlib import Path

HERE = Path(__file__).parent
LOGO = base64.b64encode((HERE.parent / "logo" / "blank.png").read_bytes()).decode()
TOTAL = 10


def blocks(word, cls=""):
    out, on = [], True
    for ch in word:
        if ch == " ":
            out.append('<span class="sp"></span>')
            continue
        out.append(f'<span class="{"on" if on else "off"}">{ch}</span>')
        on = not on
    return f'<span class="blocks {cls}">{"".join(out)}</span>'


def page(num, section, body, cls=""):
    return f'''
<section class="page {cls}">
  <header class="run"><span>{section}</span><span>Néotisse · Réponse à l’appel d’offres</span></header>
  {body}
  <footer class="foot"><img src="data:image/png;base64,{LOGO}" alt="bLaNk"><span>{num:02d} / {TOTAL:02d}</span></footer>
</section>'''


def h1(n, title):
    return f'<div class="h1"><span class="num">{n}</span><h1>{title}</h1></div>'


def dots(n, t=3):
    return '<span class="dots">' + "●" * n + '<i>' + "●" * (t - n) + '</i></span>'


pages = []

# 1. Couverture
pages.append(f'''
<section class="page cover">
  <div class="cover-top">
    <p class="kicker">Réponse à l’appel d’offres</p>
    <p class="kicker light">Novembre 2026</p>
  </div>
  <div class="cover-mid">
    {blocks("Néotisse", "xl")}
    <p class="cover-title">Un site vitrine pour faire connaître<br>les savoir-faire textiles anciens</p>
    <p class="cover-sub">Deux solutions développées, WordPress et vibe coding,<br>et notre recommandation argumentée.</p>
  </div>
  <div class="cover-bot">
    <div>
      <p class="label">Cliente</p>
      <p>Association Néotisse<br>Marie-Salomé Perrichon et Émilie Roma Sert</p>
    </div>
    <div>
      <p class="label">Agence</p>
      <p>bLaNk · Louis Nourry<br>Création de sites, branding, refonte</p>
    </div>
    <img src="data:image/png;base64,{LOGO}" alt="bLaNk">
  </div>
</section>''')

# 2. Sommaire + agence
pages.append(page(2, "01 · L’agence", f'''
<div class="toc">
  <p class="label">Sommaire</p>
  <ol>
    <li><span>01</span>L’agence</li>
    <li><span>02</span>Analyse du besoin et des objectifs</li>
    <li><span>03</span>Proposition de valeur et approche</li>
    <li><span>04</span>Les deux solutions développées</li>
    <li><span>05</span>Comparaison et recommandation</li>
    <li><span>06</span>Engagements et prochaines étapes</li>
  </ol>
</div>
{h1("01", "L’agence")}
<div class="cols">
  <div>
    <p class="lead">bLaNk est une agence de création de sites web, de branding et de refonte de sites, fondée et dirigée par Louis Nourry.</p>
    <p>Une page blanche au départ, une identité forte à l’arrivée : c’est le sens du nom. L’agence accompagne des structures qui ont un vrai savoir-faire mais peu de visibilité en ligne, et leur livre un site qu’elles peuvent faire vivre seules.</p>
    <p>Interlocuteur unique du premier rendez-vous à la mise en ligne, Louis conduit le cadrage, le design, le développement et la prise en main. Chaque étape est validée par les intervenants du projet, Travis et Camille, puis par les clientes.</p>
  </div>
  <div>
    <p class="label">Ce que fait bLaNk</p>
    <ul class="ticks">
      <li><b>Création de sites</b> vitrines, du cadrage à la mise en ligne</li>
      <li><b>Branding</b> : identité visuelle, typographies, couleurs</li>
      <li><b>Refonte</b> de sites existants, sans perdre le référencement</li>
    </ul>
    <p class="label">Notre façon de travailler</p>
    <ul class="ticks">
      <li><b>Comprendre avant de dessiner</b> : le site découle des objectifs de la cliente</li>
      <li><b>Simplicité</b> : une interface de gestion que l’on maîtrise sans formation technique</li>
      <li><b>Transparence</b> : coûts, limites et risques dits clairement</li>
    </ul>
  </div>
</div>
<div class="band"><p>Une page blanche au départ,<br>une identité forte à l’arrivée.</p></div>
<h2>Pourquoi bLaNk pour Néotisse</h2>
<div class="cols three values">
  <div><p class="label">Un seul interlocuteur</p><p>Les clientes parlent toujours à la même personne, du kickoff à la prise en main : pas de perte d’information entre les étapes.</p></div>
  <div><p class="label">Le branding inclus</p><p>Néotisse n’a qu’un logo. bLaNk crée l’identité complète du site : couleurs, typographies, signes graphiques.</p></div>
  <div><p class="label">Deux solutions, un choix éclairé</p><p>Plutôt qu’imposer un outil, l’agence développe deux versions et compare, pour recommander la plus adaptée.</p></div>
</div>
'''))

# 3. Besoin : contexte, enjeux, objectifs
pages.append(page(3, "02 · Analyse du besoin", f'''
{h1("02", "Analyse du besoin et des objectifs")}
<p class="label">Le contexte</p>
<p class="lead">Néotisse est une association loi 1901, basée à Montpellier et fondée en mai 2024. Elle anime des ateliers et des initiations aux savoir-faire textiles anciens, du Néolithique au Moyen Âge : filage, tissage, teinture naturelle.</p>
<div class="cols three facts">
  <div><p class="big">2 + 2</p><p>deux membres et deux bénévoles, une équipe 100 % féminine</p></div>
  <div><p class="big">3</p><p>piliers : originalité, expertise scientifique, flexibilité</p></div>
  <div><p class="big">France</p><p>interventions partout, avec des matières premières françaises et locales</p></div>
</div>
<p>L’association est née d’un constat : peu d’activités font découvrir les textiles des époques anciennes. Elle intervient dans les musées, les sites archéologiques, les festivals, les universités et les collectivités. Elle organise aussi son propre festival, intervient chaque année aux Fêtes de la Préhistoire de Tautavel et travaille régulièrement avec le musée de Gergovie.</p>
<p class="label">L’enjeu</p>
<p>Sans site internet, Néotisse est peu visible et peine à rassurer : un directeur de musée hésite à faire appel à une jeune structure qui n’a pas de présence en ligne. Le site doit montrer son sérieux et transformer les visites en demandes d’atelier.</p>
<div class="goal">
  <div>
    <p class="label inv">Objectif chiffré</p>
    <p class="goal-n">1 <span>→</span> 3</p>
    <p>événements par mois en moyenne</p>
  </div>
  <div class="goal-list">
    <p><b>Partenaires</b> (cible prioritaire) : être visible, rassurer et obtenir plus de demandes d’atelier.</p>
    <p><b>Grand public</b> : savoir quand et où a lieu le prochain événement.</p>
    <p><b>Pas de vente</b> : un site vitrine, que l’association met à jour elle-même.</p>
  </div>
</div>
<p class="label">À mettre en avant, d’après le kickoff</p>
<div class="cols four highlights">
  <div><b>Le festival</b><span>organisé par Néotisse, sa priorité</span></div>
  <div><b>Tautavel</b><span>les Fêtes de la Préhistoire, chaque année</span></div>
  <div><b>Gergovie</b><span>tissage aux tablettes, partenaire régulier</span></div>
  <div><b>Le film</b><span>documentaire sur l’association</span></div>
</div>
'''))

# 4. Publics cibles et contraintes
pages.append(page(4, "02 · Analyse du besoin", f'''
<h2>Les publics cibles</h2>
<p>Les partenaires passent avant le grand public : ce sont eux qui programment les ateliers. Deux personas, issus du cahier des charges, guident nos choix.</p>
<div class="cols persona">
  <div class="card">
    <p class="label">Persona 1 · Partenaire</p>
    <h3>Laurent, 47 ans</h3>
    <p class="meta">Directeur du musée archéologique municipal de Saintes · budget médiation de 8 000 à 15 000 € par an</p>
    <p>Il programme 3 à 6 mois à l’avance et trouve ses intervenants par recommandation ou sur Google (« atelier tissage préhistoire »).</p>
    <p class="label">Il cherche</p>
    <ul class="ticks small">
      <li>qui sont les intervenantes, leur formation, leur expérience</li>
      <li>les musées qui leur ont fait confiance</li>
      <li>l’offre précise : durée, jauge, public, matériel, accessibilité</li>
      <li>un contact simple, avec une réponse rapide</li>
    </ul>
    <p class="fear"><b>Son frein</b> : le manque de professionnalisme d’une jeune structure.</p>
  </div>
  <div class="card">
    <p class="label">Persona 2 · Grand public</p>
    <h3>Sophie, 39 ans</h3>
    <p class="meta">Infirmière près de Sète, deux enfants dont un fils autiste · 50 à 100 € par mois pour les sorties</p>
    <p>Elle cherche sur son téléphone, le soir, des activités calmes et manuelles pour ses enfants.</p>
    <p class="label">Elle cherche</p>
    <ul class="ticks small">
      <li>la prochaine date, le lieu, l’âge, le prix, la durée</li>
      <li>si l’atelier convient à son fils : bruit, taille du groupe, pauses</li>
      <li>des avis d’autres parents</li>
      <li>une page rapide et lisible sur mobile</li>
    </ul>
    <p class="fear"><b>Son frein</b> : une information introuvable ou un site lent, et elle abandonne.</p>
  </div>
</div>
<h2>Les contraintes</h2>
<table class="grid">
  <tr><th>Contrainte</th><th>Ce que nous en déduisons</th></tr>
  <tr><td>Clientes peu à l’aise avec la technique</td><td>Une interface de gestion simple, en français, limitée à leurs contenus</td></tr>
  <tr><td>Autonomie demandée</td><td>Ajouter un événement, un atelier, un partenaire et valider un avis sans aide</td></tr>
  <tr><td>Pas de charte graphique, seulement un logo</td><td>Créer une identité : couleurs naturelles, typographie aérienne, boutons qui ressortent</td></tr>
  <tr><td>Budget associatif</td><td>Des coûts récurrents faibles et connus à l’avance</td></tr>
  <tr><td>Données personnelles (avis, contact)</td><td>Conformité RGPD, consentement aux cookies, modération des avis</td></tr>
</table>
'''))

# 5. Proposition de valeur et approche
pages.append(page(5, "03 · Proposition de valeur", f'''
{h1("03", "Proposition de valeur et approche")}
<blockquote>Un site sobre et professionnel, pensé d’abord pour les partenaires, qui donne au public le prochain atelier en un clic, et que Néotisse fait vivre seule.</blockquote>
<div class="cols three values">
  <div><p class="label">Rassurer</p><p>Partenaires, logos de musées, avis vérifiés, équipe et formations visibles dès l’accueil.</p></div>
  <div><p class="label">Informer</p><p>Un calendrier toujours à jour et une page Ateliers qui répond aux questions avant le premier appel.</p></div>
  <div><p class="label">Convertir</p><p>Chaque page mène au contact : c’est là qu’une visite devient un atelier programmé.</p></div>
</div>
<h2>Notre démarche</h2>
<ol class="steps">
  <li><b>Cadrer</b><span>Kickoff avec Marie-Salomé et Émilie le 19 octobre, reformulation du besoin, personas, cahier des charges validé le 2 novembre.</span></li>
  <li><b>Planifier</b><span>Livrables, tâches, échéances et budget suivis dans Notion ; validation de chaque étape par Travis et Camille, puis par les clientes.</span></li>
  <li><b>Réaliser</b><span>Maquette Figma, puis deux versions du même site, WordPress et vibe coding, avec les mêmes contenus et la même identité.</span></li>
  <li><b>Suivre et ajuster</b><span>Avancement mesuré en continu, blocages traités, changements validés à chaque étape.</span></li>
  <li><b>Livrer et transmettre</b><span>Recette sur les critères du cahier des charges, recommandation, puis prise en main avec un guide.</span></li>
</ol>
<h2>Le parcours du site</h2>
<div class="tree">
  <div class="root">Accueil</div>
  <div class="branches">
    <div><b>Ateliers</b><span>le catalogue</span></div>
    <div><b>Calendrier</b><span>le prochain événement</span></div>
    <div><b>Partenaires</b><span>la preuve</span></div>
    <div><b>Livre d’or</b><span>les avis</span></div>
    <div><b>À propos</b><span>l’équipe</span></div>
    <div class="inv"><b>Contact</b><span>la demande d’atelier</span></div>
  </div>
</div>
<p class="small muted">Un site à plat, sur deux niveaux : chaque page est à un clic depuis le menu, et toutes renvoient vers le contact.</p>
'''))

# 6. Solution WordPress
pages.append(page(6, "04 · Les deux solutions", f'''
{h1("04", "Les deux solutions développées")}
<p>Les deux versions partagent la même arborescence, les mêmes textes et la même identité visuelle : rouge garance, crème, titres élégants et angles droits. Seules la technique et l’interface de gestion changent.</p>
<p class="label">Fonctionnalités communes aux deux versions</p>
<div class="cols three feats">
  <div><b>Calendrier</b><span>liste « À venir », vue par mois, fiche détaillée de chaque événement</span></div>
  <div><b>Livre d’or</b><span>avis modérés avant publication, note moyenne, derniers avis sur l’accueil</span></div>
  <div><b>Partenaires</b><span>logos, descriptions et liens vers leurs sites</span></div>
  <div><b>Contact</b><span>formulaire, téléphone, e-mail et FAQ de 10 questions</span></div>
  <div><b>Référencement</b><span>adresses parlantes, titres et descriptions par page</span></div>
  <div><b>RGPD</b><span>bandeau cookies, mentions légales, politique de confidentialité</span></div>
</div>
<div class="sol">
  <div class="sol-head"><span>A</span><h2>Version WordPress</h2></div>
  <div class="cols">
    <div>
      <p class="label">Les choix</p>
      <ul class="ticks small">
        <li><b>WordPress</b> et l’éditeur de blocs Gutenberg : chaque titre, image ou bouton se modifie en un clic</li>
        <li>Thème <b>Twenty Twenty-Five</b>, personnalisé par les styles globaux : la charte est rangée à un seul endroit</li>
        <li>Extension dédiée <b>neotisse-core</b> : types de contenu Événements et Partenaires avec des champs guidés</li>
        <li>Hébergement prévu chez <b>OVH</b></li>
      </ul>
    </div>
    <div>
      <p class="label">Les extensions</p>
      <table class="mini">
        <tr><td>WPForms Lite</td><td>formulaire de contact</td></tr>
        <tr><td>WP Customer Reviews</td><td>livre d’or modéré, note moyenne</td></tr>
        <tr><td>Rank Math</td><td>référencement, sitemap</td></tr>
        <tr><td>Complianz</td><td>bandeau cookies</td></tr>
        <tr><td>WP 2FA</td><td>double authentification</td></tr>
        <tr><td>UpdraftPlus</td><td>sauvegardes</td></tr>
        <tr><td>Simply Static</td><td>export statique</td></tr>
      </table>
    </div>
  </div>
  <div class="split">
    <div><p class="label">Points forts</p><p>Outil connu et très documenté, nombreux tutoriels, facile à reprendre par un autre prestataire, édition visuelle des pages.</p></div>
    <div><p class="label">Limites</p><p>Une interface chargée pour des débutantes, sept extensions à mettre à jour et à surveiller, un site plus lourd, des failles possibles si les mises à jour attendent.</p></div>
  </div>
</div>
'''))

# 7. Solution vibe coding
pages.append(page(7, "04 · Les deux solutions", f'''
<div class="sol">
  <div class="sol-head inv"><span>B</span><h2>Version vibe codée</h2></div>
  <div class="cols">
    <div>
      <p class="label">Les choix</p>
      <ul class="ticks small">
        <li><b>Next.js</b> et <b>React</b> : pages rendues côté serveur, rapides et bien référencées</li>
        <li><b>Sanity Studio</b>, l’espace de gestion, en français, sur <i>/studio</i> : seulement les contenus de Néotisse (événements, ateliers, partenaires, avis, FAQ)</li>
        <li>Le site se met à jour dès qu’un contenu est publié, sans manipulation</li>
        <li>Hébergement sur <b>Netlify</b>, avec HTTPS</li>
        <li>Animations soignées : intro où « Néotisse » s’écrit à la plume, apparitions au défilement, défilement doux</li>
      </ul>
    </div>
    <div>
      <p class="label">Les outils IA utilisés</p>
      <table class="mini">
        <tr><td>Claude Code</td><td>écriture du code, à partir d’un cahier de règles tenu à jour</td></tr>
        <tr><td>MCP Figma</td><td>lecture de la maquette pour reproduire le design</td></tr>
        <tr><td>MCP Novamira</td><td>lecture du site WordPress, pour reprendre ses contenus et son rendu à l’identique</td></tr>
      </table>
      <p class="small muted">L’IA écrit le code, l’agence décide : chaque page est relue et comparée au WordPress sur ordinateur et sur mobile avant d’être validée.</p>
    </div>
  </div>
  <div class="split">
    <div><p class="label">Points forts</p><p>Un espace de gestion simple et taillé pour les clientes, un site rapide et moderne, aucune extension à mettre à jour, une identité sans limite de thème.</p></div>
    <div><p class="label">Limites</p><p>Faire évoluer le code demande un développeur : Néotisse dépend de l’agence pour les nouvelles fonctions. Le formulaire de contact reste à brancher à l’envoi d’e-mails.</p></div>
  </div>
</div>
<h2>Ce qui change pour les clientes au quotidien</h2>
<table class="grid daily">
  <tr><th></th><th>WordPress</th><th class="dark">Vibe codé</th></tr>
  <tr><td>L’espace de gestion</td><td>L’interface WordPress, très répandue, avec de nombreux menus</td><td>Un Studio en français, avec seulement leurs contenus</td></tr>
  <tr><td>Ajouter un événement</td><td>Depuis le menu Événements, avec des champs guidés</td><td>Une fiche à remplir : le calendrier se met à jour seul</td></tr>
  <tr><td>Valider un avis</td><td>Dans le module de l’extension des avis</td><td>Un bouton « Approuver » ou « Refuser »</td></tr>
  <tr><td>Entretien</td><td>Mises à jour régulières de WordPress et des extensions</td><td>Rien à mettre à jour de leur côté</td></tr>
</table>
'''))

# 8. Comparaison
crit = [
    ("Adéquation au besoin", 3, 3, "Les deux couvrent toutes les pages et fonctions demandées."),
    ("Fonctionnalités et personnalisation", 2, 3, "Vibe codé : aucune limite liée au thème ou aux extensions."),
    ("Expérience utilisateur", 2, 3, "Vibe codé : plus rapide et plus fluide, surtout sur mobile."),
    ("Facilité de gestion", 2, 3, "Studio en français, limité aux contenus de Néotisse."),
    ("Maintenance et évolutivité", 2, 2, "WordPress se reprend facilement ; le site vibe codé n’a rien à mettre à jour mais évolue avec un développeur."),
    ("Performance et sécurité", 2, 3, "WordPress : sept extensions à surveiller. Vibe codé : pas d’interface d’administration exposée."),
    ("Délais de réalisation", 3, 3, "Les deux versions sont prêtes dans les délais."),
]
rows = "".join(
    f"<tr><td>{k}</td><td class='c'>{dots(a)}</td><td class='c'>{dots(b)}</td><td>{n}</td></tr>"
    for k, a, b, n in crit)
pages.append(page(8, "05 · Comparaison", f'''
{h1("05", "Comparaison et recommandation")}
<p>Les critères de la consigne, notés de 1 à 3 points ; le huitième, les coûts, est détaillé juste après. L’analyse comparative donne le détail complet.</p>
<table class="grid compare">
  <tr><th>Critère</th><th class="c">WordPress</th><th class="c dark">Vibe codé</th><th>En bref</th></tr>
  {rows}
</table>
<h2>Les coûts</h2>
<table class="grid costs">
  <tr><th>Poste</th><th class="c">WordPress</th><th class="c dark">Vibe codé</th></tr>
  <tr><td>Création par l’agence</td><td class="c">0 €</td><td class="c">0 €</td></tr>
  <tr><td>Licence : extensions et CMS / outils IA</td><td class="c">40 € / mois</td><td class="c">20 € / mois</td></tr>
  <tr><td>Hébergement</td><td class="c">8 € / mois</td><td class="c">8 € / mois</td></tr>
  <tr><td>Nom de domaine en .fr</td><td class="c">9 € / an</td><td class="c">9 € / an</td></tr>
  <tr><td>Maintenance</td><td class="c">0 €</td><td class="c">0 €</td></tr>
  <tr class="total"><td>Total sur un an</td><td class="c">585 €</td><td class="c">345 €</td></tr>
</table>
<p class="small muted">Création et maintenance à 0 € : projet réalisé dans un cadre pédagogique. Une alternative en .org coûte 12 € par an.</p>
'''))

# 9. Recommandation
pages.append(page(9, "05 · Recommandation", f'''
<div class="reco">
  <p class="label inv">Notre recommandation</p>
  <p class="reco-t">La version vibe codée</p>
  <p>Elle répond le mieux aux deux priorités de Néotisse : faire vivre le site seule, et donner une image professionnelle et actuelle à des partenaires exigeants.</p>
</div>
<h2>Nos raisons, par ordre de priorité pour la cliente</h2>
<ol class="reasons">
  <li><span>1</span><div><b>La simplicité de l’espace de gestion</b><p>Les clientes ne sont pas à l’aise avec la technique. Le Studio ne montre que leurs contenus, en français : ajouter un événement revient à remplir une fiche, valider un avis à cliquer sur « Approuver ». C’est le critère de réussite « autonomie » du cahier des charges : tout faire seule en moins de 10 minutes.</p></div></li>
  <li><span>2</span><div><b>La modernité du site</b><p>Laurent craint le manque de professionnalisme d’une jeune structure. Un site rapide, fluide et entièrement à l’image de Néotisse le rassure dès la première visite, et Sophie le consulte sans attendre sur son téléphone.</p></div></li>
  <li><span>3</span><div><b>Des coûts plus faibles</b><p>345 € par an contre 585 €, sans extension payante : un écart qui compte pour une association.</p></div></li>
  <li><span>4</span><div><b>Moins d’entretien et de risques</b><p>Aucune extension à mettre à jour, donc moins de failles possibles et rien à surveiller pour les clientes.</p></div></li>
</ol>
<h2>Limites et risques, et comment nous les traitons</h2>
<table class="grid">
  <tr><th>Risque</th><th>Réponse de l’agence</th></tr>
  <tr><td>Néotisse dépend de l’agence pour faire évoluer le code</td><td>Un contrat de maintenance, un code documenté et versionné, que tout développeur peut reprendre</td></tr>
  <tr><td>Le formulaire de contact n’envoie pas encore d’e-mails</td><td>Branchement à un service d’envoi avant la mise en ligne, testé sur ordinateur et téléphone</td></tr>
  <tr><td>Les limites de l’offre gratuite de Sanity</td><td>Largement suffisante pour ce volume ; données privées des avis protégées ; passage à une offre payante si besoin</td></tr>
</table>
'''))

# 10. Engagements et prochaines étapes
pages.append(page(10, "06 · Engagements", f'''
{h1("06", "Engagements et prochaines étapes")}
<div class="cols two-eng">
  <div><p class="label">Accessibilité</p><p>RGAA 4.1 niveau AA, complété des critères WCAG 2.2 AA : navigation au clavier, contrastes, textes alternatifs, formulaires accessibles. Audit avant mise en ligne et déclaration d’accessibilité publiée.</p></div>
  <div><p class="label">Sécurité</p><p>Base OWASP ASVS niveau 2 : HTTPS, en-têtes de sécurité, double authentification et moindres droits pour l’administration, sauvegardes, correctifs critiques sous 48 h, anti-spam des formulaires.</p></div>
  <div><p class="label">RGPD</p><p>Données minimales, durées de conservation documentées, consentement par catégorie de cookies, autorisations écrites pour les photos, avis et logos partenaires.</p></div>
  <div><p class="label">Mesure d’audience</p><p>Google Analytics 4, chargé uniquement après acceptation des cookies de statistiques. Les visites, envois de formulaire et clics vers les inscriptions remontent dans le tableau de bord.</p></div>
</div>
<h2>Critères de réussite</h2>
<div class="cols three crit">
  <div><b>Formulaire</b><span>une demande d’atelier envoyée en 3 clics depuis l’accueil</span></div>
  <div><b>Autonomie</b><span>événement, avis, atelier et partenaire gérés seule en moins de 10 minutes</span></div>
  <div><b>Mobile</b><span>aucun défilement horizontal, testé à 375, 768 et 1440 px</span></div>
  <div><b>Performance</b><span>accueil affiché en moins de 3 secondes sur mobile</span></div>
  <div><b>Calendrier</b><span>événements à venir visibles, message si le calendrier est vide</span></div>
  <div><b>Passation</b><span>comptes au nom de Néotisse, dossier listant accès, coûts et procédures</span></div>
</div>
<h2>Prochaines étapes</h2>
<ol class="next">
  <li><span>01</span><b>Les contenus</b>photos des ateliers, de l’équipe et des événements</li>
  <li><span>02</span><b>L’adresse</b>achat du nom de domaine neotisse.fr</li>
  <li><span>03</span><b>La prise en main</b>une séance ensemble, avec un guide</li>
  <li><span>04</span><b>La mise en ligne</b>puis un point mensuel sur les résultats</li>
</ol>
<p class="sign">Merci de votre confiance. <span>Louis Nourry, bLaNk</span></p>
'''))

CSS = (HERE / "style.css").read_text()
html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Néotisse · Dossier de réponse à l’appel d’offres</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{"".join(pages)}</body></html>'''

# Espaces insécables avant la ponctuation haute (hors balises)
def nbsp(text):
    parts = re.split(r"(<[^>]+>)", text)
    for i, p in enumerate(parts):
        if not p.startswith("<"):
            p = re.sub(r" ([:;?!»])", "\u00a0\\1", p)
            p = re.sub(r"« ", "«\u00a0", p)
            p = re.sub(r"(\d) (€|%|h\b|px)", "\\1\u00a0\\2", p)
            parts[i] = p
    return "".join(parts)

html = nbsp(html)
(HERE / "dossier.html").write_text(html)
print("html ok")
