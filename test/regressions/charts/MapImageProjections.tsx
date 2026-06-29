import * as React from 'react';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapImagePlot, D3NamedProjection } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { marsRegions } from 'docs/data/charts/map/marsRegions';

const MARS_IMAGE = '/static/x/charts/mars-viking-mdim21.jpg';

// Every named d3-geo projection the provider supports.
const PROJECTIONS: D3NamedProjection[] = [
  'azimuthalEqualArea',
  'azimuthalEquidistant',
  'gnomonic',
  'orthographic',
  'stereographic',
  'conicConformal',
  'conicEqualArea',
  'conicEquidistant',
  'albers',
  'albersUsa',
  'equirectangular',
  'mercator',
  'transverseMercator',
  'equalEarth',
  'naturalEarth1',
];

const CELL_WIDTH = 200;
const CELL_HEIGHT = 130;

export default function MapImageProjections() {
  // `MapImagePlot` reprojects on a canvas asynchronously. Track which cells have
  // produced a raster by projection name (a Set, not a counter: `onReady` can fire
  // truthy more than once per cell as the fit settles, which would otherwise reveal
  // the sentinel before every cell is ready). `onReady` also fires with `null`
  // before the image loads, so those are ignored.
  const [ready, setReady] = React.useState<ReadonlySet<string>>(() => new Set());
  const markReady = (projection: string) =>
    setReady((prev) => (prev.has(projection) ? prev : new Set(prev).add(projection)));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${CELL_WIDTH}px)`, gap: 4 }}>
      {PROJECTIONS.map((projection) => (
        <div key={projection}>
          <div style={{ fontSize: 11, fontFamily: 'monospace' }}>{projection}</div>
          <ChartsGeoDataProviderPremium
            geoData={marsRegions}
            projection={projection}
            width={CELL_WIDTH}
            height={CELL_HEIGHT}
          >
            <ChartsSurface>
              <MapImagePlot
                href={MARS_IMAGE}
                onReady={(dataUrl) => dataUrl && markReady(projection)}
              />
              <GeoDataPlot fill="none" stroke="#1976d2" strokeWidth={0.4} />
            </ChartsSurface>
          </ChartsGeoDataProviderPremium>
        </div>
      ))}
      {ready.size === PROJECTIONS.length && (
        // Visible (1×1) so Playwright's `waitForSelector` (state: 'visible') resolves.
        <div data-testid="map-images-ready" style={{ width: 1, height: 1 }} />
      )}
    </div>
  );
}
