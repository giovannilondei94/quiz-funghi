import { ModeIntro } from "@/components/mode-intro";

export default function ImagesIntroPage() {
  return (
    <ModeIntro
      label="Riconoscimento immagini"
      title="Riconosci il fungo corretto"
      description="Modalità autonoma per allenarti sul riconoscimento visivo. Ogni immagine viene mostrata una alla volta con tre possibili nomi."
      startHref="/images/session"
      rules={[
        "9 immagini totali",
        "3 immagini per ciascun gruppo 2a, 2b, 2c",
        "3 opzioni di risposta per ogni immagine",
        "Promosso con almeno 6 risposte corrette",
      ]}
    />
  );
}
