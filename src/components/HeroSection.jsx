import { ArrowDown, ChevronRight } from "lucide-react";
import { APP_LOGO_URL } from "../branding";

export default function HeroSection({ heroRef }) {
  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[90vh] overflow-hidden rounded-[2.6rem] border border-white/70 bg-brabant-black text-white shadow-panel"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(221,0,0,0.35),transparent_28%),linear-gradient(180deg,rgba(29,29,27,0.08),rgba(29,29,27,0.82)_45%,rgba(29,29,27,0.98)_100%)]" />

      <div className="relative flex min-h-[90vh] flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div
              data-hero-item
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur"
            >
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-brabant-red" />
              ENISA severity methodiek
            </div>
          </div>

          <div
            data-hero-item
            className="hidden items-center justify-center rounded-[2rem] border border-white/15 bg-white/95 p-5 shadow-soft backdrop-blur lg:flex lg:min-h-[112px] lg:min-w-[280px]"
          >
            <img
              src={APP_LOGO_URL}
              alt="Logo van de assessment-tool"
              className="h-12 w-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="max-w-4xl">
          <p
            data-hero-item
            className="mb-4 font-display text-sm uppercase tracking-[0.32em] text-white/65"
          >
            Nederlandstalige severity assessment-tool
          </p>
          <h1
            data-hero-item
            className="max-w-4xl font-display text-[2.8rem] uppercase leading-[0.92] sm:text-[4.5rem] lg:text-[6.5rem]"
          >
            Beoordeel de
          </h1>
          <div
            data-hero-item
            className="font-display text-[3.4rem] italic leading-[0.88] text-brabant-red sm:text-[5.4rem] lg:text-[8.2rem]"
          >
            ernst.
          </div>
          <p
            data-hero-item
            className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg"
          >
            Een moderne assessment-omgeving voor datalekken op basis van de
            ENISA-methodologie. Kies scores, motiveer je afwegingen en
            exporteer een volledig Nederlandstalig rapport.
          </p>

          <div data-hero-item className="mt-8 flex flex-wrap gap-3">
            <a
              href="#assessment"
              className="magnetic inline-flex items-center gap-2 rounded-full bg-brabant-red px-6 py-3 font-display text-sm uppercase tracking-[0.18em] text-white shadow-soft"
            >
              Start beoordeling
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#intake"
              className="magnetic inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-display text-sm uppercase tracking-[0.18em] text-white backdrop-blur"
            >
              Bekijk context
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
