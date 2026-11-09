import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { LatestReviews } from "@/components/home/LatestReviews";
import { NextEvent } from "@/components/home/NextEvent";
import { PartnersBand } from "@/components/home/PartnersBand";
import { Univers } from "@/components/home/Univers";
import { WorkshopTiles } from "@/components/home/WorkshopTiles";

// TODO(sanity) : titre et description depuis le singleton `page` « home ».
export const metadata: Metadata = {
  title: { absolute: "Médiation textile : 5 ateliers uniques | Néotisse" },
  description:
    "Néotisse anime des ateliers de médiation textile autour des savoir-faire anciens : filage, tissage et teinture végétale, pour les musées et structures culturelles.",
  alternates: { canonical: "/" },
};

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
