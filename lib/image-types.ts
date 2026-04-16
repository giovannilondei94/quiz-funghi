export type ImageQuestionGroup = "2a" | "2b" | "2c";

export type ImageQuestion = {
  id: string;
  group: ImageQuestionGroup;
  image: string;
  name: string;
};

export type ImageQuestionWithOptions = ImageQuestion & {
  options: [string, string, string];
};

export type ImageWrongAnswerDetail = {
  questionId: string;
  group: ImageQuestionGroup;
  image: string;
  selectedAnswer: string;
  correctAnswer: string;
};

export type ImageQuizResult = {
  total: number;
  correct: number;
  passed: boolean;
  wrongAnswers: ImageWrongAnswerDetail[];
};

export type ImageSessionKind = "images" | "exam-images";

export type ImageSessionState = {
  kind: ImageSessionKind;
  questions: ImageQuestionWithOptions[];
  currentIndex: number;
  answers: Record<string, string>;
  completed: boolean;
  usedNames: string[];
};
