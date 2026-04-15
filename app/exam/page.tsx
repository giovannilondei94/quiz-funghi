import { ModeIntro } from "@/components/mode-intro";

export default function ExamIntroPage() {
  return (
    <ModeIntro
      label="Esame completo"
      title="Quiz + riconoscimento immagini"
      description="L'esame completo si svolge in due fasi consecutive. Devi prima superare il quiz a crocette e solo dopo passerai alla prova finale di riconoscimento immagini."
      startHref="/exam/session"
      rules={[
        "Prima fase: quiz da 30 domande con meno di 3 errori",
        "Seconda fase: 9 immagini, 3 per ciascun gruppo 2a, 2b, 2c",
        "Accedi alla fase immagini solo se superi il quiz",
        "Esame superato solo se superi entrambe le prove",
      ]}
    />
  );
}
