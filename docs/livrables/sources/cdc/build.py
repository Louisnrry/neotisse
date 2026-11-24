import base64, re
from pathlib import Path

HERE = Path(__file__).parent
LOGO = base64.b64encode((HERE.parent / "logo" / "blank.png").read_bytes()).decode()
TOTAL = 11
DOC = "Néotisse · Cahier des charges finalisé"


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


def table(head, rows, cls="grid"):
    dark = ' class="dark"'
    th = "".join(f"<th{dark if h.startswith('!') else ''}>{h.lstrip('!')}</th>" for h in head)
    tr = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    return f'<table class="{cls}"><tr>{th}</tr>{tr}</table>'


P = []

# 1. Couverture
P.append(f'''
<section class="page cover">
  <div class="cover-top">
    <p class="kicker">Cahier des charges finalisé</p>
    <p class="kicker light">Novembre 2026</p>
  </div>
  <div class="cover-mid">
    {blocks("Néotisse", "xl")}
    <p class="cover-title">Site vitrine de l’association<br>Version WordPress et version vibe codée</p>
    <p class="cover-sub">Ce document décrit les deux sites tels qu’ils sont livrés.<br>Il remplace la version de travail du 2 novembre 2026.</p>
  </div>
  <div class="cover-bot">
    <div><p class="label">Cliente</p><p>Association Néotisse<br>Marie-Salomé Perrichon et Émilie Roma Sert</p></div>
    <div><p class="label">Agence</p><p>bLaNk · Louis Nourry<br>Validation : Travis, Camille, puis les clientes</p></div>
    <img src="data:image/png;base64,{LOGO}" alt="bLaNk">
  </div>
</section>''')

# 2. Sommaire + contexte et objectifs
P.append(page(2, "01 · Contexte et objectifs", f'''
<div class="toc">
  <p class="label">Sommaire</p>
  <ol>
    <li><span>01</span>Contexte et objectifs</li>
    <li><span>02</span>Publics cibles et besoins</li>
    <li><span>03</span>Arborescence et périmètre</li>
    <li><span>04</span>Spécifications fonctionnelles</li>
    <li><span>05</span>Spécifications techniques</li>
    <li><span>06</span>Contraintes, exigences, critères de réussite</li>
  </ol>
</div>
{h1("01", "Contexte et objectifs")}
<p class="label">Présentation du projet</p>
<p class="lead">Néotisse est une association loi 1901 à but non lucratif, basée à Montpellier et fondée en mai 2024. Elle anime des ateliers et des initiations aux savoir-faire textiles anciens (filage, tissage, teinture naturelle), surtout dans des musées, partout en France.</p>
<p>L’association est née d’un constat : peu d’activités font découvrir le textile des époques lointaines. Elle repose sur trois piliers : l’originalité, l’expertise scientifique, forgée par les études et les diplômes de ses fondatrices, et la flexibilité. L’équipe compte deux membres et deux bénévoles.</p>
<p class="label">Problématique</p>
<p>Néotisse n’a pas de site internet. Elle manque de visibilité auprès de ses partenaires (musées, festivals, centres universitaires, associations, collectivités, archéologues) et du grand public, et peine à rassurer des structures qui hésitent à faire appel à une jeune association sans présence en ligne.</p>
<div class="goal">
  <div><p class="label inv">Résultat attendu</p><p class="goal-n">1 <span>→</span> 3</p><p>événements par mois en moyenne</p></div>
  <div class="goal-list">
    <p><b>Objectif partenaires</b> : être visible, rassurer et obtenir plus de demandes d’atelier.</p>
    <p><b>Objectif grand public</b> : savoir quand et où a lieu le prochain événement.</p>
    <p><b>Objectif autonomie</b> : l’association met à jour son site seule, sans compétence technique.</p>
  </div>
</div>
'''))

