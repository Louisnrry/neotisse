import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Checkbox, FormLegal, FormMessage, TextArea, TextField } from "@/components/ui/Field";
import { Container, Section } from "@/components/ui/Layout";
import { Card, PhotoPlaceholder, Stars } from "@/components/ui/Media";
import { Eyebrow, Kicker, PullQuote, RuledTitle, Subtitle, ThreadHeading } from "@/components/ui/Typography";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "garance", hex: "#C8361F", usage: "Signature : boutons, liens, filets, fonds forts", text: "text-creme" },
  { token: "garance-dark", hex: "#9E2A17", usage: "Survols, variantes de tuiles, erreurs", text: "text-creme" },
  { token: "ink", hex: "#1E2B33", usage: "Texte, titres, pied de page", text: "text-creme" },
  { token: "creme", hex: "#FFF8F0", usage: "Texte sur rouge/encre, fonds doux", text: "text-ink" },
  { token: "pierre", hex: "#FBF9F7", usage: "Fonds de cartes, sections alternées", text: "text-ink" },
  { token: "filet", hex: "#ECE4DC", usage: "Bordures fines, séparateurs", text: "text-ink" },
  { token: "gris", hex: "#5B6670", usage: "Texte secondaire (fond clair uniquement)", text: "text-creme" },
  { token: "blanc", hex: "#FFFFFF", usage: "Fond par défaut", text: "text-ink" },
] as const;

