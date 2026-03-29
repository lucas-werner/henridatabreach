import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CRITERIA,
  DEFAULT_FORM,
  DEFAULT_SELECTIONS,
  DPC_VARIANTS,
  INCIDENT_FIELDS,
  LONG_FIELDS,
} from "./assessmentData";
import {
  buildNextSteps,
  formatDate,
  formatNumber,
  getSelectedOption,
  getSeverity,
} from "./utils";
import { APP_LOGO_URL } from "./branding";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Panel from "./components/Panel";
import CriterionCard from "./components/CriterionCard";
import SummaryPanel from "./components/SummaryPanel";
import HelpDialog from "./components/HelpDialog";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [comments, setComments] = useState(
    Object.fromEntries(CRITERIA.map((criterion) => [criterion.id, ""])),
  );
  const [selections, setSelections] = useState(DEFAULT_SELECTIONS);
  const [activeHelp, setActiveHelp] = useState(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const appRef = useRef(null);
  const heroRef = useRef(null);
  const assessmentRef = useRef(null);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setNavSolid(!entry.isIntersecting),
      { rootMargin: "-20% 0px 0px 0px", threshold: 0.2 },
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!appRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-item]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
          },
        });
      });

      gsap.utils.toArray("[data-card]").forEach((element, index) => {
        gsap.from(element, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: index * 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
          },
        });
      });
    }, appRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!assessmentRef.current) return undefined;

    gsap.fromTo(
      "#active-assessment-card",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );

    return undefined;
  }, [currentStep]);

  const result = useMemo(() => {
    const cb =
      selections.confidentiality +
      selections.integrity +
      selections.availability +
      selections.maliciousIntent;
    const score = selections.dpc * selections.ei + cb;

    return {
      cb,
      score,
      band: getSeverity(score),
      formula: `SE = (${selections.dpc}) x (${formatNumber(selections.ei)}) + (${formatNumber(cb)})`,
    };
  }, [selections]);

  const reportRows = useMemo(
    () =>
      CRITERIA.map((criterion) => {
        const selected = getSelectedOption(criterion.id, selections);
        return {
          label: criterion.title,
          shortLabel: criterion.shortLabel,
          score:
            criterion.id === "dpc"
              ? selections.dpc
              : selections[criterion.id],
          description:
            criterion.id === "dpc"
              ? `${DPC_VARIANTS[selections.dpcVariant].title} - ${selected?.description ?? ""}`
              : selected?.description ?? "",
          comment: comments[criterion.id] || "Geen toelichting toegevoegd.",
        };
      }),
    [comments, selections],
  );

  const nextSteps = useMemo(() => buildNextSteps(result.score), [result.score]);
  const activeCriterion = CRITERIA[currentStep];

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateSelection = (key, value) => {
    setSelections((current) => ({ ...current, [key]: value }));
  };

  const updateComment = (key, value) => {
    setComments((current) => ({ ...current, [key]: value }));
  };

  const moveToStep = (stepIndex) => {
    const nextIndex = Math.max(0, Math.min(CRITERIA.length - 1, stepIndex));
    setCurrentStep(nextIndex);
    assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const exportPdf = async () => {
    if (pdfBusy) return;

    setPdfBusy(true);
    try {
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      const footerY = pageHeight - 10;
      const charcoal = [48, 54, 53];
      const green = [180, 206, 55];
      const blue = [34, 66, 113];
      const gray = [117, 132, 139];
      const soft = [252, 250, 247];
      const pale = [247, 244, 241];
      const mint = [239, 246, 214];

      const clipText = (value, limit) => {
        if (!value) return "Niet ingevuld";
        if (value.length <= limit) return value;
        return `${value.slice(0, limit).trimEnd()}...`;
      };

      const imageToDataUrl = (src) =>
        new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            resolve({
              dataUrl: canvas.toDataURL("image/png"),
              width: image.width,
              height: image.height,
            });
          };
          image.onerror = () => reject(new Error(`Kon logo niet laden: ${src}`));
          image.src = src;
        });

      let logoImage = null;
      try {
        logoImage = await imageToDataUrl(APP_LOGO_URL);
      } catch (error) {
        console.error("Kon het logo niet laden voor PDF-export:", error);
      }

      const drawFooter = (pageNumber) => {
        pdf.setDrawColor(...green);
        pdf.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...gray);
        pdf.text("Severity assessment rapport", margin, footerY);
        pdf.text(`Pagina ${pageNumber} van 2`, pageWidth - margin, footerY, {
          align: "right",
        });
      };

      const drawHeader = (title, pageNumber) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(...green);
        pdf.text("ERNSTBEOORDELING DATALEK", margin, 14);

        pdf.setFontSize(22);
        pdf.setTextColor(...charcoal);
        pdf.text(title, margin, 24);

        if (logoImage) {
          try {
            const maxLogoWidth = 62;
            const maxLogoHeight = 12;
            const scale = Math.min(
              maxLogoWidth / logoImage.width,
              maxLogoHeight / logoImage.height,
            );
            const logoWidth = logoImage.width * scale;
            const logoHeight = logoImage.height * scale;

            pdf.addImage(
              logoImage.dataUrl,
              "PNG",
              pageWidth - margin - logoWidth,
              10,
              logoWidth,
              logoHeight,
            );
          } catch (error) {
            console.error("Kon het logo niet invoegen in de PDF:", error);
          }
        }
        pdf.setDrawColor(...green);
        pdf.line(margin, 30, pageWidth - margin, 30);
        drawFooter(pageNumber);
      };

      const drawBox = ({
        x,
        y,
        w,
        h,
        fill = [255, 255, 255],
        stroke = [224, 224, 224],
        radius = 5,
      }) => {
        pdf.setFillColor(...fill);
        pdf.setDrawColor(...stroke);
        pdf.roundedRect(x, y, w, h, radius, radius, "FD");
      };

      const writeBlockTitle = (title, x, y, color = [125, 140, 152]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...color);
        pdf.text(title.toUpperCase(), x, y);
      };

      const writeWrappedText = ({
        text,
        x,
        y,
        width,
        fontSize = 10,
        color = [45, 45, 45],
        fontStyle = "normal",
        lineHeight = 5,
        maxLines,
      }) => {
        pdf.setFont("helvetica", fontStyle);
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...color);
        let lines = pdf.splitTextToSize(text || "Niet ingevuld", width);
        if (maxLines && lines.length > maxLines) {
          const visible = lines.slice(0, maxLines);
          const last = visible[maxLines - 1];
          visible[maxLines - 1] = last.replace(/\.*$/, "").trimEnd() + "...";
          lines = visible;
        }
        pdf.text(lines, x, y);
        return lines.length * lineHeight;
      };

      const writeMetricCard = ({
        x,
        y,
        w,
        h,
        label,
        value,
        text,
        fill,
        textColor,
      }) => {
        const metricFontSize =
          String(value).length > 8 ? 14 : String(value).length > 4 ? 17 : 20;
        drawBox({ x, y, w, h, fill, stroke: fill });
        pdf.setTextColor(...textColor);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.text(label.toUpperCase(), x + 6, y + 8);
        pdf.setFontSize(metricFontSize);
        pdf.text(String(value), x + 6, y + 20);
        writeWrappedText({
          text,
          x: x + 6,
          y: y + 26,
          width: w - 12,
          fontSize: 9,
          color: textColor,
          lineHeight: 4.5,
          maxLines: 5,
        });
      };

      const currentSelections = {
        dpc: selections.dpc,
        ei: formatNumber(selections.ei),
        cb: formatNumber(result.cb),
        score: formatNumber(result.score),
      };
      const dpcVariant = DPC_VARIANTS[selections.dpcVariant];

      drawHeader("Rapportoverzicht", 1);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(...charcoal);
      pdf.setFontSize(28);
      pdf.text("Datalek", margin, 44);
      pdf.setTextColor(...green);
      pdf.setFont("times", "italic");
      pdf.setFontSize(30);
      pdf.text("ernstscore", margin, 56);

      writeWrappedText({
        text: "Dit rapport bundelt de incidentcontext, de gekozen criteria, de berekende ernstscore en de vervolgstappen op basis van de ENISA-methodologie.",
        x: margin,
        y: 64,
        width: 88,
        fontSize: 10,
        color: charcoal,
        lineHeight: 5,
        maxLines: 4,
      });

      writeMetricCard({
        x: 122,
        y: 38,
        w: 35,
        h: 34,
        label: "Classificatie",
        value: result.band.label,
        text: result.band.summary,
        fill: charcoal,
        textColor: [255, 255, 255],
      });

      writeMetricCard({
        x: 161,
        y: 38,
        w: 35,
        h: 34,
        label: "Eindscore",
        value: currentSelections.score,
        text: `SE = ${selections.dpc} x ${currentSelections.ei} + ${currentSelections.cb}`,
        fill: green,
        textColor: [255, 255, 255],
      });

      drawBox({
        x: margin,
        y: 84,
        w: 92,
        h: 78,
        fill: [255, 255, 255],
        stroke: [227, 233, 223],
      });
      writeBlockTitle("Managementsamenvatting", margin + 6, 92, blue);
      writeWrappedText({
        text: `De beoordeling gebruikt de formule SE = DPC x EI + CB. Voor dit incident is gekozen voor ${dpcVariant.title.toLowerCase()} met DPC ${selections.dpc}, EI ${currentSelections.ei} en CB ${currentSelections.cb}. Daarmee komt de ernstscore uit op ${currentSelections.score}, wat valt in de klasse ${result.band.label.toLowerCase()}.`,
        x: margin + 6,
        y: 100,
        width: 80,
        fontSize: 10,
        color: charcoal,
        lineHeight: 5,
        maxLines: 8,
      });

      drawBox({ x: 111, y: 84, w: 85, h: 78, fill: pale, stroke: pale });
      writeBlockTitle("Dossiergegevens", 117, 92, blue);
      const dossierFields = [
        ["Dossiertitel", clipText(form.dossierTitel, 80)],
        ["Organisatie", clipText(form.organisatie, 80)],
        ["Beoordelaar", clipText(form.beoordelaar, 80)],
        ["Datum incident", formatDate(form.datumIncident)],
        ["Datum beoordeling", formatDate(form.datumBeoordeling)],
      ];
      let dossierY = 101;
      dossierFields.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor(...gray);
        pdf.text(label.toUpperCase(), 117, dossierY);
        writeWrappedText({
          text: value,
          x: 117,
          y: dossierY + 3,
          width: 73,
          fontSize: 10,
          color: charcoal,
          lineHeight: 4.6,
          maxLines: 2,
        });
        dossierY += 13;
      });

      drawBox({ x: margin, y: 170, w: 88, h: 48, fill: pale, stroke: pale });
      writeBlockTitle("Incidentsamenvatting", margin + 6, 178, blue);
      writeWrappedText({
        text: clipText(form.samenvatting, 280),
        x: margin + 6,
        y: 186,
        width: 76,
        fontSize: 10,
        color: charcoal,
        lineHeight: 5,
        maxLines: 5,
      });

      drawBox({ x: 106, y: 170, w: 90, h: 48, fill: blue, stroke: blue });
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.text("METHODOLOGIE IN HET KORT", 112, 178);
      [
        "DPC bepaalt de gevoeligheid van data en context.",
        "EI meet hoe snel een betrokkene herkenbaar is.",
        "CB telt vertrouwelijkheid, integriteit, beschikbaarheid en kwaadwillende intentie op.",
      ].forEach((line, index) => {
        writeWrappedText({
          text: line,
          x: 112,
          y: 186 + index * 10,
          width: 78,
          fontSize: 9,
          color: [255, 255, 255],
          lineHeight: 4.5,
          maxLines: 2,
        });
      });

      pdf.addPage();
      drawHeader("Scoringsmatrix", 2);

      const tableX = margin;
      const tableY = 38;
      const tableWidth = contentWidth;
      const columns = [
        { key: "criterion", label: "Criterium", width: 38 },
        { key: "score", label: "Score", width: 18 },
        { key: "description", label: "Duiding", width: 48 },
        { key: "comment", label: "Motivering", width: tableWidth - 104 },
      ];
      const headerHeight = 10;

      pdf.setFillColor(...charcoal);
      pdf.roundedRect(tableX, tableY, tableWidth, headerHeight, 4, 4, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);

      let colX = tableX;
      columns.forEach((column) => {
        pdf.text(column.label.toUpperCase(), colX + 3, tableY + 6.5);
        colX += column.width;
      });

      let rowY = tableY + headerHeight;
      reportRows.forEach((row, index) => {
        const fills = index % 2 === 0 ? soft : pale;
        const description = clipText(row.description, 170);
        const comment = clipText(row.comment, 220);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const descriptionLines = pdf.splitTextToSize(description, columns[2].width - 6);
        const commentLines = pdf.splitTextToSize(comment, columns[3].width - 6);
        const rowLines = Math.max(2, descriptionLines.length, commentLines.length);
        const rowHeight = Math.min(28, 7 + rowLines * 4.2);

        pdf.setFillColor(...fills);
        pdf.setDrawColor(227, 233, 223);
        pdf.rect(tableX, rowY, tableWidth, rowHeight, "FD");

        let cellX = tableX;
        columns.forEach((column, columnIndex) => {
          if (columnIndex > 0) {
            pdf.line(cellX, rowY, cellX, rowY + rowHeight);
          }
          cellX += column.width;
        });

        pdf.setTextColor(...gray);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8);
        pdf.text(row.shortLabel, tableX + 3, rowY + 5);

        pdf.setTextColor(...charcoal);
        pdf.setFontSize(9);
        pdf.text(row.label, tableX + 3, rowY + 10);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(String(row.score).replace(".", ","), tableX + 41, rowY + 8);

        writeWrappedText({
          text: description,
          x: tableX + 59,
          y: rowY + 3,
          width: columns[2].width - 6,
          fontSize: 8.5,
          color: charcoal,
          lineHeight: 4,
          maxLines: 4,
        });

        writeWrappedText({
          text: comment,
          x: tableX + 107,
          y: rowY + 3,
          width: columns[3].width - 6,
          fontSize: 8.5,
          color: charcoal,
          lineHeight: 4,
          maxLines: 4,
        });

        rowY += rowHeight;
      });

      const cardsY = rowY + 8;
      writeMetricCard({
        x: margin,
        y: cardsY,
        w: 40,
        h: 34,
        label: "Eindscore",
        value: currentSelections.score,
        text: result.band.summary,
        fill: charcoal,
        textColor: [255, 255, 255],
      });

      writeMetricCard({
        x: 58,
        y: cardsY,
        w: 40,
        h: 34,
        label: "Classificatie",
        value: result.band.label,
        text: "Gebruik deze uitkomst als basis voor dossiervorming en meldplichtbeoordeling.",
        fill: green,
        textColor: [255, 255, 255],
      });

      drawBox({ x: 102, y: cardsY, w: 94, h: 34, fill: mint, stroke: mint });
      writeBlockTitle("Aanbevolen vervolgstappen", 108, cardsY + 8, blue);
      nextSteps.forEach((step, index) => {
        pdf.setFillColor(...green);
        pdf.circle(110, cardsY + 15 + index * 6, 0.9, "F");
        writeWrappedText({
          text: clipText(step, 120),
          x: 114,
          y: cardsY + 12 + index * 6,
          width: 76,
          fontSize: 8.5,
          color: charcoal,
          lineHeight: 4,
          maxLines: 1,
        });
      });

      drawBox({ x: margin, y: cardsY + 40, w: contentWidth, h: 24, fill: pale, stroke: pale });
      writeBlockTitle("Maatregelen en opvolging", margin + 6, cardsY + 48, blue);
      writeWrappedText({
        text: clipText(form.maatregelen, 420),
        x: margin + 6,
        y: cardsY + 52,
        width: contentWidth - 12,
        fontSize: 9,
        color: charcoal,
        lineHeight: 4.5,
        maxLines: 2,
      });

      const filename = (form.dossierTitel || "data-breach-severity-assessment")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "");
      pdf.save(`${filename || "data-breach-severity-assessment"}.pdf`);
    } catch (error) {
      console.error("PDF-generatie mislukt:", error);
      window.alert(
        `PDF-generatie mislukt: ${error?.message || "onbekende fout"}`,
      );
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div ref={appRef} className="relative overflow-x-hidden font-body text-dpo-black">
      <Navbar solid={navSolid} />

      <main className="mx-auto max-w-[1440px] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <HeroSection heroRef={heroRef} />

        <section
          id="intake"
          data-reveal
          className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <Panel
            eyebrow="Incidentgegevens"
            title="Context voor een geloofwaardige assessment"
            description="Leg de belangrijkste dossierinformatie vast. Deze gegevens worden ook opgenomen in het PDF-rapport."
          >
            <div className="grid gap-4 md:grid-cols-2">
              {INCIDENT_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-bold text-dpo-black/82">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(event) => updateForm(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-[1.4rem] border border-dpo-black/10 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-dpo-red/45 focus:bg-white"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 grid gap-4">
              {LONG_FIELDS.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-2 block text-sm font-bold text-dpo-black/82">
                    {field.label}
                  </span>
                  <textarea
                    rows={4}
                    value={form[field.key]}
                    onChange={(event) => updateForm(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-[1.6rem] border border-dpo-black/10 bg-white/80 px-4 py-3 text-sm leading-6 outline-none transition focus:border-dpo-red/45 focus:bg-white"
                  />
                </label>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Methodologie"
            title="Wat dit instrument doet"
            description="De tool vertaalt de ENISA-methodologie naar een compacte beoordelingsworkflow met motivering per criterium."
            accent="dark"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Wat is DPC?",
                  text: "DPC bepaalt hoe gevoelig de gelekte gegevens zijn en hoe zwaar de context meeweegt. Dit is de kern van de ernstinschatting.",
                },
                {
                  title: "Wat is EI?",
                  text: "EI meet hoe eenvoudig iemand op basis van de gelekte gegevens direct of indirect identificeerbaar is.",
                },
                {
                  title: "Wat is CB?",
                  text: "CB is de som van vertrouwelijkheid, integriteit, beschikbaarheid en kwaadwillende intentie. Deze factoren verhogen of verlagen de uiteindelijke ernst.",
                },
                {
                  title: "Hoe werkt de formule?",
                  text: "SE = DPC x EI + CB. Eerst beoordeel je de gegevenscontext en identificeerbaarheid, daarna tel je de aanvullende impactfactoren erbij op.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/82"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white text-dpo-red">
                      <Info className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-display text-sm uppercase tracking-[0.18em] text-white">
                        {item.title}
                      </p>
                      <p className="mt-2">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/82">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-white">
                Originele ENISA-bron
              </p>
              <p className="mt-2">
                Bekijk de oorspronkelijke methodologie:
                {" "}
                <a
                  href="https://www.enisa.europa.eu/sites/default/files/publications/Data%20breach%20severity%20methodology_1.0.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-display uppercase tracking-[0.12em] text-dpo-red transition hover:text-white"
                >
                  Data breach severity methodology 1.0
                </a>
              </p>
            </div>
          </Panel>
        </section>

        <section
          id="assessment"
          ref={assessmentRef}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_370px]"
        >
          <div className="space-y-6">
            <div className="rounded-[2.2rem] border border-white/60 bg-white/78 p-5 shadow-soft backdrop-blur sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.28em] text-dpo-red">
                    Assessment flow
                  </p>
                  <h2 className="mt-3 font-display text-[1.85rem] uppercase leading-[0.95] text-dpo-black sm:text-[2.3rem]">
                    Beantwoord één criterium per stap
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-dpo-black/70">
                    Gebruik de pijlen om naar de volgende of vorige vraag te gaan.
                    De rechterkolom blijft zichtbaar als live samenvatting.
                  </p>
                </div>
                <div className="rounded-full border border-dpo-black/10 bg-dpo-cream/80 px-4 py-2 font-display text-sm uppercase tracking-[0.18em] text-dpo-black">
                  Vraag {currentStep + 1} van {CRITERIA.length}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {CRITERIA.map((criterion, index) => {
                  const active = index === currentStep;
                  return (
                    <button
                      key={criterion.id}
                      type="button"
                      onClick={() => moveToStep(index)}
                      className={`magnetic rounded-[1.4rem] border px-4 py-3 text-left ${
                        active
                          ? "border-dpo-red bg-dpo-red text-white shadow-soft"
                          : "border-dpo-black/10 bg-white/80 text-dpo-black"
                      }`}
                    >
                      <p className="font-display text-[11px] uppercase tracking-[0.18em] opacity-70">
                        Stap {index + 1}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div id="active-assessment-card" key={activeCriterion.id}>
              <CriterionCard
                criterion={activeCriterion}
                selections={selections}
                comments={comments}
                updateSelection={updateSelection}
                updateComment={updateComment}
                openHelp={() => setActiveHelp(activeCriterion.id)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur">
              <button
                type="button"
                onClick={() => moveToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="magnetic inline-flex items-center gap-2 rounded-full border border-dpo-black/10 px-5 py-3 font-display text-sm uppercase tracking-[0.18em] text-dpo-black disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" />
                Vorige
              </button>

              <p className="text-sm text-dpo-black/68">
                {activeCriterion.title}
              </p>

              {currentStep < CRITERIA.length - 1 ? (
                <button
                  type="button"
                  onClick={() => moveToStep(currentStep + 1)}
                  className="magnetic inline-flex items-center gap-2 rounded-full bg-dpo-red px-5 py-3 font-display text-sm uppercase tracking-[0.18em] text-white"
                >
                  Volgende
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={exportPdf}
                  className="magnetic inline-flex items-center gap-2 rounded-full bg-dpo-red px-5 py-3 font-display text-sm uppercase tracking-[0.18em] text-white"
                >
                  {pdfBusy ? "PDF wordt opgebouwd..." : "Genereer rapport"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <SummaryPanel
              result={result}
              nextSteps={nextSteps}
              onExport={exportPdf}
              pdfBusy={pdfBusy}
            />
          </aside>
        </section>

      </main>

      <footer className="mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/60 bg-white/70 px-6 py-5 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 text-sm text-dpo-black/72 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.18em] text-dpo-gray">
                Data breach severity assessment
              </p>
              <p className="mt-2">
                © 2026 Lucas Noronha. All rights reserved.
              </p>
            </div>

            <div className="text-sm">
              Made by{" "}
              <a
                href="https://lucasnoronha.com"
                target="_blank"
                rel="noreferrer"
                className="font-display uppercase tracking-[0.12em] text-dpo-red transition hover:text-dpo-black"
              >
                Lucas Noronha
              </a>
            </div>
          </div>
        </div>
      </footer>

      <HelpDialog activeHelp={activeHelp} close={() => setActiveHelp(null)} />
    </div>
  );
}