# 3. Publics cibles et besoins
P.append(page(3, "02 · Publics cibles", f'''
{h1("02", "Publics cibles et besoins")}
<p>Âge visé : 35 à 50 ans. Les partenaires sont la cible prioritaire : ce sont eux qui programment les ateliers. Le grand public vient en second.</p>
<div class="cols persona">
  <div class="card">
    <p class="label">Persona 1 · Partenaire</p>
    <h3>Laurent, 47 ans</h3>
    <p class="meta">Directeur du musée archéologique municipal de Saintes · master en archéologie · budget médiation de 8 000 à 15 000 € par an</p>
    <p>Il construit sa programmation 3 à 6 mois à l’avance, sur recommandation ou par une recherche Google (« atelier tissage préhistoire »). Très pris, il refuse d’appeler un prestataire pour obtenir les informations de base.</p>
    <p class="fear"><b>Son frein</b> : le manque de professionnalisme d’une jeune structure sans présence en ligne.</p>
  </div>
  <div class="card">
    <p class="label">Persona 2 · Grand public</p>
    <h3>Sophie, 39 ans</h3>
    <p class="meta">Infirmière près de Sète · deux enfants dont un fils autiste · 50 à 100 € par mois pour les sorties</p>
    <p>Elle cherche le soir, sur son téléphone, des activités calmes et manuelles autour de l’histoire. Au-delà d’une heure de route, elle hésite.</p>
    <p class="fear"><b>Son frein</b> : une information introuvable ou un site lent et illisible sur mobile, et elle abandonne.</p>
  </div>
</div>
<h2>Des besoins aux réponses du site</h2>
{table(["Besoin", "Réponse du site"], [
    ["Avoir une vitrine professionnelle", "Un site vitrine soigné, sans vente, avec une identité propre"],
    ["Savoir qui sont les intervenantes", "Page À propos : démarche, engagements, équipe avec rôles et liens"],
    ["Voir qui leur a fait confiance", "Page Partenaires, bandeau de logos et derniers avis sur l’accueil"],
    ["Connaître l’offre d’ateliers", "Page Ateliers : les 5 formats, avec leurs repères"],
    ["Trouver le prochain événement", "Calendrier : liste À venir, vue par mois, fiche de chaque événement"],
    ["Contacter facilement l’association", "Page Contact : formulaire, téléphone, e-mail et FAQ de 10 questions"],
    ["Donner et lire des avis", "Livre d’or avec avis modérés avant publication"],
    ["Mettre à jour le site soi-même", "Un espace de gestion : CMS WordPress ou Studio Sanity"],
])}
'''))

# 4. Arborescence et périmètre
tree = '''
<div class="tree">
  <div class="root">Accueil <small>/</small></div>
  <div class="branches">
    <div><b>Ateliers</b><span>/ateliers-tissage-teinture/</span></div>
    <div><b>Calendrier</b><span>/calendrier-des-ateliers/</span></div>
    <div><b>Partenaires</b><span>/partenaires/</span></div>
    <div><b>Livre d’or</b><span>/livre-dor/</span></div>
    <div><b>À propos</b><span>/savoir-faire-textiles-anciens-a-propos/</span></div>
    <div class="inv"><b>Contact</b><span>/contact-organiser-un-atelier/</span></div>
  </div>
</div>'''
P.append(page(4, "03 · Arborescence et périmètre", f'''
{h1("03", "Arborescence et périmètre")}
<p>Un site à plat, sur deux niveaux : l’accueil mène aux six pages, toutes accessibles en un clic depuis le menu. Les adresses contiennent le mot-clé de chaque page et sont identiques sur les deux versions.</p>
{tree}
<p class="small muted">Pages annexes, non indexées : Mentions légales, Politique de confidentialité, et l’espace de gestion (/wp-admin/ ou /studio/).</p>
<h2>Les liens entre les pages</h2>
{table(["Depuis", "Mène vers"], [
    ["Ateliers", "Contact · Wikipédia"],
    ["Calendrier", "Contact · Ateliers · À propos · sites des lieux d’accueil"],
    ["Partenaires", "Contact · sites des partenaires"],
    ["À propos", "Contact · LinkedIn de Marie-Salomé"],
    ["Contact", "Livre d’or · Ateliers · e-mail · téléphone · Facebook · Instagram"],
    ["Livre d’or", "Page d’arrivée : on y lit et on y signe"],
], "grid compact")}
<div class="cols">
  <div class="box">
    <p class="label">Dans le périmètre</p>
    <ul class="ticks small">
      <li>Les 7 pages et les 2 pages légales</li>
      <li>Calendrier, livre d’or, partenaires, formulaire de contact, FAQ</li>
      <li>Espace de gestion pour l’association</li>
      <li>Identité visuelle, à partir du logo existant</li>
      <li>Référencement, RGPD, accessibilité, version mobile</li>
      <li>Reprise des contenus fournis par l’association</li>
    </ul>
  </div>
  <div class="box">
    <p class="label">Hors périmètre</p>
    <ul class="ticks small">
      <li><b>Vente en ligne</b> : site vitrine uniquement</li>
      <li><b>Page Actualités</b> : demandée au kickoff, remplacée par le calendrier ; évolution possible</li>
      <li><b>Site multilingue</b> : français uniquement</li>
      <li><b>Inscription aux ateliers</b> : elle se fait auprès du lieu d’accueil</li>
    </ul>
  </div>
</div>
'''))

