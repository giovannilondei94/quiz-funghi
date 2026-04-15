import { MAX_ERRORS_ALLOWED, QUIZ_TOTAL_QUESTIONS } from "@/lib/quiz-core";
import { ResultSummary } from "@/components/result-summary";
import type { ExamMode } from "@/lib/types";

type ResultPageProps = {
  searchParams: Promise<{
    mode?: string;
    total?: string;
    errors?: string;
    maxErrors?: string;
  }>;
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const params = await searchParams;
  const mode: ExamMode = params.mode === "exam" ? "exam" : "quiz";
  const totalQuestions = Number(params.total ?? QUIZ_TOTAL_QUESTIONS);
  const incorrectAnswers = Number(params.errors ?? totalQuestions);
  const maxErrors = Number(params.maxErrors ?? MAX_ERRORS_ALLOWED);

  return (
    <ResultSummary
      mode={mode}
      totalQuestions={totalQuestions}
      incorrectAnswers={incorrectAnswers}
      maxErrors={maxErrors}
    />
  );
}
