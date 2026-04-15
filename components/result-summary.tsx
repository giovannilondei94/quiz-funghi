"use client";

import Link from "next/link";
import { useState } from "react";

import type { ExamMode, QuizResult } from "@/lib/types";

const LAST_RESULT_STORAGE_KEY = "quiz-funghi:last-result";

type ResultSummaryProps = {
  mode: ExamMode;
  totalQuestions: number;
  incorrectAnswers: number;
  maxErrors: number;
};

function getModeLabel(mode: ExamMode) {
  return mode === "exam" ? "Esame completo" : "Quiz";
}

export function ResultSummary({
  mode,
  totalQuestions,
  incorrectAnswers,
  maxErrors,
}: ResultSummaryProps) {
  const [wrongAnswers] = useState<QuizResult["wrongAnswers"]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const rawResult = window.sessionStorage.getItem(LAST_RESULT_STORAGE_KEY);

    if (!rawResult) {
      return [];
    }

    try {
      const parsedResult = JSON.parse(rawResult) as QuizResult;

      return parsedResult.mode === mode ? parsedResult.wrongAnswers ?? [] : [];
    } catch {
      window.sessionStorage.removeItem(LAST_RESULT_STORAGE_KEY);
      return [];
    }
  });
  const passed = incorrectAnswers <= maxErrors;
  const retryHref = mode === "exam" ? "/exam/session" : "/quiz/session";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <div className="flex flex-1 flex-col gap-8">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {getModeLabel(mode)}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            {passed ? "Promosso" : "Bocciato"}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Hai completato il test. Il risultato finale viene calcolato sulle{" "}
            {totalQuestions} domande della prova.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Errori</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">
                {incorrectAnswers}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Massimo consentito</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{maxErrors}</p>
            </div>
          </div>
        </section>

        {wrongAnswers.length > 0 ? (
          <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              Domande sbagliate
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
                  <h3 className="mt-2 text-base font-semibold leading-7 text-slate-950">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    La tua risposta:{" "}
                    <span className="font-medium text-rose-700">
                      {item.selectedAnswer}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Risposta corretta:{" "}
                    <span className="font-medium text-emerald-700">
                      {item.correctAnswer}
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
