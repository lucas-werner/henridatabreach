import { forwardRef } from "react";
import { DPC_VARIANTS } from "../assessmentData";
import { APP_LOGO_URL } from "../branding";
import { formatDate, formatNumber } from "../utils";

const TOTAL_PAGES = 2;

function clipText(value, limit) {
  if (!value) return "Niet ingevuld";
  if (value.length <= limit) return value;
  return `${value.slice(0, limit).trimEnd()}...`;
}

function ReportField({ label, value }) {
  return (
    <div className="rounded-[20px] border border-brabant-black/8 bg-white/80 p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
        {label}
      </p>
      <p className="mt-2 text-[14px] leading-6 text-brabant-black/80">{value}</p>
    </div>
  );
}

function ScoreSummaryCard({ label, value, tone = "dark", subtext }) {
  const tones = {
    dark: "bg-brabant-black text-white",
    light: "border border-brabant-black/10 bg-white text-brabant-black",
    accent: "bg-brabant-red text-white",
  };

  return (
    <div className={`rounded-[28px] px-6 py-5 ${tones[tone]}`}>
      <p
        className={`font-display text-[10px] uppercase tracking-[0.22em] ${
          tone === "light" ? "text-brabant-gray" : "text-white/55"
        }`}
      >
        {label}
      </p>
      <p className="mt-3 font-display text-[30px] uppercase leading-none">
        {value}
      </p>
      {subtext ? (
        <p
          className={`mt-3 text-[13px] leading-6 ${
            tone === "light" ? "text-brabant-black/72" : "text-white/78"
          }`}
        >
          {subtext}
        </p>
      ) : null}
    </div>
  );
}

function PageFrame({ pageNumber, title, children }) {
  return (
    <section
      data-report-page
      className="relative h-[1123px] overflow-hidden bg-[#fcfaf7] px-14 py-12 text-brabant-black"
    >
      <div className="flex items-start justify-between gap-10 border-b border-brabant-black/10 pb-7">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.28em] text-brabant-red">
            Ernstbeoordeling datalek
          </p>
          <h2 className="mt-3 font-display text-[32px] uppercase leading-none">
            {title}
          </h2>
        </div>

        <img
          src={APP_LOGO_URL}
          alt="Logo"
          className="h-16 w-auto object-contain"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="pb-20 pt-8">{children}</div>

      <div className="absolute bottom-10 left-14 right-14 flex items-center justify-between border-t border-brabant-black/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-brabant-black/52">
        <span>Severity assessment rapport</span>
        <span>Pagina {pageNumber} van {TOTAL_PAGES}</span>
      </div>
    </section>
  );
}