# 5. Spécifications fonctionnelles : pages
P.append(page(5, "04 · Spécifications fonctionnelles", f'''
{h1("04", "Spécifications fonctionnelles")}
<p>Les deux versions offrent les mêmes pages et les mêmes fonctions. Le contenu de chaque page se modifie depuis l’espace de gestion.</p>
{table(["Page", "Contenu et rôle"], [
    ["Accueil", "Intro animée, grande photo, bandeau des logos partenaires qui défile, présentation de l’univers Néotisse, prochain événement, ateliers, 4 derniers avis, invitation au contact. <i>Rôle : faire forte impression et orienter.</i>"],
    ["Ateliers", "Index cliquable, puis les 5 formats : démonstratifs, participatif, enfants, conférences, expérimentation archéologique. Chacun a une accroche et des repères (format, public…). Bloc final « Des ateliers adaptés à vos projets ». <i>Rôle : le catalogue.</i>"],
    ["Calendrier", "Liste « À venir », calendrier par mois, fiche détaillée de chaque événement, encart pour les structures culturelles. <i>Rôle : donner le prochain événement.</i>"],
    ["Partenaires", "Les 7 partenaires : logo sur fond de lin, description, lien vers leur site. Bloc « Devenir l’un de nos partenaires ». <i>Rôle : la preuve sociale.</i>"],
    ["Livre d’or", "Note moyenne, avis publiés 3 par 3, formulaire « Signer le livre d’or ». <i>Rôle : la voix des participants.</i>"],
    ["À propos", "Démarche, 3 engagements (originalité, rigueur scientifique, flexibilité), médiation par le geste, équipe, « Travaillons ensemble ». <i>Rôle : incarner l’association.</i>"],
    ["Contact", "Coordonnées, formulaire « Écrivez-nous », FAQ de 10 questions en accordéon, lien vers le livre d’or. <i>Rôle : convertir une visite en demande d’atelier.</i>"],
    ["Pages légales", "Mentions légales, politique de confidentialité avec sommaire, bandeau cookies que l’on peut rouvrir."],
], "grid pages")}
<h2>Éléments communs</h2>
<div class="cols three feats">
  <div><b>Menu</b><span>Ateliers, Calendrier, Partenaires, Livre d’or, À propos et bouton Contact ; il se cache en descendant et revient en remontant ; menu burger sur mobile</span></div>
  <div><b>Pied de page</b><span>présentation courte, navigation, invitation au contact, e-mail, Instagram et Facebook, liens légaux</span></div>
  <div><b>Animations</b><span>apparition douce des titres et des images ; toutes désactivées si le visiteur le demande à son système</span></div>
</div>
'''))

