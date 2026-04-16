import { SessionLink } from "@/components/session-link";

type ModeIntroProps = {
  title: string;
  label: string;
  description: string;
  startHref: string;
  rules?: string[];
};

export function ModeIntro({
  title,
  label,
  description,
  startHref,
  rules = [
    "30 domande totali",
    "3 risposte possibili per ogni domanda",
    "Massimo 3 errori per essere promosso",
    "Le domande vengono mostrate una alla volta",
  ],
}: ModeIntroProps) {
  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden px-5 py-4 sm:py-6">
      <div className="flex flex-1 flex-col">
        <div className="space-y-4">
          <SessionLink
            href="/"
            clearScope="all"
            className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Torna alla home
          </SessionLink>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {label}
            </p>
            <h1 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-slate-950 sm:mt-4 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              {description}
            </p>
          </section>

          <section className="rounded-[28px] bg-slate-950 p-5 text-slate-50 sm:p-6">
            <h2 className="text-lg font-semibold">Come funziona</h2>
            <ul className="mt-3 space-y-1.5 text-sm leading-6 text-slate-300 sm:mt-4 sm:space-y-3">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>

        <SessionLink
          href={startHref}
          clearScope="all"
          className="mt-4 inline-flex min-h-14 items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-700"
        >
          Inizia
        </SessionLink>
      </div>
    </main>
  );
}
