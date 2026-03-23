import { AlertTriangle, Download, FileText } from "lucide-react";
import { formatNumber } from "../utils";

export default function SummaryPanel({
  result,
  nextSteps,
  onExport,
  pdfBusy,
}) {
  return (
    <div className="overflow-hidden rounded-[2.4rem] border border-brabant-black bg-brabant-black text-white shadow-panel">
      <div className="border-b border-white/10 p-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-display uppercase tracking-[0.22em] text-white/74">
          <FileText className="h-3.5 w-3.5" />
          Live result
        </div>
        <h3 className="font-display text-[1.7rem] uppercase leading-none">
          Ernstsamenvatting
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/74">
          {result.band.summary}
        </p>
      </div>

      <div className="space-y-5 p-6">
        <div className={`rounded-[1.8rem] border p-4 ${result.band.box}`}>
          <p className="font-display text-xs uppercase tracking-[0.22em] text-white/65">
            Eindscore
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="font-display text-4xl uppercase leading-none text-white">
              {formatNumber(result.score)}
            </p>
            <p className={`font-display text-lg uppercase ${result.band.tone}`}>
              {result.band.label}
            </p>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
          <p className="font-display text-xs uppercase tracking-[0.22em] text-white/55">
            Formule
          </p>
          <p className="mt-2 text-sm leading-6 text-white/85">
            {result.formula}
          </p>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.22em] text-white/55">
            <AlertTriangle className="h-4 w-4 text-brabant-red" />
            Aanbevolen vervolgstappen
          </div>
          <div className="mt-3 space-y-3">
            {nextSteps.map((step) => (
              <p key={step} className="text-sm leading-6 text-white/76">
                {step}
              </p>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="magnetic inline-flex w-full items-center justify-center gap-2 rounded-full bg-brabant-red px-5 py-3 font-display text-sm uppercase tracking-[0.18em] text-white"
        >
          <Download className="h-4 w-4" />
          {pdfBusy ? "PDF wordt opgebouwd..." : "Exporteer PDF"}
        </button>
      </div>
    </div>
  );
}
