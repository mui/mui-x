import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import USATopology from 'us-atlas/states-10m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { useChartPremiumApiRef } from '@mui/x-charts-premium/hooks';
import { GeoDataPlot, Graticule } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const countries = topojsonFeature(countriesTopology, 'countries');

const USAStates = topojsonFeature(USATopology, 'states');

const projectionGroups = [
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

function isConicProjection(projection) {
  return (
    projection === 'conicConformal' ||
    projection === 'conicEqualArea' ||
    projection === 'conicEquidistant' ||
    projection === 'albers' ||
    projection === 'albersUsa'
  );
}

function isCylindricalProjection(projection) {
  return (
    projection === 'equirectangular' ||
    projection === 'mercator' ||
    projection === 'transverseMercator' ||
    projection === 'equalEarth' ||
    projection === 'naturalEarth1'
  );
}

export default function MapZoomOptions() {
  const [projection, setProjection] = React.useState('naturalEarth1');
  const apiRef = useChartPremiumApiRef();

  const [rotationAllowed, setRotationAllowed] = React.useState('long');
  const [translationAllowed, setTranslationAllowed] = React.useState('y');
  const [maxGap, setMaxGap] = React.useState(0);

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
          apiRef={apiRef}
          zoom={{ rotationAllowed, translationAllowed, maxGap }}
          height={360}
        >
          <ChartsSurface>
            <Graticule stroke="#90caf9" strokeWidth={0.5} />
            <GeoDataPlot fill="#e3f2fd" stroke="#a7a7a7" strokeWidth={0.5} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 200, maxWidth: 300 }}>
        <TextField
          select
          label="projection"
          value={projection}
          onChange={(event) => {
            setProjection(event.target.value);
            apiRef.current?.resetZoom();
            if (
              isConicProjection(event.target.value) ||
              isCylindricalProjection(event.target.value)
            ) {
              setRotationAllowed('long');
              setTranslationAllowed('y');
            } else {
              setRotationAllowed('both');
              setTranslationAllowed('none');
            }
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

        <div>
          <Typography gutterBottom variant="caption">
            Rotation
          </Typography>
          <div>
            <ToggleButtonGroup
              value={rotationAllowed}
              exclusive
              size="small"
              onChange={(_, value) => {
                if (value !== null) {
                  setRotationAllowed(value);
                }
              }}
            >
              <ToggleButton value="both">both</ToggleButton>
              <ToggleButton value="long">longitude</ToggleButton>
              <ToggleButton value="lat">latitude</ToggleButton>
              <ToggleButton value="none">none</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        <div>
          <Typography gutterBottom variant="caption">
            Translation
          </Typography>
          <div>
            <ToggleButtonGroup
              value={translationAllowed}
              exclusive
              size="small"
              onChange={(_, value) => {
                if (value !== null) {
                  setTranslationAllowed(value);
                }
              }}
            >
              <ToggleButton value="both">both</ToggleButton>
              <ToggleButton value="x">x</ToggleButton>
              <ToggleButton value="y">y</ToggleButton>
              <ToggleButton value="none">none</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div>
          <Typography gutterBottom variant="caption">
            Max Gap
          </Typography>
          <div>
            <ToggleButtonGroup
              value={maxGap}
              exclusive
              size="small"
              onChange={(_, value) => {
                if (value !== null) {
                  setMaxGap(value);
                }
              }}
            >
              <ToggleButton value={0}>0</ToggleButton>
              <ToggleButton value={0.5}>0.5</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              apiRef.current?.resetZoom();
            }}
            size="small"
            variant="outlined"
          >
            Reset zoom
          </Button>
        </div>
      </Stack>
    </Stack>
  );
}
