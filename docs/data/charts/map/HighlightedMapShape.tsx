import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

type HighlightOptions = 'none' | 'item' | 'series';
type FadeOptions = 'none' | 'series' | 'global';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const americas = [
  'Argentina',
  'Bolivia',
  'Brazil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Paraguay',
  'Peru',
  'Uruguay',
  'Venezuela',
];

const europe = [
  'France',
  'Germany',
  'Italy',
  'Poland',
  'Portugal',
  'Romania',
  'Spain',
  'Sweden',
  'United Kingdom',
];

export default function HighlightedMapShape() {
  const [highlight, setHighlight] = React.useState<HighlightOptions>('item');
  const [fade, setFade] = React.useState<FadeOptions>('global');

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          projection="naturalEarth1"
          height={360}
          series={[
            {
              type: 'mapShape',
              label: 'South America',
              color: '#43a047',
              highlightScope: { highlight, fade },
              data: americas.map((name) => ({ name })),
            },
            {
              type: 'mapShape',
              label: 'Europe',
              color: '#1e88e5',
              highlightScope: { highlight, fade },
              data: europe.map((name) => ({ name })),
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
      <Stack spacing={2} sx={{ minWidth: 150 }}>
        <TextField
          select
          label="highlight"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value as HighlightOptions)}
        >
          <MenuItem value="none">none</MenuItem>
          <MenuItem value="item">item</MenuItem>
          <MenuItem value="series">series</MenuItem>
        </TextField>
        <TextField
          select
          label="fade"
          value={fade}
          onChange={(event) => setFade(event.target.value as FadeOptions)}
        >
          <MenuItem value="none">none</MenuItem>
          <MenuItem value="series">series</MenuItem>
          <MenuItem value="global">global</MenuItem>
        </TextField>
      </Stack>
    </Stack>
  );
}
