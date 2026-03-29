export const INCIDENT_FIELDS = [
  {
    key: "dossierTitel",
    label: "Dossiertitel",
    type: "text",
    placeholder: "Bijvoorbeeld: Datalek klantportaal maart 2026",
  },
  {
    key: "organisatie",
    label: "Organisatie",
    type: "text",
    placeholder: "Naam van de organisatie",
  },
  {
    key: "beoordelaar",
    label: "Beoordelaar",
    type: "text",
    placeholder: "Naam van de beoordelaar",
  },
  { key: "datumIncident", label: "Datum incident", type: "date" },
  { key: "datumBeoordeling", label: "Datum beoordeling", type: "date" },
];

export const LONG_FIELDS = [
  {
    key: "samenvatting",
    label: "Korte samenvatting van het incident",
    placeholder:
      "Beschrijf wat er is gebeurd, welke systemen betrokken waren en welke betrokkenen geraakt zijn.",
  },
  {
    key: "maatregelen",
    label: "Mitigerende maatregelen en opvolging",
    placeholder:
      "Beschrijf containment, herstel, communicatie en geplande vervolgstappen.",
  },
];

export const DPC_VARIANTS = {
  eenvoudig: {
    id: "eenvoudig",
    title: "Eenvoudige gegevens",
    base: 1,
    description:
      "Bijvoorbeeld naam, contactgegevens, professionele gegevens of basisadministratie.",
    scores: [
      {
        value: 1,
        label: "1",
        title: "Basisscore",
        description:
          "Alleen eenvoudige gegevens, zonder belangrijke verergerende factoren.",
      },
      {
        value: 2,
        label: "2",
        title: "Verhoogd met 1",
        description:
          "De gegevens maken extra profilering mogelijk, zoals sociale of financiële status.",
      },
      {
        value: 3,
        label: "3",
        title: "Verhoogd met 2",
        description:
          "Er kunnen aannames worden afgeleid over gevoelige kenmerken of kwetsbare context.",
      },
      {
        value: 4,
        label: "4",
        title: "Verhoogd met 3",
        description:
          "De combinatie raakt kwetsbare groepen, minderjarigen of een context met hoge impact.",
      },
    ],
  },
  gedrag: {
    id: "gedrag",
    title: "Gedragsgegevens",
    base: 2,
    description:
      "Bijvoorbeeld voorkeuren, gewoonten, locatie- of verkeersgegevens.",
    scores: [
      {
        value: 1,
        label: "1",
        title: "Verlaagd met 1",
        description: "Er is maar beperkt gedragsinzicht mogelijk.",
      },
      {
        value: 2,
        label: "2",
        title: "Basisscore",
        description:
          "Normale context voor gedragsgegevens zonder verdere verzwaring.",
      },
      {
        value: 3,
        label: "3",
        title: "Verhoogd met 1",
        description:
          "De gegevens laten een gedetailleerd gedragsprofiel toe.",
      },
      {
        value: 4,
        label: "4",
        title: "Verhoogd met 2",
        description:
          "Het gedragsprofiel geeft inzicht in gevoelige patronen of kwetsbaarheden.",
      },
    ],
  },
  financieel: {
    id: "financieel",
    title: "Financiële gegevens",
    base: 3,
    description:
      "Bijvoorbeeld transacties, bankafschriften, inkomsten, investeringen of creditcardgegevens.",
    scores: [
      {
        value: 1,
        label: "1",
        title: "Verlaagd met 2",
        description:
          "Zeer beperkt financieel inzicht of sterk verouderde informatie.",
      },
      {
        value: 2,
        label: "2",
        title: "Verlaagd met 1",
        description: "Beperkte of gedeeltelijke financiële informatie.",
      },
      {
        value: 3,
        label: "3",
        title: "Basisscore",
        description: "Reguliere financiële informatie met normaal risico.",
      },
      {
        value: 4,
        label: "4",
        title: "Verhoogd met 1",
        description:
          "Volledig of direct bruikbaar financieel profiel is zichtbaar.",
      },
    ],
  },
  bijzonder: {
    id: "bijzonder",
    title: "Bijzondere of gevoelige gegevens",
    base: 4,
    description:
      "Bijvoorbeeld gezondheidsgegevens, politieke voorkeur, religie, seksuele geaardheid of andere bijzondere categorieën.",
    scores: [
      {
        value: 1,
        label: "1",
        title: "Verlaagd met 3",
        description:
          "De informatie was reeds publiek gemaakt door de betrokkene of is nauwelijks nog relevant.",
      },
      {
        value: 2,
        label: "2",
        title: "Verlaagd met 2",
        description: "Alleen algemene of oude aannames zijn mogelijk.",
      },
      {
        value: 3,
        label: "3",
        title: "Verlaagd met 1",
        description:
          "Er is wel gevoeligheid, maar de context beperkt de impact.",
      },
      {
        value: 4,
        label: "4",
        title: "Basisscore",
        description:
          "Volwaardige bijzondere persoonsgegevens in een gevoelige context.",
      },
    ],
  },
};

