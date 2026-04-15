import { COMMON_NAMES } from "@/lib/image-common-names";
import type {
  ImageQuestion,
  ImageQuestionGroup,
  ImageQuestionWithOptions,
  ImageQuizResult,
  ImageWrongAnswerDetail,
} from "@/lib/image-types";

export const IMAGE_QUESTION_GROUPS: ImageQuestionGroup[] = ["2a", "2b", "2c"];
export const IMAGE_QUESTIONS_PER_GROUP = 3;
export const IMAGE_QUIZ_TOTAL = 9;
export const IMAGE_PASS_THRESHOLD = 6;
export const IMAGE_RESULT_STORAGE_KEY = "quiz-funghi:last-image-result";

export function normalizeImageName(value: string | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

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

export function generateImageOptions(
  question: ImageQuestion,
  allQuestions: ImageQuestion[],
): [string, string, string] {
  const correctAnswer = normalizeImageName(question.name);
  const distractorPool = Array.from(
    new Set(
      allQuestions
        .filter((item) => item.id !== question.id)
        .map((item) => normalizeImageName(item.name))
        .filter((item) => item.length > 0 && item !== correctAnswer),
    ),
  );

  if (distractorPool.length < 2) {
    throw new Error(
      `Distrattori insufficienti per l'immagine "${question.id}": servono almeno 2 nomi distinti alternativi.`,
    );
  }

  const distractors = pickRandomItems(distractorPool, 2);

  return shuffleArray([correctAnswer, distractors[0], distractors[1]]) as [
    string,
    string,
    string,
  ];
}

export function buildImageQuestions(
  allQuestions: ImageQuestion[],
): ImageQuestionWithOptions[] {
  const selectedQuestions = IMAGE_QUESTION_GROUPS.flatMap((group) => {
    const questionsByGroup = allQuestions.filter((question) => question.group === group);

    if (questionsByGroup.length < IMAGE_QUESTIONS_PER_GROUP) {
      throw new Error(
        `Il gruppo ${group} non contiene almeno ${IMAGE_QUESTIONS_PER_GROUP} immagini.`,
      );
    }

    return pickRandomItems(questionsByGroup, IMAGE_QUESTIONS_PER_GROUP);
  });

  return shuffleArray(selectedQuestions).map((question) => ({
    ...question,
    options: generateImageOptions(question, allQuestions),
  }));
}

export function evaluateImageResult(
  questions: ImageQuestionWithOptions[],
  answers: Record<string, string>,
): ImageQuizResult {
  const wrongAnswers: ImageWrongAnswerDetail[] = questions.flatMap((question) => {
    const selectedAnswer = answers[question.id];
    const normalizedSelectedAnswer = normalizeImageName(selectedAnswer);
    const normalizedCorrectAnswer = normalizeImageName(question.name);

    if (selectedAnswer !== undefined && normalizedSelectedAnswer === normalizedCorrectAnswer) {
      return [];
    }

    return [
      {
        questionId: question.id,
        group: question.group,
        image: question.image,
        selectedAnswer:
          selectedAnswer === undefined
            ? "Nessuna risposta selezionata"
            : normalizedSelectedAnswer,
        correctAnswer: normalizedCorrectAnswer,
      },
    ];
  });

  const correct = questions.length - wrongAnswers.length;

  return {
    total: questions.length,
    correct,
    passed: correct >= IMAGE_PASS_THRESHOLD,
    wrongAnswers,
  };
}

export function toScientificDisplayName(name: string): string {
  const parts = name.split(" ").map((part) => part.trim()).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  return parts
    .map((part, index) => {
      const lower = part.toLowerCase();

      if (index === 0) {
        return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
      }

      return lower;
    })
    .join(" ");
}

export function formatImageOptionLabel(name: string): string {
  const scientificName = toScientificDisplayName(name);

  if (!scientificName) {
    return "";
  }

  const commonName = COMMON_NAMES[scientificName];

  if (!commonName) {
    return scientificName;
  }

  return `${scientificName} (${commonName})`;
}