const swatchBg: Record<(typeof colors)[number]["token"], string> = {
  garance: "bg-garance",
  "garance-dark": "bg-garance-dark",
  ink: "bg-ink",
  creme: "bg-creme",
  pierre: "bg-pierre",
  filet: "bg-filet",
  gris: "bg-gris",
  blanc: "bg-blanc",
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-filet py-s60 first:border-t-0">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Section spacing="large">
        <RuledTitle as="h1">Styleguide</RuledTitle>
        <p className="mx-auto mt-6 max-w-content text-center">
          Les briques du design de Néotisse V2, reprises du site WordPress. Page non indexée, réservée à l’équipe.
        </p>

        <Block title="Couleurs">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
            {colors.map((c) => (
              <li key={c.token} className="border border-filet">
                <div className={`${swatchBg[c.token]} ${c.text} flex h-28 items-end p-3 font-display text-xl font-normal`}>
                  {c.token}
                </div>
                <div className="p-3 text-small">
                  <p className="font-bold">{c.hex}</p>
                  <p className="text-gris">{c.usage}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Typographie">
          <div className="grid gap-6">
            <p className="font-display text-hero leading-[0.95] font-normal">Néotisse</p>
            <h2 className="text-h1">Titre H1 · Eagle Lake</h2>
            <h2>Titre H2 · l’art de faire revivre un savoir-faire</h2>
            <h3>Titre H3 · Ateliers démonstratifs</h3>
            <p className="max-w-[65ch]">
              Texte courant en Quicksand 300, interligne 1,65. Néotisse propose des ateliers de médiation autour des
              savoir-faire textiles anciens, du Néolithique au Moyen Âge : filage, tissage aux tablettes et teinture
              végétale. <strong>Texte en gras</strong> et <a href="#">lien garance</a>.
            </p>
            <p className="font-medium">Quicksand 500 · texte appuyé</p>
            <p className="font-semibold">Quicksand 600 · boutons, métadonnées</p>
            <p className="text-small text-gris">Texte secondaire 0,85rem en gris, sur fond clair uniquement.</p>
          </div>
        </Block>

        <Block title="Signes graphiques">
          <div className="grid gap-12">
            <RuledTitle as="p">Titre à filets</RuledTitle>
            <div className="grid gap-10 md:grid-cols-2">
              <ThreadHeading>Fil rouge sous un titre</ThreadHeading>
              <ThreadHeading center>Fil rouge centré</ThreadHeading>
            </div>
            <div>
              <Kicker>Surtitre</Kicker>
              <h3 className="mt-3">Atelier participatif</h3>
              <Subtitle className="mt-2">Chaque participant repart avec son galon</Subtitle>
            </div>
            <PullQuote cite="Citation">Faire revivre les gestes, pas seulement les objets.</PullQuote>
          </div>
        </Block>

        <Block title="Boutons sur fond blanc">
          <div className="flex flex-wrap items-center gap-4">
            <Button href="#">Prenez contact</Button>
            <Button href="#" variant="outline">
              Voir tous nos ateliers
            </Button>
            <Button variant="outline-garance">Plus d’avis</Button>
            <Button href="#" size="compact">
              Compact (navbar)
            </Button>
            <Button size="large" type="submit">
              Envoyer
            </Button>
            <Button disabled>Désactivé</Button>
          </div>
        </Block>
      </Section>

      <Section tone="garance">
        <RuledTitle as="p" tone="creme">
          Section sur fond rouge
        </RuledTitle>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <ThreadHeading tone="creme">Tenez-vous au courant</ThreadHeading>
            <p className="mt-6 max-w-[55ch]">
              Le rouge garance est utilisé franchement, en fond plein de section, comme le voulait la cliente.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#" variant="on-red">
                Voir tous nos événements
              </Button>
            </div>
          </div>
          <PhotoPlaceholder tone="garance-dark" className="aspect-[4/5] w-full max-w-[320px]" />
        </div>
      </Section>

      <Section tone="ink">
        <ThreadHeading tone="creme" center>
          Section sur fond encre
        </ThreadHeading>
        <div className="mt-8 flex justify-center">
          <Button href="#" variant="on-ink">
            Écrivez-nous
          </Button>
        </div>
      </Section>

      <Section>
        <Block title="Cadres photo provisoires">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <PhotoPlaceholder tone="garance" className="aspect-[4/5]" />
            <PhotoPlaceholder tone="ink" className="aspect-[4/5]" />
            <PhotoPlaceholder tone="garance-dark" className="aspect-[4/5]" />
            <PhotoPlaceholder tone="lin" className="aspect-[4/5]" />
          </div>
        </Block>

        <Block title="Carte avis">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[5, 4].map((r) => (
              <Card key={r} className="flex flex-col p-6">
                <h3 className="text-[1.5rem] leading-[1.2]">Un atelier passionnant</h3>
                <Stars rating={r} className="mt-2" />
                <p className="mt-3.5 flex-1 border-l-[3px] border-garance py-1 pl-5 leading-[1.7]">
                  Nos élèves ont adoré tisser leur galon. Explications claires et matériel superbe.
                </p>
                <p className="mt-4 text-small text-gris">par Claire, 4 novembre 2026</p>
              </Card>
            ))}
          </div>
        </Block>

        <Block title="Logos partenaires sur lin">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
            {["festival-lin.png", "gergovie.png", "tautavel.png"].map((logo) => (
              <div key={logo} className="border border-filet transition-colors duration-200 hover:border-garance">
                <div className="bg-lin grid h-[170px] place-items-center border-b-[3px] border-garance">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/partenaires/${logo}`} alt="" className="max-h-[104px] max-w-[80%] object-contain" />
                </div>
                <div className="p-5">
                  <h3>Nom du partenaire</h3>
                  <p className="mt-2 text-small">Ce que Néotisse y a animé.</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Formulaire">
          <Container width="reading" className="!px-0">
            <form className="grid gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField id="sg-nom" label="Nom" autoComplete="family-name" />
                <TextField id="sg-prenom" label="Prénom" autoComplete="given-name" />
              </div>
              <TextField id="sg-email" label="Adresse e-mail" type="email" error="Indiquez une adresse e-mail valide." defaultValue="claire@" />
              <TextField id="sg-objet" label="Objet" placeholder="Organiser un atelier, conférence, partenariat…" />
              <TextArea id="sg-projet" label="Votre projet" placeholder="Parlez-nous de votre projet : lieu, public, dates envisagées…" />
              <Checkbox id="sg-robot" label="Je confirme ne pas être un robot" />
              <FormMessage tone="ok">
                <strong>Merci, votre message est bien parti !</strong> Nous revenons vers vous très vite.
              </FormMessage>
              <FormMessage tone="error">Votre message n’a pas pu être envoyé. Réessayez dans un instant.</FormMessage>
              <div>
                <Button size="large" type="button">
                  Envoyer
                </Button>
              </div>
              <FormLegal>
                Les informations recueillies servent uniquement à répondre à votre demande.{" "}
                <a href="/politique-de-confidentialite/">En savoir plus sur vos données</a>
              </FormLegal>
            </form>
          </Container>
        </Block>
      </Section>
    </>
  );
}
