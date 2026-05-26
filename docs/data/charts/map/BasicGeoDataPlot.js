import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

import { ChartsLegend } from '@mui/x-charts-premium/ChartsLegend';
import { countryData, EU_COUNTRIES } from '../dataset/countryData';

const countries = topojsonFeature(countriesTopology, 'countries');

export default function BasicGeoDataPlot() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={420}
        series={[
          {
            type: 'mapShape',
            label: 'World',
            color: 'lightgray',
            highlightScope: { highlight: 'item', fade: 'global' },
            data: countries.features.map((feature, index) => ({
              name: feature.properties?.name,
              color: `hsl(${(index / countries.features.length) * 360}, 50%, 70%)`,
            })),
            valueFormatter: (point) =>
              point.value != null ? `${point.value} units` : 'No data',
          },
          {
            type: 'mapShape',
            label: 'European Union',
            id: 'EU',
            color: 'blue',
            highlightScope: { highlight: 'item', fade: 'series' },
            data: EU_COUNTRIES.map((code) => ({
              name: countryData[code].worldAtlasName,
              label: countryData[code].country,
            })),
            valueFormatter: (point) =>
              point.value != null ? `${point.value} units` : 'No data',
          },
        ]}
      >
        <ChartsLegend toggleVisibilityOnClick />
        <ChartsSurface>
          <GeoDataPlot fill="transparent" stroke="#0d47a1" />
          <MapShapePlot />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
