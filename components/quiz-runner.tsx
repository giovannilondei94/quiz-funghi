"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { evaluateQuizResult } from "@/lib/quiz-core";
import type { ExamMode, QuizQuestion } from "@/lib/types";

type QuizRunnerProps = {
  mode: ExamMode;
  questions: QuizQuestion[];
};

const LAST_RESULT_STORAGE_KEY = "quiz-funghi:last-result";

export function QuizRunner({ mode, questions }: QuizRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showFinishWarning, setShowFinishWarning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const unansweredQuestionsCount = questions.reduce((count, question) => {
    return answers[question.id] === undefined ? count + 1 : count;
  }, 0);

  function handleSelectAnswer(optionIndex: number) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionIndex,
    }));
  }

  function finishTest() {
    const result = evaluateQuizResult(questions, answers, mode);
    window.sessionStorage.setItem(LAST_RESULT_STORAGE_KEY, JSON.stringify(result));

    const params = new URLSearchParams({
      mode: result.mode,
      total: String(result.totalQuestions),
      errors: String(result.incorrectAnswers),
      maxErrors: String(result.maxErrorsAllowed),
    });

    router.push(`/result?${params.toString()}`);
  }

  function handleNextQuestion() {
    if (!isLastQuestion) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    if (unansweredQuestionsCount > 0) {
      setShowFinishWarning(true);
      return;
    }

    finishTest();
  }

  function handlePreviousQuestion() {
    if (currentIndex === 0) {
      return;
    }

    setCurrentIndex((value) => value - 1);
  }

  return (
    <>
      <main className="mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden px-5 py-5 sm:py-6">
        <div className="mb-5 flex shrink-0 items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {mode === "exam" ? "Esame completo" : "Quiz"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Domanda {currentIndex + 1} di {questions.length}
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Esci
          </Link>
        </div>

        <div className="h-2 shrink-0 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <section className="mt-5 flex min-h-0 flex-1 flex-col rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
          <p className="shrink-0 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Gruppo {currentQuestion.group}
          </p>
          <h1 className="mt-4 shrink-0 text-xl font-semibold leading-7 tracking-tight text-slate-950 sm:text-[1.6rem] sm:leading-8">
            {currentQuestion.question}
          </h1>

          <div className="mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selectedAnswer === optionIndex;

              function selectOption() {
                handleSelectAnswer(optionIndex);
              }

              return (
                <button
                  key={`${currentQuestion.id}-${optionIndex}`}
                  type="button"
                  onClick={selectOption}
                  onTouchEnd={selectOption}
                  className={`flex min-h-[3.6rem] w-full cursor-pointer items-center gap-4 rounded-3xl border px-5 py-3.5 text-left text-base leading-6 transition active:scale-[0.99] select-none ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full bg-white transition ${
                        isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                  </span>
                  <span className="font-medium">{option}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 shrink-0 space-y-3 pt-4">
          <button
            type="button"
            onClick={handlePreviousQuestion}
            disabled={currentIndex === 0}
            className="inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 transition enabled:hover:border-slate-300 enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            Domanda precedente
          </button>

          <button
            type="button"
            onClick={handleNextQuestion}
            className="inline-flex min-h-[3.15rem] w-full items-center justify-center rounded-full bg-slate-950 px-6 text-base font-semibold text-white transition hover:bg-slate-800"
          >
            {isLastQuestion
              ? "Termina test"
              : selectedAnswer === undefined
                ? "Salta e continua"
                : "Conferma e continua"}
          </button>
        </div>
      </main>

      {showFinishWarning ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 px-5 pb-5 pt-10 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/80">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Attenzione
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Vuoi terminare il test?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {unansweredQuestionsCount} domande non sono state risposte. Puoi
              tornare indietro e completarle oppure terminare comunque il test.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={finishTest}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-base font-semibold text-white transition hover:bg-slate-800"
              >
                Termina comunque
              </button>
              <button
                type="button"
                onClick={() => setShowFinishWarning(false)}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Torna al test
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
