import * as React from 'react';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapImagePlot, D3NamedProjection } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { marsRegions } from 'docs/data/charts/map/marsRegions';
import { marsTexture } from 'docs/data/charts/map/marsTexture';

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
  // `MapImagePlot` reprojects on a canvas asynchronously. Count the rendered
  // `<image>` load events and reveal a sentinel once every cell is ready, so the
  // screenshot waits for the reprojection instead of racing it.
  const [loaded, setLoaded] = React.useState(0);

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
              <MapImagePlot href={marsTexture} onLoad={() => setLoaded((count) => count + 1)} />
              <GeoDataPlot fill="none" stroke="#1976d2" strokeWidth={0.4} />
            </ChartsSurface>
          </ChartsGeoDataProviderPremium>
        </div>
      ))}
      {loaded >= PROJECTIONS.length && (
        <div data-testid="map-images-ready" style={{ display: 'none' }} />
      )}
    </div>
  );
}
