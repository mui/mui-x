import * as React from 'react';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapImagePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { marsRegions } from 'docs/data/charts/map/marsRegions';

// A synthetic equirectangular image: four colored longitude bands, so the
// reprojected position of each band is obvious and the antimeridian wrap is
// visible (a `data:` URL, so it loads without hitting the image network block).
function makeBandImage() {
  if (typeof document === 'undefined') {
    return '';
  }
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  ['#e53935', '#43a047', '#1e88e5', '#fdd835'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * 90, 0, 90, 180);
  });
  return canvas.toDataURL();
}

const BAND_IMAGE = makeBandImage();

const CASES: { label: string; bounds: [[number, number], [number, number]] }[] = [
  // Whole globe, no wrap.
  {
    label: 'default bounds',
    bounds: [
      [-180, -90],
      [180, 90],
    ],
  },
  // west (90) > east (-90): the source covers 90°E..180..-90°E, wrapping the
  // antimeridian. Only that half of the map should be painted; the rest stays clear.
  {
    label: 'wraps antimeridian',
    bounds: [
      [90, -90],
      [-90, 90],
    ],
  },
];

const CELL_WIDTH = 300;
const CELL_HEIGHT = 150;

export default function MapImageAntimeridian() {
  const [ready, setReady] = React.useState<ReadonlySet<string>>(() => new Set());
  const markReady = (label: string) =>
    setReady((prev) => (prev.has(label) ? prev : new Set(prev).add(label)));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${CELL_WIDTH}px)`, gap: 4 }}>
      {CASES.map(({ label, bounds }) => (
        <div key={label}>
          <div style={{ fontSize: 11, fontFamily: 'monospace' }}>{label}</div>
          <ChartsGeoDataProviderPremium
            geoData={marsRegions}
            projection="equirectangular"
            width={CELL_WIDTH}
            height={CELL_HEIGHT}
          >
            <ChartsSurface>
              <MapImagePlot
                href={BAND_IMAGE}
                imageBounds={bounds}
                onReady={(dataUrl) => dataUrl && markReady(label)}
              />
              <GeoDataPlot fill="none" stroke="#1a1a1a" strokeWidth={0.4} />
            </ChartsSurface>
          </ChartsGeoDataProviderPremium>
        </div>
      ))}
      {ready.size === CASES.length && (
        // Visible (1×1) so Playwright's `waitForSelector` (state: 'visible') resolves.
        <div data-testid="map-images-ready" style={{ width: 1, height: 1 }} />
      )}
    </div>
  );
}