export const CRITERIA = [
  {
    id: "dpc",
    shortLabel: "DPC",
    title: "Gegevensverwerkingscontext",
    subtitle:
      "Bepaal de gevoeligheid van de gegevens en de context waarin ze verwerkt werden.",
    intro:
      "DPC vormt de kern van de ENISA-beoordeling. Kies eerst het type gegevens en daarna de passende contextscore.",
    helpTitle: "Wat beoordeelt DPC?",
    helpBody:
      "De gegevensverwerkingscontext kijkt niet alleen naar het soort persoonsgegevens, maar ook naar de context. Eenvoudige gegevens kunnen zwaarder wegen als ze bijvoorbeeld profilering mogelijk maken. Gevoelige gegevens kunnen juist lager uitvallen als ze oud zijn of al publiek beschikbaar waren.",
    helpHow:
      "Kies eerst de hoofdcategorie die het best past bij het datalek. Kies daarna de score die het best beschrijft hoeveel extra risico uit de context volgt.",
    helpExample:
      "Voorbeeld: een lijst met namen en e-mailadressen is meestal eenvoudig. Als die lijst ook iemands financiële positie of kwetsbaarheid zichtbaar maakt, kan de score worden verhoogd.",
    type: "dpc",
  },
  {
    id: "ei",
    shortLabel: "EI",
    title: "Mate van identificeerbaarheid",
    subtitle:
      "Hoe eenvoudig kan een betrokkene aan de hand van de gelekte gegevens worden geïdentificeerd?",
    intro:
      "Hoe makkelijker een persoon direct of indirect te herkennen is, hoe hoger de score.",
    helpTitle: "Wat beoordeelt EI?",
    helpBody:
      "Ease of Identification meet hoe eenvoudig het is om de gegevens aan een concrete persoon te koppelen. Dat hangt af van directe identificatoren, de hoeveelheid context en of de organisatie zelf extra informatie beschikbaar heeft.",
    helpHow:
      "Kies een lage score als identificatie moeilijk blijft zonder aanvullende gegevens. Kies een hoge score als de betrokkene direct of met minimale inspanning kan worden herkend.",
    helpExample:
      "Voorbeeld: alleen een intern klantnummer zonder koppeltabel kan laag scoren. Naam plus e-mailadres of BSN maakt identificatie direct mogelijk en scoort hoog.",
    options: [
      {
        value: 0.25,
        label: "0,25",
        title: "Zeer moeilijk",
        description:
          "Identificatie is zeer lastig en vraagt veel aanvullende informatie.",
      },
      {
        value: 0.5,
        label: "0,50",
        title: "Moeilijk",
        description:
          "Identificatie is mogelijk, maar vergt aanvullende stappen of context.",
      },
      {
        value: 0.75,
        label: "0,75",
        title: "Redelijk eenvoudig",
        description:
          "Meerdere aanwijzingen maken identificatie waarschijnlijk.",
      },
      {
        value: 1,
        label: "1,00",
        title: "Direct identificeerbaar",
        description:
          "De betrokkene is direct of vrijwel direct herkenbaar.",
      },
    ],
  },
  {
    id: "confidentiality",
    shortLabel: "VERT",
    title: "Verlies van vertrouwelijkheid",
    subtitle:
      "Beoordeel in welke mate onbevoegden kennis hebben kunnen nemen van de gegevens.",
    intro:
      "Deze component meet de impact van ongeoorloofde openbaarmaking of inzage.",
    helpTitle: "Wat beoordeelt verlies van vertrouwelijkheid?",
    helpBody:
      "Deze factor kijkt naar de mate waarin persoonsgegevens zijn blootgesteld aan onbevoegden. Hoe groter of oncontroleerbaarder de verspreiding, hoe zwaarder de impact op de betrokkene.",
    helpHow:
      "Kies nul als er geen daadwerkelijke blootstelling was. Kies hogere scores wanneer gegevens bij een kleiner of groter publiek zijn terechtgekomen.",
    helpExample:
      "Voorbeeld: een bericht naar één verkeerde, bekende ontvanger is minder zwaar dan publicatie op een openbaar platform.",
    options: [
      {
        value: 0,
        label: "0,00",
        title: "Geen verlies",
        description:
          "Er is geen vast te stellen verlies van vertrouwelijkheid.",
      },
      {
        value: 0.25,
        label: "0,25",
        title: "Beperkte blootstelling",
        description:
          "De gegevens kwamen bij een klein en bekend aantal onbevoegden terecht.",
      },
      {
        value: 0.5,
        label: "0,50",
        title: "Brede blootstelling",
        description:
          "De gegevens bereikten meerdere onbevoegden of een grotere groep.",
      },
    ],
  },
  {
    id: "integrity",
    shortLabel: "INTEG",
    title: "Verlies van integriteit",
    subtitle:
      "Beoordeel of gegevens zijn gewijzigd, vervalst of anderszins onbetrouwbaar zijn geworden.",
    intro:
      "Deze component weegt de schade wanneer gegevens niet langer correct of volledig zijn.",
    helpTitle: "Wat beoordeelt verlies van integriteit?",
    helpBody:
      "Integriteit gaat over de juistheid en volledigheid van de gegevens. Als data ongeoorloofd zijn aangepast, kan dat directe gevolgen hebben voor beslissingen, processen en betrokkenen.",
    helpHow:
      "Kies nul als de gegevens ongewijzigd zijn gebleven. Kies een hogere score als er sprake is van wijzigingen met moeilijke of onmogelijke correctie.",
    helpExample:
      "Voorbeeld: een verkeerd aangepast rekeningnummer in een systeem kan leiden tot foutieve betalingen en scoort daardoor zwaarder.",
    options: [
      {
        value: 0,
        label: "0,00",
        title: "Geen verlies",
        description: "De gegevens zijn niet gewijzigd.",
      },
      {
        value: 0.25,
        label: "0,25",
        title: "Beperkte wijziging",
        description: "Er waren wijzigingen, maar herstel is relatief eenvoudig.",
      },
      {
        value: 0.5,
        label: "0,50",
        title: "Ernstige wijziging",
        description:
          "De gegevens zijn onbetrouwbaar geworden of niet goed herstelbaar.",
      },
    ],
  },
  {
    id: "availability",
    shortLabel: "BESCH",
    title: "Verlies van beschikbaarheid",
    subtitle:
      "Beoordeel of gegevens tijdelijk of permanent niet beschikbaar waren voor legitiem gebruik.",
    intro:
      "Beschikbaarheidsverlies kan zelfstandig al een ernstig effect hebben op betrokkenen.",
    helpTitle: "Wat beoordeelt verlies van beschikbaarheid?",
    helpBody:
      "Beschikbaarheid meet of gegevens bruikbaar en toegankelijk bleven voor het beoogde doel. Vooral bij zorg, dienstverlening of financiële processen kan tijdelijk verlies al ingrijpend zijn.",
    helpHow:
      "Kies nul wanneer data snel kon worden hersteld of via back-up beschikbaar bleef. Kies een hogere score bij langer of definitief verlies.",
    helpExample:
      "Voorbeeld: een back-up maakt snel herstel mogelijk en beperkt de score. Volledig verlies zonder herstelpad weegt zwaarder.",
    options: [
      {
        value: 0,
        label: "0,00",
        title: "Geen verlies",
        description:
          "De gegevens bleven beschikbaar of waren direct herstelbaar.",
      },
      {
        value: 0.25,
        label: "0,25",
        title: "Tijdelijk verlies",
        description:
          "De gegevens waren tijdelijk niet beschikbaar, met beperkte duur of impact.",
      },
      {
        value: 0.5,
        label: "0,50",
        title: "Ernstig verlies",
        description:
          "De gegevens zijn langdurig of definitief niet beschikbaar.",
      },
    ],
  },
  {
    id: "maliciousIntent",
    shortLabel: "INTENT",
    title: "Kwaadwillende intentie",
    subtitle:
      "Beoordeel of aanwijzingen bestaan voor opzettelijk of kwaadwillend handelen.",
    intro:
      "Kwaadwillende intentie kan de ernst verhogen omdat misbruik waarschijnlijker wordt.",
    helpTitle: "Wat beoordeelt kwaadwillende intentie?",
    helpBody:
      "Deze factor kijkt naar de omstandigheden van het incident. Een ongeluk zonder aanwijzingen voor misbruik is minder zwaar dan een doelgerichte aanval of bewuste exfiltratie.",
    helpHow:
      "Kies nul als het incident accidenteel of zonder misbruikindicaties was. Kies 0,50 als er duidelijke signalen zijn van opzet of aanvallend gedrag.",
    helpExample:
      "Voorbeeld: ransomware, credential theft of gerichte data-exfiltratie zijn sterke indicatoren van kwaadwillende intentie.",
    options: [
      {
        value: 0,
        label: "0,00",
        title: "Geen aanwijzing",
        description:
          "Het incident lijkt accidenteel of zonder aanwijzing voor opzet.",
      },
      {
        value: 0.5,
        label: "0,50",
        title: "Aanwijzing voor opzet",
        description:
          "Er zijn duidelijke signalen van bewust of kwaadwillend handelen.",
      },
    ],
  },
];

