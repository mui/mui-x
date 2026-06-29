import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import type {
  ExtendedFeature,
  ExtendedFeatureCollection,
} from '@mui/x-charts-vendor/d3-geo';
import { countryData } from '../dataset/countryData';
import { internetUsageByCountry } from '../dataset/internetUsageByCountry';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

// Treat the state of Somaliland as part of Somalia to match our World in data dataset.
const mergeSomaliland = (feature: ExtendedFeature) =>
  feature.properties?.name === 'Somaliland'
    ? 'Somalia'
    : (feature.properties?.name ?? null);

const data = Object.entries(countryData)
  .filter(([, country]) => country.worldAtlasName)
  .map(([code, country]) => ({
    name: country.worldAtlasName,
    label: country.country,
    colorValue: internetUsageByCountry[code],
  }));

export default function GeoFeatureKeyMapShape() {
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 500 }}>
      <Box sx={{ width: '100%' }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          geoFeatureKey={mergeSomaliland}
          projection="naturalEarth1"
          rotate={[-46, -6]}
          scale={900}
          height={360}
          series={[
            {
              type: 'mapShape',
              label: 'Internet usage',
              data,
              highlightScope: { highlight: 'item', fade: 'global' },
              valueFormatter: (point) =>
                point.colorValue == null
                  ? 'No data'
                  : `${point.colorValue.toFixed(1)}%`,
            },
          ]}
          zAxis={[
            {
              id: 'internet-usage',
              colorMap: {
                type: 'continuous',
                min: 0,
                max: 100,
                color: ['#e3f2fd', '#0d47a1'],
              },
            },
          ]}
        >
          <ChartsSurface>
            <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
            <MapShapePlot />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
        </ChartsGeoDataProviderPremium>
      </Box>
    </Stack>
  );
}
