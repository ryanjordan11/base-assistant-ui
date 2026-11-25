"use client";

import { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/shell";
import { SystemsIntro, HomeView } from "@/components/examples/base";

const INTRO_DURATION = 2600;

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = window.sessionStorage.getItem("app-intro-seen");

    if (prefersReducedMotion || alreadySeen) {
      setIsLoading(false);
      return;
    }

    const timer = window.setTimeout(() => setIsLoading(false), INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SystemsIntro onComplete={() => setIsLoading(false)} />;
  }

  return (
    <PageShell>
      <HomeView />
    </PageShell>
  );
}