export const DEFAULT_FORM = {
  dossierTitel: "Data breach severity assessment",
  organisatie: "",
  beoordelaar: "",
  datumIncident: "",
  datumBeoordeling: new Date().toISOString().slice(0, 10),
  samenvatting: "",
  maatregelen: "",
};

export const DEFAULT_SELECTIONS = {
  dpcVariant: DPC_VARIANTS.eenvoudig.id,
  dpc: 1,
  ei: 0.25,
  confidentiality: 0,
  integrity: 0,
  availability: 0,
  maliciousIntent: 0,
};

export const SEVERITY_BANDS = [
  {
    min: 0,
    max: 2,
    label: "Laag",
    tone: "text-dpo-green",
    box: "border-dpo-green/30 bg-dpo-green/10",
    summary:
      "De waarschijnlijke impact voor betrokkenen is beperkt en doorgaans overkomelijk zonder ernstige blijvende schade.",
  },
  {
    min: 2,
    max: 3,
    label: "Middel",
    tone: "text-dpo-yellow",
    box: "border-dpo-yellow/40 bg-dpo-yellow/12",
    summary:
      "Betrokkenen kunnen merkbare hinder of stress ondervinden en extra inspanning nodig hebben om gevolgen te beperken.",
  },
  {
    min: 3,
    max: 4,
    label: "Hoog",
    tone: "text-dpo-rose",
    box: "border-dpo-rose/40 bg-dpo-rose/12",
    summary:
      "Er zijn serieuze gevolgen denkbaar, zoals financiële schade, reputatieverlies of aantasting van rechten en vrijheden.",
  },
  {
    min: 4,
    max: Number.POSITIVE_INFINITY,
    label: "Zeer hoog",
    tone: "text-dpo-red",
    box: "border-dpo-red/40 bg-dpo-red/10",
    summary:
      "De gevolgen kunnen ernstig, langdurig of moeilijk herstelbaar zijn en vragen om onmiddellijke opvolging en escalatie.",
  },
];
