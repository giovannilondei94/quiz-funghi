"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  formatImageOptionLabel,
  IMAGE_PASS_THRESHOLD,
  IMAGE_RESULT_STORAGE_KEY,
} from "@/lib/image-quiz-core";
import type { ImageQuizResult } from "@/lib/image-types";

type ImageResultSummaryProps = {
  total: number;
  correct: number;
  label?: string;
  retryHref?: string;
};

export function ImageResultSummary({
  total,
  correct,
  label = "Riconoscimento immagini",
  retryHref = "/images/session",
}: ImageResultSummaryProps) {
  const [wrongAnswers] = useState<ImageQuizResult["wrongAnswers"]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const rawResult = window.sessionStorage.getItem(IMAGE_RESULT_STORAGE_KEY);

    if (!rawResult) {
      return [];
    }

    try {
      const parsedResult = JSON.parse(rawResult) as ImageQuizResult;
      return parsedResult.wrongAnswers ?? [];
    } catch {
      window.sessionStorage.removeItem(IMAGE_RESULT_STORAGE_KEY);
      return [];
    }
  });

  const passed = correct >= IMAGE_PASS_THRESHOLD;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <div className="flex flex-1 flex-col gap-8">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {label}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {passed ? "Promosso" : "Bocciato"}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Hai completato il test immagini. Il risultato finale viene calcolato su{" "}
            {total} riconoscimenti.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Corrette</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{correct}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Totale</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{total}</p>
            </div>
          </div>
        </section>

        {wrongAnswers.length > 0 ? (
          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Immagini sbagliate
            </h2>
            <div className="mt-5 space-y-4">
              {wrongAnswers.map((item) => (
                <article
                  key={item.questionId}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Gruppo {item.group}
                  </p>

                  <div className="mt-3 overflow-hidden rounded-[24px] bg-white">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={item.image}
                        alt={formatImageOptionLabel(item.correctAnswer)}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    La tua risposta:{" "}
                    <span className="font-medium text-rose-700">
                      {item.selectedAnswer === "Nessuna risposta selezionata"
                        ? item.selectedAnswer
                        : formatImageOptionLabel(item.selectedAnswer)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Risposta corretta:{" "}
                    <span className="font-medium text-emerald-700">
                      {formatImageOptionLabel(item.correctAnswer)}
                    </span>
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className="space-y-3 pb-2">
          <Link
            href={retryHref}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            Rifai il test
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </main>
  );
}
