import { ModeIntro } from "@/components/mode-intro";

export default function QuizIntroPage() {
  return (
    <ModeIntro
      label="Modalità Quiz"
      title="Simulazione rapida"
      description="Allenati con una selezione casuale di 30 domande. Nessun feedback immediato: il risultato viene mostrato solo al termine della prova."
      startHref="/quiz/session"
    />
  );
}
