import { ModeIntro } from "@/components/mode-intro";

export default function ExamIntroPage() {
  return (
    <ModeIntro
      label="Esame completo"
      title="Prima fase dell'esame"
      description="Per ora l'esame completo coincide con il quiz a crocette: 30 domande, massimo 3 errori, una domanda alla volta. La struttura resta pronta per aggiungere in futuro la parte immagini."
      startHref="/exam/session"
    />
  );
}
