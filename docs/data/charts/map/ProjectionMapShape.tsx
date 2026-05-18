import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import {
  Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium,
  type D3NamedProjection,
} from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const projections: D3NamedProjection[] = [
  // Azimuthal projections (https://d3js.org/d3-geo/azimuthal)
  'azimuthalEqualArea',
  'azimuthalEquidistant',
  'gnomonic',
  'orthographic',
  'stereographic',

  // Conic projections (https://d3js.org/d3-geo/conic)
  'conicConformal',
  'conicEqualArea',
  'conicEquidistant',
  'albers',
  'albersUsa', // Special composition for the USA with an edge case for Alaska and Hawaii.

  // Cylindrical projections (https://d3js.org/d3-geo/cylindrical)
  'equirectangular',
  'mercator',
  'transverseMercator',
  'equalEarth',
  'naturalEarth1',
];

export default function ProjectionMapShape() {
  // const [projection, setProjection] = React.useState('naturalEarth1');
  const [projection, setProjection] =
    React.useState<D3NamedProjection>('conicConformal');

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          projection={projection}
          height={360}
        >
          <ChartsSurface>
            <GeoDataPlot fill="#e3f2fd" stroke="#0d47a1" strokeWidth={0.5} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 200 }}>
        <TextField
          select
          label="projection"
          value={projection}
          onChange={(event) =>
            setProjection(event.target.value as D3NamedProjection)
          }
        >
          {projections.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}
