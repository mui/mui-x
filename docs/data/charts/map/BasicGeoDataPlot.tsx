import * as React from 'react';
import Box from '@mui/material/Box';
import { feature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { ChartsLegend } from '@mui/x-charts-premium/ChartsLegend';

const countries = feature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

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
          },
          {
            type: 'mapShape',
            label: 'European Union',
            id: 'EU',
            color: 'blue',
            highlightScope: { highlight: 'item', fade: 'series' },
            data: [
              { name: 'Austria' },
              { name: 'Belgium' },
              { name: 'Bulgaria' },
              { name: 'Croatia' },
              { name: 'Cyprus' },
              { name: 'Czechia' },
              { name: 'Denmark' },
              { name: 'Estonia' },
              { name: 'France' },
              { name: 'Finland' },
              { name: 'Germany' },
              { name: 'Hungary' },
              { name: 'Ireland' },
              { name: 'Italy' },
              { name: 'Latvia' },
              { name: 'Lithuania' },
              { name: 'Luxembourg' },
              { name: 'Greece' },
              { name: 'Malta' },
              { name: 'Netherlands' },
              { name: 'Poland' },
              { name: 'Portugal' },
              { name: 'Romania' },
              { name: 'Slovakia' },
              { name: 'Slovenia' },
              { name: 'Spain' },
              { name: 'Sweden' },
            ],
          },
        ]}
      >
        <ChartsLegend toggleVisibilityOnClick />
        <ChartsSurface>
          <GeoDataPlot fill="transparent" stroke="#0d47a1" />
          <MapShapePlot />
        </ChartsSurface>
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
