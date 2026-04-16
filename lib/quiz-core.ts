import type {
  ExamMode,
  QuestionGroup,
  QuizQuestion,
  QuizResult,
  WrongAnswerDetail,
} from "@/lib/types";

export const QUIZ_TOTAL_QUESTIONS = 30;
export const MAX_ERRORS_ALLOWED = 3;
export const QUIZ_RESULT_STORAGE_KEY = "quiz-funghi:last-result";
export const QUESTION_GROUPS: QuestionGroup[] = ["A", "B", "C", "D", "E"];
export const MIN_QUESTIONS_BY_GROUP: Record<QuestionGroup, number> = {
  A: 2,
  B: 2,
  C: 2,
  D: 1,
  E: 1,
};

export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

export function pickRandomItems<T>(items: T[], count: number): T[] {
  if (count <= 0) {
    return [];
  }

  if (count >= items.length) {
    return shuffleArray(items);
  }

  return shuffleArray(items).slice(0, count);
}

function normalizeQuestionText(value: string): string {
  return value
    .trim()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ");
}

function getQuestionSignature(question: QuizQuestion): string {
  return JSON.stringify({
    question: normalizeQuestionText(question.question),
    options: question.options.map((option) => normalizeQuestionText(option)),
    correctIndex: question.correctIndex,
  });
}

export function buildQuizQuestions(allQuestions: QuizQuestion[]): QuizQuestion[] {
  const uniqueQuestionsById = Array.from(
    new Map(allQuestions.map((question) => [question.id, question])).values(),
  );
  const uniqueQuestions = Array.from(
    new Map(
      uniqueQuestionsById.map((question) => [getQuestionSignature(question), question]),
    ).values(),
  );

  const selectedQuestions = QUESTION_GROUPS.flatMap((group) => {
    const minQuestionsForGroup = MIN_QUESTIONS_BY_GROUP[group];
    const questionsByGroup = uniqueQuestions.filter((question) => question.group === group);

    if (questionsByGroup.length < minQuestionsForGroup) {
      throw new Error(`Il gruppo ${group} non contiene abbastanza domande.`);
    }

    return pickRandomItems(questionsByGroup, minQuestionsForGroup);
  });

  const selectedIds = new Set(selectedQuestions.map((question) => question.id));
  const remainingQuestions = uniqueQuestions.filter(
    (question) => !selectedIds.has(question.id),
  );

  const missingQuestions = QUIZ_TOTAL_QUESTIONS - selectedQuestions.length;

  if (remainingQuestions.length < missingQuestions) {
    throw new Error("Il dataset non contiene abbastanza domande per costruire il quiz.");
  }

  return shuffleArray([
    ...selectedQuestions,
    ...pickRandomItems(remainingQuestions, missingQuestions),
  ]);
}

export function evaluateQuizResult(
  questions: QuizQuestion[],
  answers: Record<string, number>,
  mode: ExamMode,
): QuizResult {
  const wrongAnswers: WrongAnswerDetail[] = questions.flatMap((question) => {
    const selectedIndex = answers[question.id];

    if (selectedIndex === question.correctIndex) {
      return [];
    }

    return [
      {
        questionId: question.id,
        group: question.group,
        question: question.question,
        selectedAnswer:
          selectedIndex === undefined
            ? "Nessuna risposta selezionata"
            : question.options[selectedIndex],
        correctAnswer: question.options[question.correctIndex],
      },
    ];
  });

  const incorrectAnswers = wrongAnswers.length;

  const correctAnswers = questions.length - incorrectAnswers;

  return {
    mode,
    totalQuestions: questions.length,
    correctAnswers,
    incorrectAnswers,
    maxErrorsAllowed: MAX_ERRORS_ALLOWED,
    passed: incorrectAnswers <= MAX_ERRORS_ALLOWED,
    wrongAnswers,
  };
}
