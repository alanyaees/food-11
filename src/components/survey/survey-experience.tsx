"use client";

import { useCallback, useState } from "react";
import { SurveyForm } from "@/components/survey/survey-form";
import { SurveyResults } from "@/components/survey/survey-results";
import type { SurveyResultsPayload } from "@/lib/survey";

export function SurveyExperience({
  initialResults,
}: {
  initialResults: SurveyResultsPayload;
}) {
  const [refreshToken, setRefreshToken] = useState(0);
  const [seed, setSeed] = useState(initialResults);

  const onSubmitted = useCallback((results?: SurveyResultsPayload) => {
    if (results) setSeed(results);
    setRefreshToken((value) => value + 1);
  }, []);

  return (
    <div className="container-full grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-start lg:gap-12 lg:py-16">
      <div className="min-w-0">
        <SurveyForm onSubmitted={onSubmitted} />
      </div>
      <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
        <SurveyResults initial={seed} refreshToken={refreshToken} />
      </div>
    </div>
  );
}
