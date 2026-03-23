import { Check, Info } from "lucide-react";
import { DPC_VARIANTS } from "../assessmentData";
import { getSelectedOption } from "../utils";

function ScoreButton({ active, label, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`magnetic rounded-[1.8rem] border p-5 text-left ${
        active
          ? "border-brabant-red bg-brabant-red text-white shadow-soft"
          : "border-brabant-black/10 bg-white/78 text-brabant-black"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl uppercase leading-none">{label}</p>
          <p className="mt-3 font-display text-sm uppercase tracking-[0.16em]">
            {title}
          </p>
          <p
            className={`mt-2 text-sm leading-6 ${
              active ? "text-white/82" : "text-brabant-black/68"
            }`}
          >
            {description}
          </p>
        </div>
        <div
          className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full border ${
            active
              ? "border-white/40 bg-white/12"
              : "border-brabant-black/12 bg-brabant-black/4"
          }`}
        >
          {active ? <Check className="h-4 w-4" /> : null}
        </div>
      </div>
    </button>
  );
}

export default function CriterionCard({
  criterion,
  selections,
  comments,
  updateSelection,
  updateComment,
  openHelp,
}) {
  const isDpc = criterion.type === "dpc";
  const variant = isDpc ? DPC_VARIANTS[selections.dpcVariant] : null;
  const selected = getSelectedOption(criterion.id, selections);

  return (
    <section
      data-card
      className="overflow-hidden rounded-[2.4rem] border border-white/60 bg-white/78 p-5 shadow-soft backdrop-blur sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brabant-black px-3 py-1 text-[11px] font-display uppercase tracking-[0.22em] text-white">
            {criterion.shortLabel}
          </div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[1.55rem] uppercase leading-none text-brabant-black sm:text-[1.9rem]">
              {criterion.title}
            </h3>
            <button
              type="button"
              onClick={openHelp}
              className="magnetic flex h-9 w-9 items-center justify-center rounded-full border border-brabant-red/18 bg-brabant-red/8 text-brabant-red"
              aria-label={`Meer uitleg over ${criterion.shortLabel}`}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-brabant-black/74">
            {criterion.subtitle}
          </p>
        </div>

        <div className="min-w-[280px] max-w-[360px] rounded-[1.8rem] border border-brabant-red/12 bg-brabant-cream/70 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brabant-red/14 bg-white text-brabant-red">
              <Info className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-xs uppercase tracking-[0.22em] text-brabant-red">
                Wat is {criterion.shortLabel}?
              </p>
              <p className="mt-2 text-sm leading-6 text-brabant-black/78">
                {criterion.helpBody}
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.3rem] border border-brabant-black/10 bg-white/80 p-4">
            <p className="font-display text-xs uppercase tracking-[0.22em] text-brabant-gray">
              Geselecteerde score
            </p>
            <p className="mt-2 font-display text-lg uppercase text-brabant-black">
              {isDpc ? `${variant.title} - ${selected?.label}` : selected?.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-brabant-black/72">
              {selected?.description}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-6 text-brabant-black/76">
        {criterion.intro}
      </p>

      {isDpc ? (
        <div className="mt-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {Object.values(DPC_VARIANTS).map((item) => {
              const active = item.id === selections.dpcVariant;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    updateSelection("dpcVariant", item.id);
                    updateSelection("dpc", item.base);
                  }}
                  className={`magnetic rounded-[1.8rem] border p-4 text-left ${
                    active
                      ? "border-brabant-red bg-brabant-red text-white shadow-soft"
                      : "border-brabant-black/10 bg-white/80 text-brabant-black"
                  }`}
                >
                  <p className="font-display text-sm uppercase leading-tight">
                    {item.title}
                  </p>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      active ? "text-white/85" : "text-brabant-black/68"
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {variant.scores.map((option) => (
              <ScoreButton
                key={`${criterion.id}-${option.value}`}
                active={selections.dpc === option.value}
                label={option.label}
                title={option.title}
                description={option.description}
                onClick={() => updateSelection("dpc", option.value)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {criterion.options.map((option) => (
            <ScoreButton
              key={`${criterion.id}-${option.value}`}
              active={selections[criterion.id] === option.value}
              label={option.label}
              title={option.title}
              description={option.description}
              onClick={() => updateSelection(criterion.id, option.value)}
            />
          ))}
        </div>
      )}

      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-brabant-black/82">
          Motivering
        </span>
        <textarea
          rows={4}
          value={comments[criterion.id]}
          onChange={(event) => updateComment(criterion.id, event.target.value)}
          placeholder="Leg vast waarom deze score passend is voor het incident."
          className="w-full rounded-[1.6rem] border border-brabant-black/10 bg-white/80 px-4 py-3 text-sm leading-6 outline-none transition focus:border-brabant-red/45 focus:bg-white"
        />
      </label>
    </section>
  );
}
