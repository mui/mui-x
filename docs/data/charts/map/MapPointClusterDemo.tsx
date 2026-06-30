import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapPointPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

// A scatter of stations clustered around a few European hubs.
const hubs: { name: string; coordinates: [number, number] }[] = [
  { name: 'Paris', coordinates: [2.35, 48.85] },
  { name: 'Berlin', coordinates: [13.4, 52.52] },
  { name: 'Rome', coordinates: [12.5, 41.9] },
  { name: 'Madrid', coordinates: [-3.7, 40.42] },
];

const stations: { coordinates: [number, number]; label: string; value: number }[] =
  hubs.flatMap((hub, hubIndex) =>
    Array.from({ length: 12 }, (_, i) => ({
      coordinates: [
        hub.coordinates[0] + Math.cos(i + hubIndex) * 1.5,
        hub.coordinates[1] + Math.sin(i * 1.7 + hubIndex) * 1.2,
      ] as [number, number],
      label: `${hub.name} ${i + 1}`,
      value: 1,
    })),
  );

export default function MapPointClusterDemo() {
  const [radius, setRadius] = React.useState(32);

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Box sx={{ width: 240, mb: 1 }}>
        <Typography id="cluster-radius-slider" gutterBottom variant="body2">
          Cluster radius: {radius}px
        </Typography>
        <Slider
          aria-labelledby="cluster-radius-slider"
          value={radius}
          min={0}
          max={80}
          onChange={(_, value) => setRadius(value as number)}
          valueLabelDisplay="auto"
        />
      </Box>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={400}
        series={[
          {
            type: 'mapPoint',
            label: 'Stations',
            color: '#7b1fa2',
            data: stations,
          },
        ]}
      >
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapPointPlot cluster={{ radius }} size={120} showLabels />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
