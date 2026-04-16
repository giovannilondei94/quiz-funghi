import { SessionLink } from "@/components/session-link";

export default function ExamSuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
      <div className="flex flex-1 flex-col justify-center gap-8">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Esame completo
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Complimenti hai superato l&apos;esame !!! 
          </h1>
        </section>

        <div className="space-y-3 pb-2">
          <SessionLink
            href="/"
            clearScope="all"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-700"
          >
            Torna alla home
          </SessionLink>
          <SessionLink
            href="/exam/session"
            clearScope="all"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Rifai l&apos;esame
          </SessionLink>
        </div>
      </div>
    </main>
  );
}
