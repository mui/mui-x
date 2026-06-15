import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const countriesWithoutAntarctica: ExtendedFeatureCollection = {
  ...countries,
  features: countries.features.filter(
    (feature) => feature.properties?.name !== 'Antarctica',
  ),
};

export default function RemoveAntarctica() {
  const [includeAntarctica, setIncludeAntarctica] = React.useState(false);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={includeAntarctica ? countries : countriesWithoutAntarctica}
          projection="naturalEarth1"
          height={360}
        >
          <ChartsSurface>
            <GeoDataPlot fill="#e3f2fd" stroke="#0d47a1" strokeWidth={0.5} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 180 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeAntarctica}
              onChange={(event) => setIncludeAntarctica(event.target.checked)}
            />
          }
          label="Include Antarctica"
        />
      </Stack>
    </Stack>
  );
}