# 6. Spécifications fonctionnelles : fonctions
P.append(page(6, "04 · Spécifications fonctionnelles", f'''
<h2>Le calendrier des événements</h2>
<div class="cols">
  <div><ul class="ticks small">
    <li>Chaque événement : titre, type (atelier, festival, conférence, autre), dates, lieu, horaires, texte, image, lien vers le lieu</li>
    <li><b>À venir</b> : les événements non passés, du plus proche au plus lointain</li>
    <li><b>Vue par mois</b> : navigation mois par mois, sélecteur pour aller directement à un mois et une année, bouton « Aujourd’hui » ; un événement sur plusieurs jours forme une barre continue</li>
  </ul></div>
  <div><ul class="ticks small">
    <li>Un clic ouvre la <b>fiche détaillée</b>, qui se ferme avec Échap</li>
    <li>Le <b>prochain événement</b> s’affiche aussi sur l’accueil</li>
    <li>Dates écrites en toutes lettres : « 9 et 10 octobre », « 3 au 7 octobre »</li>
    <li>Sans événement : « Aucun événement programmé pour le moment. »</li>
    <li>Sur mobile, seule la liste À venir s’affiche</li>
  </ul></div>
</div>
<h2>Le livre d’or</h2>
<div class="cols">
  <div><ul class="ticks small">
    <li>Formulaire : nom, e-mail, titre, note sur 5 étoiles, avis, case anti-robot</li>
    <li>Chaque avis arrive <b>« À modérer »</b> : l’association l’approuve ou le refuse</li>
  </ul></div>
  <div><ul class="ticks small">
    <li>Seuls le nom, le titre, la note et le texte sont publiés ; l’e-mail et l’adresse IP restent privés</li>
    <li>Note moyenne affichée ; les 4 derniers avis approuvés remontent sur l’accueil</li>
  </ul></div>
</div>
<h2>Le formulaire de contact</h2>
<div class="cols">
  <div><ul class="ticks small">
    <li>Champs obligatoires : nom, prénom, e-mail, objet, votre projet</li>
    <li>Messages d’erreur clairs, lisibles par les lecteurs d’écran</li>
  </ul></div>
  <div><ul class="ticks small">
    <li>Confirmation à l’écran : « Merci, votre message est bien parti ! »</li>
    <li>Le message arrive par e-mail à l’association, prêt à recevoir une réponse</li>
  </ul></div>
</div>
<h2>L’espace de gestion</h2>
{table(["L’association peut", "WordPress", "!Vibe codé"], [
    ["Ajouter ou modifier un événement", "Menu Événements, champs guidés", "Fiche « Événement » dans le Studio"],
    ["Valider ou refuser un avis", "Module de l’extension des avis", "Boutons « Approuver » / « Refuser »"],
    ["Ajouter un atelier, un partenaire, une question de FAQ", "Pages et types de contenu dédiés", "Fiches dédiées, glissées dans l’ordre voulu"],
    ["Modifier les textes et les images", "Clic sur le bloc dans la page", "Champs de la page dans le Studio"],
    ["Voir le site se mettre à jour", "À l’enregistrement", "À la publication, sans manipulation"],
], "grid admin")}
'''))

# 7. Spécifications techniques : comparatif
P.append(page(7, "05 · Spécifications techniques", f'''
{h1("05", "Spécifications techniques")}
<p>Les deux versions répondent aux mêmes exigences et aux mêmes critères de recette. Elles diffèrent par leurs outils.</p>
{table(["Brique", "Version WordPress", "!Version vibe codée"], [
    ["Socle", "WordPress, éditeur de blocs Gutenberg", "Next.js et React, en TypeScript"],
    ["Mise en forme", "Thème Twenty Twenty-Five, styles globaux", "Tailwind CSS, charte rangée dans un seul fichier"],
    ["Espace de gestion", "Administration WordPress", "Sanity Studio, en français, sur /studio"],
    ["Contenus métier", "Extension dédiée neotisse-core : types Événements et Partenaires", "Schémas Sanity : événements, ateliers, partenaires, équipe, FAQ, avis"],
    ["Formulaires", "WPForms Lite", "Routes serveur avec validation et anti-spam"],
    ["Avis", "WP Customer Reviews", "Avis dans Sanity, données privées à part"],
    ["Référencement", "Rank Math SEO", "Métadonnées, sitemap et données structurées intégrés"],
    ["Cookies", "Complianz", "Bandeau vibe codé aux couleurs du site"],
    ["Sécurité", "WP 2FA, mises à jour des extensions", "Aucune extension ; jeton d’écriture côté serveur uniquement"],
    ["Sauvegardes", "UpdraftPlus", "Historique des contenus Sanity, code versionné sur GitHub"],
    ["Animations", "CSS", "Motion, GSAP et Lenis (défilement doux)"],
    ["Hébergement", "OVH", "Netlify, avec HTTPS"],
    ["Polices", "Hébergées sur le site, sans Google Fonts", "Hébergées sur le site, sans Google Fonts"],
], "grid tech")}
<div class="box">
  <p class="label">Outils de la version vibe codée</p>
  <p class="small"><b>Claude Code</b> écrit le code à partir d’un cahier de règles tenu à jour ; le <b>MCP Figma</b> lit la maquette ; le <b>MCP Novamira</b> lit le site WordPress pour reprendre ses contenus et son rendu. Chaque page est relue et comparée au WordPress sur ordinateur et sur mobile.</p>
</div>
'''))

# 8. Identité graphique + SEO
sw = [("Rouge garance", "#C8361F", "#fff"), ("Garance foncé", "#9E2A17", "#fff"), ("Encre", "#1E2B33", "#fff"),
      ("Crème", "#FFF8F0", "#111"), ("Pierre", "#FBF9F7", "#111"), ("Gris", "#5B6670", "#fff")]
