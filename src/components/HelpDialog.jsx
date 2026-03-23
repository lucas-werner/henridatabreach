import { getCriterionById } from "../utils";

export default function HelpDialog({ activeHelp, close }) {
  const criterion = activeHelp ? getCriterionById(activeHelp) : null;
  if (!criterion) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-brabant-black/55 px-4 py-8 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-2xl rounded-[2.2rem] border border-white/60 bg-white p-6 shadow-panel sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.24em] text-brabant-red">
              {criterion.shortLabel}
            </p>
            <h3 className="mt-3 font-display text-[1.8rem] uppercase leading-[0.94] text-brabant-black">
              {criterion.helpTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={close}
            className="magnetic rounded-full border border-brabant-black/10 px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-brabant-black"
          >
            Sluiten
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm leading-7 text-brabant-black/78">
          <p>{criterion.helpBody}</p>
          <div className="rounded-[1.6rem] border border-brabant-black/10 bg-brabant-cream/75 p-5">
            <p className="font-display text-xs uppercase tracking-[0.22em] text-brabant-gray">
              Hoe kies je de score?
            </p>
            <p className="mt-2">{criterion.helpHow}</p>
          </div>
          <div className="rounded-[1.6rem] border border-brabant-red/14 bg-brabant-red/6 p-5">
            <p className="font-display text-xs uppercase tracking-[0.22em] text-brabant-red">
              Praktijkvoorbeeld
            </p>
            <p className="mt-2">{criterion.helpExample}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
