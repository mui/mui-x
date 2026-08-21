// The fixtures render with Roboto. A screenshot taken with a fallback face looks
// like a repo-wide text rendering change, so report the missing faces and let
// `index.test.ts` fail the run.

// `display=swap` is dropped on purpose: it paints fallback text first, and the
// font files Google serves are identical without it.
const STYLESHEETS = [
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400',
];

// One entry per face the fixtures use.
const FACES = [
  ...[300, 400, 500, 700].map((weight) => ({ family: 'Roboto', weight, style: 'normal' })),
  { family: 'Roboto', weight: 400, style: 'italic' },
];

// Google splits every face into `unicode-range` subsets, and `load()` only
// fetches the ones covering its text — a single space by default. Probe each
// subset the fixtures render, otherwise a broken file goes unnoticed.
const SUBSETS = [
  { name: 'latin', text: ' ' },
  // Chart demos label standard deviations, e.g. `docs/data/charts/composition/BellCurveOverlay.js`.
  { name: 'greek', text: 'σ' },
];

function loadStylesheet(href: string) {
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener('load', () => resolve());
    link.addEventListener('error', () => reject(new Error(`Failed to load ${href}.`)));
    document.head.appendChild(link);
  });
}

/**
 * Loads the webfonts the fixtures render with.
 *
 * This never times out. `index.test.ts` races it against a real timer -- see the
 * comment there for why nothing else guards it.
 *
 * @returns a promise that rejects when a face does not load.
 */
export default async function loadFonts() {
  // `document.fonts` only matches `@font-face` rules that are already parsed.
  await Promise.all(STYLESHEETS.map(loadStylesheet));

  // A `<link>` alone does not download the font, because no element renders the
  // family yet. `document.fonts.status` reports `loaded` for that empty pending
  // set, so gating on it cannot see a failure. `load()` forces the download.
  const missing: string[] = [];
  await Promise.all(
    FACES.flatMap(({ family, weight, style }) =>
      SUBSETS.map(async ({ name, text }) => {
        const label = `${family} ${style} ${weight} (${name})`;
        try {
          // `load()` applies normal CSS matching, so a request for a weight the
          // stylesheet omits resolves to the nearest one. Compare what came back.
          const faces = await document.fonts.load(`${style} ${weight} 16px "${family}"`, text);
          if (!faces.some((face) => face.weight === String(weight) && face.style === style)) {
            missing.push(label);
          }
        } catch {
          // The rule matched but the font file failed to download.
          missing.push(label);
        }
      }),
    ),
  );

  if (missing.length > 0) {
    throw new Error(`Fonts failed to load. Missing: ${missing.join(', ')}`);
  }
}
