export type QuestionGroup = "A" | "B" | "C" | "D" | "E";

export type QuizQuestion = {
  id: string;
  group: QuestionGroup;
  question: string;
  options: [string, string, string];
  correctIndex: number;
};

export type ExamMode = "quiz" | "exam";

export type WrongAnswerDetail = {
  questionId: string;
  group: QuestionGroup;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
};

export type QuizResult = {
  mode: ExamMode;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  maxErrorsAllowed: number;
  passed: boolean;
  wrongAnswers: WrongAnswerDetail[];
};

export type QuizSessionState = {
  mode: ExamMode;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, number>;
  completed: boolean;
};
