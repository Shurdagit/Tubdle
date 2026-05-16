// ─── TYPER ───────────────────────────────────────────────────────────────────
export type Station = {
  name: string;
  lines: string[];
  distTC: number;
  distTC2?: number;
  underground: boolean;
  opened?: number;
};

// ─── LINJEFÄRGER ─────────────────────────────────────────────────────────────
export const LINE_COLORS: Record<string, string> = {
  T10: '#1565C0', T11: '#1565C0',
  T13: '#E53935', T14: '#E53935',
  T17: '#4CAF50', T18: '#4CAF50', T19: '#4CAF50',
};

// ─── STATIONER ────────────────────────────────────────────────────────────────
export const STATIONS: Station[] = [
  // Blå linjen
  { name: 'Kungsträdgården',     lines: ['T10','T11'],                           distTC:  1, underground: true  },
  { name: 'T-Centralen',         lines: ['T10','T11','T13','T14','T17','T18','T19'], distTC: 0, underground: true  },
  { name: 'Rådhuset',            lines: ['T10','T11'],                           distTC:  1, underground: true  },
  { name: 'Fridhemsplan',        lines: ['T10','T11','T17','T18','T19'],         distTC:  2, distTC2: 5, underground: true  },
  { name: 'Stadshagen',          lines: ['T10','T11'],                           distTC:  3, underground: true  },
  { name: 'Västra skogen',       lines: ['T10','T11'],                           distTC:  4, underground: true  },
  { name: 'Huvudsta',            lines: ['T10'],                                 distTC:  5, underground: true  },
  { name: 'Solna strand',        lines: ['T10'],                                 distTC:  6, underground: true  },
  { name: 'Sundbybergs centrum', lines: ['T10'],                                 distTC:  7, underground: true  },
  { name: 'Duvbo',               lines: ['T10'],                                 distTC:  8, underground: true  },
  { name: 'Rissne',              lines: ['T10'],                                 distTC:  9, underground: true  },
  { name: 'Rinkeby',             lines: ['T10'],                                 distTC: 10, underground: true  },
  { name: 'Tensta',              lines: ['T10'],                                 distTC: 11, underground: true  },
  { name: 'Hjulsta',             lines: ['T10'],                                 distTC: 12, underground: true  },
  { name: 'Solna centrum',       lines: ['T11'],                                 distTC:  5, underground: true  },
  { name: 'Näckrosen',           lines: ['T11'],                                 distTC:  6, underground: true  },
  { name: 'Hallonbergen',        lines: ['T11'],                                 distTC:  7, underground: true  },
  { name: 'Kista',               lines: ['T11'],                                 distTC:  8, underground: false },
  { name: 'Husby',               lines: ['T11'],                                 distTC:  9, underground: true  },
  { name: 'Akalla',              lines: ['T11'],                                 distTC: 10, underground: true  },
  // Röda linjen
  { name: 'Mörby centrum',       lines: ['T14'],                                 distTC:  7, underground: true  },
  { name: 'Danderyds sjukhus',   lines: ['T14'],                                 distTC:  6, underground: true  },
  { name: 'Bergshamra',          lines: ['T14'],                                 distTC:  5, underground: true  },
  { name: 'Universitetet',       lines: ['T14'],                                 distTC:  4, underground: true  },
  { name: 'Tekniska högskolan',  lines: ['T14'],                                 distTC:  3, underground: true  },
  { name: 'Stadion',             lines: ['T14'],                                 distTC:  2, underground: true  },
  { name: 'Ropsten',             lines: ['T13'],                                 distTC:  4, underground: false },
  { name: 'Gärdet',              lines: ['T13'],                                 distTC:  3, underground: true  },
  { name: 'Karlaplan',           lines: ['T13'],                                 distTC:  2, underground: true  },
  { name: 'Östermalmstorg',      lines: ['T13','T14'],                           distTC:  1, underground: true  },
  { name: 'Gamla stan',          lines: ['T13','T14','T17','T18','T19'],         distTC:  1, underground: false },
  { name: 'Slussen',             lines: ['T13','T14','T17','T18','T19'],         distTC:  2, underground: true  },
  { name: 'Mariatorget',         lines: ['T13','T14'],                           distTC:  3, underground: true  },
  { name: 'Zinkensdamm',         lines: ['T13','T14'],                           distTC:  4, underground: true  },
  { name: 'Hornstull',           lines: ['T13','T14'],                           distTC:  5, underground: true  },
  { name: 'Liljeholmen',         lines: ['T13','T14'],                           distTC:  6, underground: true  },
  { name: 'Midsommarkransen',    lines: ['T14'],                                 distTC:  7, underground: true  },
  { name: 'Telefonplan',         lines: ['T14'],                                 distTC:  8, underground: false },
  { name: 'Hägerstensåsen',      lines: ['T14'],                                 distTC:  9, underground: false },
  { name: 'Västertorp',          lines: ['T14'],                                 distTC: 10, underground: false },
  { name: 'Fruängen',            lines: ['T14'],                                 distTC: 11, underground: false },
  { name: 'Aspudden',            lines: ['T13'],                                 distTC:  7, underground: true  },
  { name: 'Örnsberg',            lines: ['T13'],                                 distTC:  8, underground: false },
  { name: 'Axelsberg',           lines: ['T13'],                                 distTC:  9, underground: false },
  { name: 'Mälarhöjden',         lines: ['T13'],                                 distTC: 10, underground: true  },
  { name: 'Bredäng',             lines: ['T13'],                                 distTC: 11, underground: false },
  { name: 'Sätra',               lines: ['T13'],                                 distTC: 12, underground: false },
  { name: 'Skärholmen',          lines: ['T13'],                                 distTC: 13, underground: true  },
  { name: 'Vårberg',             lines: ['T13'],                                 distTC: 14, underground: false },
  { name: 'Vårby gård',          lines: ['T13'],                                 distTC: 15, underground: false },
  { name: 'Masmo',               lines: ['T13'],                                 distTC: 16, underground: true  },
  { name: 'Fittja',              lines: ['T13'],                                 distTC: 17, underground: false },
  { name: 'Alby',                lines: ['T13'],                                 distTC: 18, underground: true  },
  { name: 'Hallunda',            lines: ['T13'],                                 distTC: 19, underground: false },
  { name: 'Norsborg',            lines: ['T13'],                                 distTC: 20, underground: false },
  // Gröna linjen
  { name: 'Hässelby strand',     lines: ['T19'],                                 distTC: 20, underground: false },
  { name: 'Hässelby gård',       lines: ['T19'],                                 distTC: 19, underground: false },
  { name: 'Johannelund',         lines: ['T19'],                                 distTC: 18, underground: false },
  { name: 'Vällingby',           lines: ['T19'],                                 distTC: 17, underground: false },
  { name: 'Råcksta',             lines: ['T19'],                                 distTC: 16, underground: false },
  { name: 'Blackeberg',          lines: ['T19'],                                 distTC: 15, underground: false },
  { name: 'Islandstorget',       lines: ['T17'],                                 distTC: 14, underground: false },
  { name: 'Ängbyplan',           lines: ['T17'],                                 distTC: 13, underground: false },
  { name: 'Åkeshov',             lines: ['T17','T19'],                           distTC: 12, underground: false },
  { name: 'Brommaplan',          lines: ['T17','T19'],                           distTC: 11, underground: false },
  { name: 'Abrahamsberg',        lines: ['T17','T19'],                           distTC: 10, underground: false },
  { name: 'Stora mossen',        lines: ['T17','T19'],                           distTC:  9, underground: false },
  { name: 'Alvik',               lines: ['T17','T18','T19'],                     distTC:  8, underground: false },
  { name: 'Kristineberg',        lines: ['T17','T18','T19'],                     distTC:  7, underground: false },
  { name: 'Thorildsplan',        lines: ['T17','T18','T19'],                     distTC:  6, underground: false },
  { name: 'S:t Eriksplan',       lines: ['T17','T18','T19'],                     distTC:  4, underground: true  },
  { name: 'Odenplan',            lines: ['T17','T18','T19'],                     distTC:  3, underground: true  },
  { name: 'Rådmansgatan',        lines: ['T17','T18','T19'],                     distTC:  2, underground: true  },
  { name: 'Hötorget',            lines: ['T17','T18','T19'],                     distTC:  1, underground: true  },
  { name: 'Medborgarplatsen',    lines: ['T17','T18','T19'],                     distTC:  3, underground: true  },
  { name: 'Skanstull',           lines: ['T17','T18','T19'],                     distTC:  4, underground: true  },
  { name: 'Gullmarsplan',        lines: ['T17','T18','T19'],                     distTC:  5, underground: false },
  { name: 'Skärmarbrink',        lines: ['T17','T18'],                           distTC:  6, underground: false },
  { name: 'Hammarbyhöjden',      lines: ['T17'],                                 distTC:  7, underground: false },
  { name: 'Björkhagen',          lines: ['T17'],                                 distTC:  8, underground: false },
  { name: 'Kärrtorp',            lines: ['T17'],                                 distTC:  9, underground: false },
  { name: 'Bagarmossen',         lines: ['T17'],                                 distTC: 10, underground: true  },
  { name: 'Skarpnäck',           lines: ['T17'],                                 distTC: 11, underground: true  },
  { name: 'Blåsut',              lines: ['T18'],                                 distTC:  7, underground: false },
  { name: 'Sandsborg',           lines: ['T18'],                                 distTC:  8, underground: false },
  { name: 'Skogskyrkogården',    lines: ['T18'],                                 distTC:  9, underground: false },
  { name: 'Tallkrogen',          lines: ['T18'],                                 distTC: 10, underground: false },
  { name: 'Gubbängen',           lines: ['T18'],                                 distTC: 11, underground: false },
  { name: 'Hökarängen',          lines: ['T18'],                                 distTC: 12, underground: false },
  { name: 'Farsta',              lines: ['T18'],                                 distTC: 13, underground: false },
  { name: 'Farsta strand',       lines: ['T18'],                                 distTC: 14, underground: false },
  { name: 'Globen',              lines: ['T19'],                                 distTC:  6, underground: false },
  { name: 'Enskede gård',        lines: ['T19'],                                 distTC:  7, underground: false },
  { name: 'Sockenplan',          lines: ['T19'],                                 distTC:  8, underground: false },
  { name: 'Svedmyra',            lines: ['T19'],                                 distTC:  9, underground: false },
  { name: 'Stureby',             lines: ['T19'],                                 distTC: 10, underground: false },
  { name: 'Bandhagen',           lines: ['T19'],                                 distTC: 11, underground: false },
  { name: 'Högdalen',            lines: ['T19'],                                 distTC: 12, underground: false },
  { name: 'Rågsved',             lines: ['T19'],                                 distTC: 13, underground: false },
  { name: 'Hagsätra',            lines: ['T19'],                                 distTC: 14, underground: false },
];

