import { ClearSessionsOnMount } from "@/components/clear-sessions-on-mount";
import { SessionLink } from "@/components/session-link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-5 sm:py-6">
      <ClearSessionsOnMount />
      <div className="flex flex-1 flex-col">
        <div className="space-y-5">
          <section className="rounded-[32px] bg-slate-950 px-6 py-8 text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <h1 className="text-4xl font-semibold tracking-tight">
              Allenati per il tesserino funghi.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Simulazione d&apos;esame per l&apos;abilitazione alla raccolta e
              commerciazizzazione dei funghi epigei spontanei.
            </p>
          </section>

          <section className="rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
            <h2 className="text-lg font-semibold text-slate-950">Regole del test</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>30 domande con 3 opzioni di risposta</li>
              <li>Promosso con massimo 3 errori</li>
            </ul>
          </section>
        </div>

        <div className="mt-5 space-y-3">
          <SessionLink
            href="/exam"
            clearScope="all"
            className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            Esame completo
          </SessionLink>
          <SessionLink
            href="/quiz"
            clearScope="all"
            className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-amber-500 px-6 text-base font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            Quiz
          </SessionLink>
          <SessionLink
            href="/images"
            clearScope="all"
            className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-sky-600 px-6 text-base font-semibold text-white transition hover:bg-sky-500"
          >
            Riconoscimento immagini
          </SessionLink>
        </div>
      </div>
    </main>
  );
}
