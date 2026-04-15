import { QuizRunner } from "@/components/quiz-runner";
import { buildQuizQuestions } from "@/lib/quiz-core";
import { loadQuizQuestions } from "@/lib/quiz-data";

export default async function ExamSessionPage() {
  const allQuestions = await loadQuizQuestions();
  const questions = buildQuizQuestions(allQuestions);

  return <QuizRunner mode="exam" questions={questions} />;
}
