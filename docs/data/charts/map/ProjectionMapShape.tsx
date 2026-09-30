import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import USATopology from 'us-atlas/states-10m.json';
import { useChartPremiumApiRef } from '@mui/x-charts-premium/hooks';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import {
  D3NamedProjection,
  GeoDataPlot,
  Graticule,
} from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const USAStates = topojsonFeature(
  USATopology as any,
  'states',
) as unknown as ExtendedFeatureCollection;

const projectionGroups: { label: string; projections: D3NamedProjection[] }[] = [
  {
    // https://d3js.org/d3-geo/azimuthal
    label: 'Azimuthal',
    projections: [
      'azimuthalEqualArea',
      'azimuthalEquidistant',
      'gnomonic',
      'orthographic',
      'stereographic',
    ],
  },
  {
    // https://d3js.org/d3-geo/conic
    label: 'Conic',
    projections: [
      //  For now commented because those are more difficult to handle
      // 'conicConformal',
      // 'conicEqualArea',
      // 'conicEquidistant',
      // 'albers',
      'albersUsa', // Special composition for the USA with an edge case for Alaska and Hawaii.
    ],
  },
  {
    // https://d3js.org/d3-geo/cylindrical
    label: 'Cylindrical',
    projections: [
      'equirectangular',
      'mercator',
      'transverseMercator',
      'equalEarth',
      'naturalEarth1',
    ],
  },
];

function isConicProjection(projection: D3NamedProjection) {
  return (
    projection === 'conicConformal' ||
    projection === 'conicEqualArea' ||
    projection === 'conicEquidistant' ||
    projection === 'albers' ||
    projection === 'albersUsa'
  );
}

export default function ProjectionMapShape() {
  const [projection, setProjection] =
    React.useState<D3NamedProjection>('naturalEarth1');

  const apiRef = useChartPremiumApiRef<'mapShape'>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={isConicProjection(projection) ? USAStates : countries}
          projection={projection}
          zoom
          height={360}
          apiRef={apiRef}
        >
          <ChartsSurface>
            <Graticule stroke="#90caf9" strokeWidth={0.5} />
            <GeoDataPlot fill="#e3f2fd" stroke="#a7a7a7" strokeWidth={0.5} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 200 }}>
        <TextField
          select
          label="projection"
          value={projection}
          onChange={(event) => {
            setProjection(event.target.value as D3NamedProjection);
            apiRef.current?.resetZoom();
          }}
        >
          {projectionGroups.flatMap(({ label, projections }) => [
            <ListSubheader key={label}>{label}</ListSubheader>,
            ...projections.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            )),
          ])}
        </TextField>
      </Stack>
    </Stack>
  );
}
