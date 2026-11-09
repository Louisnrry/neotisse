import type { Metadata } from "next";
import { pageMetadata } from "@/sanity/lib/metadata";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { LatestReviews } from "@/components/home/LatestReviews";
import { NextEvent } from "@/components/home/NextEvent";
import { PartnersBand } from "@/components/home/PartnersBand";
import { Univers } from "@/components/home/Univers";
import { WorkshopTiles } from "@/components/home/WorkshopTiles";
import { getHomePage } from "@/sanity/queries/home";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomePage();
  return pageMetadata(seo, {
    title: "Médiation textile : 5 ateliers uniques | Néotisse",
    description:
      "Néotisse anime des ateliers de médiation textile autour des savoir-faire anciens : filage, tissage et teinture végétale, pour les musées et structures culturelles.",
    canonical: "/",
  });
}

export default function HomePage() {
  return (
    <>
      <Intro />
      <Hero />
      <PartnersBand />
      <Univers />
      <NextEvent />
      <WorkshopTiles />
      <LatestReviews />
      <ContactCta />
    </>
  );
}
