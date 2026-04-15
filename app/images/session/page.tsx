import { ImageRunner } from "@/components/image-runner";
import { buildImageQuestions } from "@/lib/image-quiz-core";
import { imageQuestions } from "@/lib/image-quiz-data";

export const dynamic = "force-dynamic";

export default function ImagesSessionPage() {
  const questions = buildImageQuestions(imageQuestions);

  return <ImageRunner questions={questions} />;
}