swatch = "".join(f'<div class="sw"><span style="background:{c}"></span><b>{n}</b><i>{c}</i></div>' for n, c, _ in sw)
P.append(page(8, "05 · Spécifications techniques", f'''
<h2>Identité graphique</h2>
<p>Les clientes avaient un logo mais pas de charte. Elles voulaient des couleurs naturelles, lisibles, « pas trop fades », avec des boutons d’action qui ressortent. Après la première maquette, jugée « pas assez flashy », le rouge garance est utilisé franchement.</p>
<div class="swatches">{swatch}</div>
<div class="cols">
  <div>
    <p class="label">Typographies</p>
    <ul class="ticks small">
      <li><b>Eagle Lake</b> pour les titres et l’intro animée</li>
      <li><b>Cormorant Garamond</b> pour la navigation, les citations et les dates</li>
      <li><b>Quicksand</b> pour le texte courant : légère et aérienne</li>
    </ul>
  </div>
  <div>
    <p class="label">Signes graphiques</p>
    <ul class="ticks small">
      <li>Titres encadrés de deux filets, fil rouge sous les titres</li>
      <li>Angles droits, sauf les boutons arrondis à 4 px</li>
      <li>Toile de lin derrière les logos partenaires</li>
      <li>Matières naturelles : lin, tissu, papier</li>
    </ul>
  </div>
</div>
<h2>Référencement</h2>
{table(["Page", "Mot-clé principal"], [
    ["Accueil", "médiation textile"], ["Ateliers", "tissage"], ["Calendrier", "calendrier des ateliers"],
    ["Partenaires", "partenaires"], ["Livre d’or", "livre d’or"], ["À propos", "savoir-faire textiles anciens"],
    ["Contact", "organiser un atelier"],
], "grid compact seo")}
<ul class="ticks small">
  <li>Un mot-clé de niche par page, sans que deux pages se concurrencent ; titre et description rédigés pour chacune</li>
  <li>Adresses parlantes, plan du site (sitemap), textes alternatifs sur toutes les images</li>
  <li>Données structurées : l’association, chaque événement, la FAQ et les avis</li>
  <li>Pages légales et espace de gestion exclus des moteurs de recherche</li>
</ul>
'''))

# 9. Contraintes et exigences
P.append(page(9, "06 · Contraintes et exigences", f'''
{h1("06", "Contraintes, exigences et critères de réussite")}
<h2>Contraintes</h2>
{table(["Contrainte", "Conséquence"], [
    ["Clientes peu à l’aise avec la technique", "Une technologie simple d’accès, une modération des avis en un clic, un parcours visiteur le plus simple possible"],
    ["Cible peu habituée aux sites modernes", "Navigation lisible, peu de boutons, un parcours logique vers le contact"],
    ["Budget associatif", "Coûts récurrents faibles, sans extension payante superflue"],
    ["Contenus fournis par l’association", "Textes et visuels partagés sur un Drive, mis à jour à la demande"],
    ["Validation par étapes", "Chaque étape validée par Travis et Camille, puis par les clientes"],
])}
<h2>Exigences</h2>
<div class="cols two-eng">
  <div><p class="label">Accessibilité</p><p class="small">RGAA 4.1 niveau AA, complété des critères WCAG 2.2 AA : structure sémantique, navigation au clavier, focus visible, contrastes, textes alternatifs, formulaires accessibles, zoom et mobile. Audit avant mise en ligne et déclaration d’accessibilité publiée.</p></div>
  <div><p class="label">Sécurité</p><p class="small">Base OWASP ASVS niveau 2 : HTTPS, en-têtes de sécurité, double authentification et moindres droits pour l’administration, sauvegardes, correctifs critiques sous 48 h, validation serveur et anti-spam des formulaires.</p></div>
  <div><p class="label">RGPD</p><p class="small">Données minimales et durées de conservation documentées (contact : 3 ans après le dernier échange ; statistiques : 14 mois). Consentement par catégorie de cookies, choix gardé 12 mois. Aucune ressource tierce chargée sans accord. Autorisations écrites pour les photos de mineurs, les avis et les logos partenaires.</p></div>
  <div><p class="label">Mesure d’audience</p><p class="small">Google Analytics 4, chargé uniquement après acceptation des statistiques. Il suit les visites, les envois de formulaire et les clics vers les inscriptions, repris dans le tableau de bord de suivi.</p></div>
</div>
'''))