const ReportDocument = forwardRef(function ReportDocument(
  { form, result, rows, nextSteps, selections },
  ref,
) {
  const dpcVariant = DPC_VARIANTS[selections.dpcVariant];
  const dpcRow = rows.find((row) => row.shortLabel === "DPC");
  const eiRow = rows.find((row) => row.shortLabel === "EI");

  return (
    <div ref={ref} className="report-root bg-[#fcfaf7] text-brabant-black">
      <PageFrame pageNumber={1} title="Rapportoverzicht">
        <div className="grid grid-cols-[1.1fr_0.9fr] gap-8">
          <div>
            <p className="max-w-[420px] font-display text-[50px] uppercase leading-[0.9]">
              Datalek
            </p>
            <p className="font-display text-[56px] italic leading-[0.88] text-brabant-red">
              ernstscore
            </p>
            <p className="mt-6 max-w-[470px] text-[15px] leading-7 text-brabant-black/72">
              Dit rapport bundelt de vastgelegde incidentcontext, de gekozen
              criteria, de berekende ernstscore en de vervolgstappen op basis van
              de ENISA-methodologie.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <ScoreSummaryCard
                label="Classificatie"
                value={result.band.label}
                tone="dark"
                subtext={result.band.summary}
              />
              <ScoreSummaryCard
                label="Eindscore"
                value={formatNumber(result.score)}
                tone="accent"
                subtext={`Formule: SE = ${selections.dpc} x ${formatNumber(selections.ei)} + ${formatNumber(result.cb)}`}
              />
            </div>
          </div>

          <div className="rounded-[34px] border border-brabant-black/10 bg-white p-7 shadow-soft">
            <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
              Dossiergegevens
            </p>
            <div className="mt-5 grid gap-3">
              <ReportField
                label="Dossiertitel"
                value={clipText(form.dossierTitel, 90)}
              />
              <ReportField
                label="Organisatie"
                value={clipText(form.organisatie, 90)}
              />
              <ReportField
                label="Beoordelaar"
                value={clipText(form.beoordelaar, 90)}
              />
              <div className="grid grid-cols-2 gap-3">
                <ReportField
                  label="Datum incident"
                  value={formatDate(form.datumIncident)}
                />
                <ReportField
                  label="Datum beoordeling"
                  value={formatDate(form.datumBeoordeling)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-[1fr_0.95fr] gap-8">
          <div className="rounded-[34px] bg-white p-7 shadow-soft">
            <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
              Managementsamenvatting
            </p>
            <p className="mt-4 text-[14px] leading-7 text-brabant-black/78">
              De beoordeling gebruikt de formule <strong>SE = DPC x EI + CB</strong>.
              Voor dit incident is gekozen voor de gegevenscontext{" "}
              <strong>{dpcVariant.title.toLowerCase()}</strong> met een DPC-score
              van <strong>{selections.dpc}</strong>, een EI-score van{" "}
              <strong>{formatNumber(selections.ei)}</strong> en een CB-score van{" "}
              <strong>{formatNumber(result.cb)}</strong>. Daarmee komt de
              ernstscore uit op <strong>{formatNumber(result.score)}</strong>, wat
              valt in de klasse <strong>{result.band.label.toLowerCase()}</strong>.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <ReportField
                label="DPC"
                value={clipText(dpcRow?.description, 150)}
              />
              <ReportField
                label="EI"
                value={clipText(eiRow?.description, 150)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[34px] border border-brabant-black/10 bg-[#f5eee8] p-7">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
                Incidentsamenvatting
              </p>
              <p className="mt-4 text-[14px] leading-7 text-brabant-black/76">
                {clipText(form.samenvatting, 520)}
              </p>
            </div>

            <div className="rounded-[34px] bg-brabant-black p-7 text-white">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-white/55">
                Methodologie in het kort
              </p>
              <div className="mt-4 space-y-3 text-[13px] leading-6 text-white/80">
                <p>DPC bepaalt de gevoeligheid van data en context.</p>
                <p>EI meet hoe snel een betrokkene herkenbaar is.</p>
                <p>CB telt vertrouwelijkheid, integriteit, beschikbaarheid en kwaadwillende intentie op.</p>
                <p>Bandbreedtes: laag &lt; 2, middel 2-3, hoog 3-4, zeer hoog vanaf 4.</p>
              </div>
            </div>
          </div>
        </div>
      </PageFrame>

      <PageFrame pageNumber={2} title="Scoringsmatrix">
        <div className="rounded-[34px] border border-brabant-black/10 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-brabant-black/8 px-7 py-5">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-red">
                Overzicht criteria
              </p>
              <p className="mt-2 font-display text-[24px] uppercase leading-none">
                Matrix
              </p>
            </div>
            <div className="rounded-full border border-brabant-black/10 px-4 py-2 font-display text-[11px] uppercase tracking-[0.18em] text-brabant-black/60">
              {rows.length} criteria
            </div>
          </div>

          <div className="px-5 py-5">
            <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-[24px]">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[10%]" />
                <col className="w-[26%]" />
                <col className="w-[40%]" />
              </colgroup>
              <thead>
                <tr className="bg-brabant-black text-left text-[10px] font-display uppercase tracking-[0.2em] text-white/72">
                  <th className="rounded-tl-[20px] px-4 py-4">Criterium</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Duiding</th>
                  <th className="rounded-tr-[20px] px-4 py-4">Motivering</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.label}
                    className={index % 2 === 0 ? "bg-[#f7f2ed]" : "bg-[#fdfbf8]"}
                  >
                    <td className="px-4 py-4 align-top">
                      <p className="font-display text-[11px] uppercase tracking-[0.18em] text-brabant-gray">
                        {row.shortLabel}
                      </p>
                      <p className="mt-1 text-[13px] font-bold leading-5 text-brabant-black">
                        {row.label}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top font-display text-[18px] uppercase leading-none text-brabant-black">
                      {String(row.score).replace(".", ",")}
                    </td>
                    <td className="px-4 py-4 align-top text-[12px] leading-6 text-brabant-black/76">
                      {clipText(row.description, 170)}
                    </td>
                    <td className="px-4 py-4 align-top text-[12px] leading-6 text-brabant-black/76">
                      {clipText(row.comment, 220)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-5">
          <div>
            <ScoreSummaryCard
              label="Eindscore en duiding"
              value={formatNumber(result.score)}
              tone="dark"
              subtext={result.band.summary}
            />
          </div>

          <div>
            <ScoreSummaryCard
              label="Classificatie"
              value={result.band.label}
              tone="accent"
              subtext="Gebruik deze uitkomst als basis voor dossiervorming, meldplichtbeoordeling en opvolging."
            />
          </div>

          <div className="space-y-5">
            <div className="rounded-[34px] border border-brabant-black/10 bg-white p-7 shadow-soft">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
                Aanbevolen vervolgstappen
              </p>
              <div className="mt-4 space-y-4">
                {nextSteps.map((step) => (
                  <div
                    key={step}
                    className="flex gap-3 text-[13px] leading-6 text-brabant-black/76"
                  >
                    <span className="mt-[8px] h-2.5 w-2.5 shrink-0 rounded-full bg-brabant-red" />
                    <p>{clipText(step, 150)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-brabant-black/10 bg-[#f5eee8] p-7">
              <p className="font-display text-[10px] uppercase tracking-[0.22em] text-brabant-gray">
                Maatregelen en opvolging
              </p>
              <p className="mt-4 text-[13px] leading-6 text-brabant-black/74">
                {clipText(form.maatregelen, 360)}
              </p>
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  );
});

export default ReportDocument;
