import { ImageResultSummary } from "@/components/image-result-summary";
import { IMAGE_QUIZ_TOTAL } from "@/lib/image-quiz-core";

type ImageResultPageProps = {
  searchParams: Promise<{
    total?: string | string[];
    correct?: string | string[];
  }>;
};

function getSingleSearchParamValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default async function ImagesResultPage({
  searchParams,
}: ImageResultPageProps) {
  const params = await searchParams;
  const total = parseInteger(
    getSingleSearchParamValue(params.total),
    IMAGE_QUIZ_TOTAL,
  );
  const correct = parseInteger(getSingleSearchParamValue(params.correct), 0);

  return <ImageResultSummary total={total} correct={correct} />;
}
