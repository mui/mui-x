export const letterFrequency = [
  { letter: 'A', frequency: 8.2 },
  { letter: 'B', frequency: 1.5 },
  { letter: 'C', frequency: 2.8 },
  { letter: 'D', frequency: 4.3 },
  { letter: 'E', frequency: 12.7 },
  { letter: 'F', frequency: 2.2 },
  { letter: 'G', frequency: 2.0 },
  { letter: 'H', frequency: 6.1 },
  { letter: 'I', frequency: 7.0 },
  { letter: 'J', frequency: 0.15 },
  { letter: 'K', frequency: 0.77 },
  { letter: 'L', frequency: 4.0 },
  { letter: 'M', frequency: 2.4 },
  { letter: 'N', frequency: 6.7 },
  { letter: 'O', frequency: 7.5 },
  { letter: 'P', frequency: 1.9 },
  { letter: 'Q', frequency: 0.095 },
  { letter: 'R', frequency: 6.0 },
  { letter: 'S', frequency: 6.3 },
  { letter: 'T', frequency: 9.1 },
  { letter: 'U', frequency: 2.8 },
  { letter: 'V', frequency: 0.98 },
  { letter: 'W', frequency: 2.4 },
  { letter: 'X', frequency: 0.15 },
  { letter: 'Y', frequency: 2.0 },
  { letter: 'Z', frequency: 0.074 },
];

export const dataset = letterFrequency.sort((a, b) => b.frequency - a.frequency);

export function valueFormatter(value: number | null) {
  if (value === null) {
    return `?`;
  }
  return `${(value / 100).toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}`;
}