# 10. Critères de réussite
crit = [
    ["Formulaire partenaire", "Facile à trouver, à comprendre et à remplir ; envoyé en 3 clics depuis l’accueil, avec une confirmation", "Test réel sur ordinateur et téléphone, vérification de l’e-mail reçu"],
    ["Navigation et lisibilité", "Menu clair, on sait où l’on est, retour facile à l’accueil ou au calendrier, textes lisibles sans effort", "Test avec 2 ou 3 personnes et contrôle des contrastes"],
    ["Calendrier", "Événements à venir visibles, navigation par mois et par année simple, message si le calendrier est vide", "Test avec une date passée et un calendrier sans événement"],
    ["Contenus", "Toutes les pages existent, les textes sont validés, les informations pratiques sont exactes, l’offre d’ateliers est visible", "Relecture avec la cliente"],
    ["Autonomie", "Néotisse ajoute un événement, valide un avis, ajoute un atelier et un partenaire en moins de 10 minutes au total", "Chronométrage pendant la prise en main"],
    ["Mobile", "Pas de zoom nécessaire, pas de défilement horizontal, boutons faciles à toucher", "Test à 375, 768 et 1440 px"],
    ["Performance et accessibilité", "Accueil affiché en moins de 3 secondes sur mobile, navigation au clavier, textes alternatifs, contrastes corrects", "PageSpeed Insights, WAVE et Lighthouse, test au clavier"],
    ["Sécurité", "HTTPS actif et formulaires protégés contre le spam", "Contrôle du navigateur et test d’envoi"],
    ["RGPD", "Bandeau cookies, mentions légales, politique de confidentialité, mentions sous les formulaires", "Relecture"],
    ["Mesure et passation", "Visites, envois de formulaire et clics vers les inscriptions remontent dans le tableau de bord ; comptes au nom de Néotisse ; dossier de passation listant accès, coûts et procédures", "Vérification après une semaine et relecture du dossier"],
]
P.append(page(10, "06 · Critères de réussite", f'''
<h2>Critères de réussite et recette</h2>
<p>La recette s’applique à l’identique aux deux versions. Un critère est validé quand le test décrit est réussi.</p>
{table(["Critère", "Attendu", "Comment on vérifie"], crit, "grid recette")}
'''))

# 11. Écarts et évolutions
P.append(page(11, "06 · Écarts, budget, évolutions", f'''
<h2>Ce qui a changé depuis la version du 2 novembre</h2>
<p>Ce cahier des charges décrit les sites livrés. Voici les écarts avec la version de travail, et pourquoi.</p>
{table(["Version du 2 novembre", "Version livrée", "Pourquoi"], [
    ["Une page de présentation des membres", "L’équipe est présentée dans la page À propos", "L’équipe compte deux membres : leur présentation trouve naturellement sa place dans À propos"],
    ["Une page Actualités (kickoff)", "Remplacée par le calendrier, qui annonce chaque événement", "Moins de contenu à tenir à jour pour l’association"],
    ["Mesure d’audience avec Matomo sans cookies", "Google Analytics 4, après consentement", "Outil plus répandu, tableaux de bord prêts à l’emploi"],
    ["« Les filtres du calendrier sont simples »", "Navigation par mois, sélecteur mois et année, bouton Aujourd’hui", "Une seule façon de filtrer, la plus naturelle : par date"],
    ["Un back office (vibe codé) et un CMS (WordPress)", "Sanity Studio et administration WordPress", "Même périmètre : événements, ateliers, partenaires, avis"],
], "grid ecarts")}
<h2>Budget</h2>
{table(["Poste", "WordPress", "!Vibe codé"], [
    ["Création et maintenance par l’agence", "0 €", "0 €"],
    ["Licence : extensions et CMS / outils IA", "40 € / mois", "20 € / mois"],
    ["Hébergement", "8 € / mois", "8 € / mois"],
    ["Nom de domaine en .fr", "9 € / an", "9 € / an"],
    ["<b>Total sur un an</b>", "<b>585 €</b>", "<b>345 €</b>"],
], "grid costs")}
<h2>Évolutions possibles</h2>
<div class="cols three feats">
  <div><b>Page Actualités</b><span>pour partager la vie de l’association entre deux événements</span></div>
  <div><b>Mots-clés élargis</b><span>viser « atelier tissage », « tissage aux tablettes », « teinture naturelle »</span></div>
  <div><b>Photos définitives</b><span>remplacer les derniers visuels provisoires dans l’espace de gestion</span></div>
</div>
'''))

CSS = (HERE.parent / "dossier" / "style.css").read_text() + (HERE / "extra.css").read_text()
html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Néotisse · Cahier des charges finalisé</title>
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


(HERE / "cdc.html").write_text(nbsp(html))
print("html ok")
