import { CRITERIA, DPC_VARIANTS, SEVERITY_BANDS } from "./assessmentData";

export function formatNumber(value) {
  return value.toFixed(2).replace(".", ",");
}

export function formatDate(value) {
  if (!value) return "Niet ingevuld";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" }).format(date);
}

export function getCriterionById(id) {
  return CRITERIA.find((criterion) => criterion.id === id);
}

export function getSelectedOption(criterionId, selections) {
  if (criterionId === "dpc") {
    const variant = DPC_VARIANTS[selections.dpcVariant];
    return variant.scores.find((score) => score.value === selections.dpc);
  }

  const criterion = getCriterionById(criterionId);
  return criterion.options.find((option) => option.value === selections[criterionId]);
}

export function getSeverity(score) {
  return (
    SEVERITY_BANDS.find((band) => score >= band.min && score < band.max) ??
    SEVERITY_BANDS.at(-1)
  );
}

export function buildNextSteps(score) {
  if (score >= 4) {
    return [
      "Escaleren naar crisis- of incidentmanagement en direct bestuur of privacyverantwoordelijke informeren.",
      "Meldplicht en communicatie richting toezichthouder en betrokkenen met voorrang beoordelen.",
      "Technische containment, forensische analyse en aanvullende monitoring onmiddellijk opschalen.",
    ];
  }

  if (score >= 3) {
    return [
      "Incidentdossier prioriteren en aanvullende feitenverzameling afronden.",
      "Rechten en vrijheden van betrokkenen expliciet toetsen en communicatietraject voorbereiden.",
      "Corrigerende maatregelen en loggingreview versneld uitvoeren.",
    ];
  }

  if (score >= 2) {
    return [
      "Nadere impactanalyse uitvoeren en mitigerende acties documenteren.",
      "Besluit over meldplicht expliciet vastleggen met motivering.",
      "Nazorg en monitoring van betrokken systemen opnemen in het dossier.",
    ];
  }

  return [
    "Dossier vastleggen met motivering van de lage ernstinschatting.",
    "Herstelmaatregelen afronden en controleren of het incident volledig is afgedicht.",
    "Lessen uit het incident opnemen in procesverbetering en awareness.",
  ];
}
