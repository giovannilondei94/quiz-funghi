import { QuizRunner } from "@/components/quiz-runner";
import { buildQuizQuestions } from "@/lib/quiz-core";
import { loadQuizQuestions } from "@/lib/quiz-data";

export default async function QuizSessionPage() {
  const allQuestions = await loadQuizQuestions();
  const questions = buildQuizQuestions(allQuestions);

  return <QuizRunner mode="quiz" questions={questions} />;
}