// ─── LINJE-TOOLTIPS ───────────────────────────────────────────────────────────
export const LINE_TOOLTIPS = [
  {
    label: 'T10/T11',
    color: '#1565C0',
    borderColor: '#1565C0',
    lines: [
      { id: 'T10', ends: 'Hjulsta – Kungsträdgården' },
      { id: 'T11', ends: 'Akalla – Kungsträdgården' },
    ],
  },
  {
    label: 'T13/T14',
    color: '#E53935',
    borderColor: '#E53935',
    lines: [
      { id: 'T13', ends: 'Norsborg – Ropsten' },
      { id: 'T14', ends: 'Fruängen – Mörby centrum' },
    ],
  },
  {
    label: 'T17/T18/T19',
    color: '#4CAF50',
    borderColor: '#4CAF50',
    lines: [
      { id: 'T17', ends: 'Åkeshov – Skarpnäck' },
      { id: 'T18', ends: 'Alvik – Farsta strand' },
      { id: 'T19', ends: 'Hässelby strand – Hagsätra' },
    ],
  },
];

// ─── HJÄLPFUNKTIONER ──────────────────────────────────────────────────────────
export function countLetters(name: string): number {
  return name.replace(/[^a-zåäöA-ZÅÄÖ]/g, '').length;
}

export function getUniqueColors(lines: string[]): string[] {
  const colors = lines.map((l) => LINE_COLORS[l] ?? '#888');
  return [...new Set(colors)];
}

export function getSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function getStationBySeed(seed: number): Station {
  const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
  return STATIONS[Math.floor(pseudoRandom) % STATIONS.length];
}

export function getEffectiveDist(station: Station, target: Station): number {
  if (station.distTC2 !== undefined) {
    const d1 = Math.abs(station.distTC  - target.distTC);
    const d2 = Math.abs(station.distTC2 - target.distTC);
    return d1 <= d2 ? station.distTC : station.distTC2!;
  }
  return station.distTC;
}

export function getDistDisplay(station: Station): string {
  return station.distTC2 !== undefined
    ? `${station.distTC} / ${station.distTC2}`
    : String(station.distTC);
}