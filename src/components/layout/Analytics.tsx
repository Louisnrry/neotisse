"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

/** Google Analytics 4, chargé **uniquement** après acceptation des « Statistiques » (voir `src/lib/analytics.ts`). */
export function Analytics() {
  useEffect(() => initAnalytics(), []);
  return null;
}
