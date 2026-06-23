import * as React from 'react';
import Box from '@mui/material/Box';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsLegend } from '@mui/x-charts-premium/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import {
  withCountryCodeAsName,
  countriesInContinent,
  countryData,
} from '../dataset/countryData';

const countries = withCountryCodeAsName(
  topojsonFeature(
    countriesTopology as any,
    'countries',
  ) as unknown as ExtendedFeatureCollection,
);

const getContinentData = (continent: string) =>
  countriesInContinent[continent].map((code) => ({
    name: code,
    label: countryData[code as keyof typeof countryData].country,
  }));

const northAmerica = getContinentData('North America');
const southAmerica = getContinentData('South America');
const europe = getContinentData('Europe');
const asia = getContinentData('Asia');
const africa = getContinentData('Africa');
const oceania = getContinentData('Oceania');

export default function VisibleMapShape() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={360}
        series={[
          {
            type: 'mapShape',
            label: 'North America',
            color: '#fb8c00',
            valueFormatter: () => '',
            data: northAmerica,
          },
          {
            type: 'mapShape',
            label: 'South America',
            color: '#43a047',
            valueFormatter: () => '',
            data: southAmerica,
          },
          {
            type: 'mapShape',
            label: 'Europe',
            color: '#1e88e5',
            valueFormatter: () => '',
            data: europe,
          },
          {
            type: 'mapShape',
            label: 'Asia',
            color: '#e53935',
            valueFormatter: () => '',
            data: asia,
          },
          {
            type: 'mapShape',
            label: 'Africa',
            color: '#fdd835',
            valueFormatter: () => '',
            data: africa,
          },
          {
            type: 'mapShape',
            label: 'Oceania',
            color: '#8e24aa',
            valueFormatter: () => '',
            data: oceania,
          },
        ]}
      >
        <ChartsLegend toggleVisibilityOnClick />
        <ChartsSurface>
          <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
          <MapShapePlot />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
