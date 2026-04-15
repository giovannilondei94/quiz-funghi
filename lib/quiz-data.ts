import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { mockQuizQuestions } from "@/lib/mock-questions";
import { QUESTION_GROUPS, QUIZ_TOTAL_QUESTIONS } from "@/lib/quiz-core";
import type { QuestionGroup, QuizQuestion } from "@/lib/types";

type RawQuestion = Partial<QuizQuestion> & {
  options?: unknown;
};

function isValidGroup(value: unknown): value is QuestionGroup {
  return typeof value === "string" && QUESTION_GROUPS.includes(value as QuestionGroup);
}

function normalizeQuestion(question: RawQuestion): QuizQuestion | null {
  if (
    typeof question.id !== "string" ||
    !isValidGroup(question.group) ||
    typeof question.question !== "string" ||
    !Array.isArray(question.options) ||
    question.options.length !== 3 ||
    question.options.some((option) => typeof option !== "string") ||
    typeof question.correctIndex !== "number" ||
    question.correctIndex < 0 ||
    question.correctIndex > 2
  ) {
    return null;
  }

  return {
    id: question.id,
    group: question.group,
    question: question.question,
    options: [
      question.options[0] as string,
      question.options[1] as string,
      question.options[2] as string,
    ],
    correctIndex: question.correctIndex,
  };
}

function normalizeQuestions(questions: unknown): QuizQuestion[] {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions
    .map((question) => normalizeQuestion(question as RawQuestion))
    .filter((question): question is QuizQuestion => question !== null);
}

function mergeWithFallback(primaryQuestions: QuizQuestion[], group: QuestionGroup) {
  const fallbackQuestions = mockQuizQuestions.filter((question) => question.group === group);
  const questionsById = new Map(primaryQuestions.map((question) => [question.id, question]));

  for (const question of fallbackQuestions) {
    if (!questionsById.has(question.id)) {
      questionsById.set(question.id, question);
    }
  }

  return Array.from(questionsById.values());
}

async function readQuestionsFile(fileName: string): Promise<QuizQuestion[]> {
  try {
    const filePath = path.join(process.cwd(), "data", fileName);
    const rawContent = await readFile(filePath, "utf8");
    const normalizedContent = rawContent.trim().replace(/\]\s*\[/g, ",");

    return normalizeQuestions(JSON.parse(normalizedContent));
  } catch {
    return [];
  }
}

export async function loadQuizQuestions(): Promise<QuizQuestion[]> {
  const [groupA, groupB, groupC, groupD, groupE] = await Promise.all([
    readQuestionsFile("group-a.json"),
    readQuestionsFile("group-b.json"),
    readQuestionsFile("group-c.json"),
    readQuestionsFile("group-d.json"),
    readQuestionsFile("group-e.json"),
  ]);

  const groups: Record<QuestionGroup, QuizQuestion[]> = {
    A: mergeWithFallback(groupA, "A"),
    B: mergeWithFallback(groupB, "B"),
    C: mergeWithFallback(groupC, "C"),
    D: mergeWithFallback(groupD, "D"),
    E: mergeWithFallback(groupE, "E"),
  };

  const mergedQuestions = QUESTION_GROUPS.flatMap((group) => groups[group]);

  if (mergedQuestions.length >= QUIZ_TOTAL_QUESTIONS) {
    return mergedQuestions;
  }

  const existingIds = new Set(mergedQuestions.map((question) => question.id));
  const extraMockQuestions = mockQuizQuestions.filter((question) => !existingIds.has(question.id));

  return [...mergedQuestions, ...extraMockQuestions];
}
