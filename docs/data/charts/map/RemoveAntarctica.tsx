import * as React from 'react';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';

import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { type MapShapeValueType } from '@mui/x-charts-premium/models';
import { internetUsageByCountry } from '../dataset/internetUsageByCountry';
import { countryData, withCountryCodeAsName } from '../dataset/countryData';

const projections = [
  'equirectangular',
  'mercator',
  'transverseMercator',
  'equalEarth',
  'naturalEarth1',
] as const;

type Projection = (typeof projections)[number];

const countries = withCountryCodeAsName(
  topojsonFeature(
    countriesTopology as any,
    'countries',
  ) as unknown as ExtendedFeatureCollection,
);

const countriesWithoutAntarctica = {
  ...countries,
  features: countries.features.filter(
    (feature) => feature.properties?.name !== 'Antarctica',
  ),
};

export default function RemoveAntarctica() {
  const [mode, setMode] = React.useState<
    'with-antarctica' | 'geoDataFiltering' | 'seriesOnly'
  >('geoDataFiltering');
  const [projection, setProjection] = React.useState<Projection>('naturalEarth1');

  return (
    <Box sx={{ width: '100%' }}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode !== null) {
            setMode(newMode);
          }
        }}
        sx={{ mb: 2, mr: 2 }}
      >
        <ToggleButton value="with-antarctica">With Antarctica</ToggleButton>
        <ToggleButton value="geoDataFiltering">geoData filtering</ToggleButton>
        <ToggleButton value="seriesOnly">series only</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        select
        label="Projection"
        value={projection}
        onChange={(event) => setProjection(event.target.value as Projection)}
        sx={{ mb: 2, minWidth: 200 }}
      >
        {projections.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={
            mode === 'geoDataFiltering' ? countriesWithoutAntarctica : countries
          }
          {...settings}
          projection={projection}
        >
          <ChartsSurface>
            {mode === 'seriesOnly' ? null : (
              <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
            )}
            <MapShapePlot />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
    </Box>
  );
}

const settings = {
  zAxis: [
    {
      id: 'internet-usage',
      colorMap: {
        type: 'continuous',
        min: 0,
        max: 100,
        color: ['#e3f2fd', '#0d47a1'],
        unknownColor: 'gray',
      },
    },
  ],
  height: 360,
  series: [
    {
      type: 'mapShape',
      label: 'Internet usage',
      data: Object.keys(countryData).map((code) => ({
        name: code,
        label: countryData[code].country,
        colorValue: internetUsageByCountry[code],
      })),
      valueFormatter: (point: MapShapeValueType) =>
        point.colorValue == null ? 'No data' : `${point.colorValue.toFixed(1)}%`,
    },
  ],
} as const;
