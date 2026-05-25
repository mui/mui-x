import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import USATopology from 'us-atlas/states-10m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, Graticule } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const countries = topojsonFeature(countriesTopology, 'countries');

const USAStates = topojsonFeature(USATopology, 'states');

const projections = [
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

function isCylindrical(projection) {
  return (
    projection === 'equirectangular' ||
    projection === 'mercator' ||
    projection === 'transverseMercator' ||
    projection === 'equalEarth' ||
    projection === 'naturalEarth1'
  );
}

function isConicProjection(projection) {
  return (
    projection === 'conicConformal' ||
    projection === 'conicEqualArea' ||
    projection === 'conicEquidistant' ||
    projection === 'albers' ||
    projection === 'albersUsa'
  );
}

const cities = [
  { name: 'New York', coordinates: [-74.006, 40.7128] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] },
  { name: 'Rio', coordinates: [-43.1729, -22.9068] },
];

export default function ProjectionMapShape() {
  // const [projection, setProjection] = React.useState('naturalEarth1');
  const [projection, setProjection] = React.useState('conicConformal');
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setLatitude] = React.useState(0);
  const [scale, setScale] = React.useState(100);
  const [autoScale, setAutoScale] = React.useState(true);

  const usaProjection = projection === 'albersUsa';
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
          rotate={isConicProjection(projection) ? undefined : [longitude, latitude]}
          translate={
            isConicProjection(projection) && !usaProjection
              ? [longitude, latitude]
              : undefined
          }
          scale={autoScale ? undefined : scale}
          height={360}
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
            setProjection(event.target.value);
            if ('transverseMercator' === event.target.value) {
              setLongitude(0);
              return;
            }
            if (isCylindrical(event.target.value)) {
              setLatitude(0);
            }
          }}
        >
          {projections.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        <ButtonGroup variant="outlined" aria-label="outlined button group" fullWidth>
          {cities.map(({ name, coordinates }) => (
            <Button
              size="small"
              key={name}
              onClick={() => {
                if (isCylindrical(projection)) {
                  if ('transverseMercator' === projection) {
                    setLongitude(0);
                    setLatitude(-coordinates[1]);
                  } else {
                    setLongitude(-coordinates[0]);
                    setLatitude(0);
                  }
                  return;
                }
                setLongitude(-coordinates[0]);
                setLatitude(-coordinates[1]);
              }}
              disabled={usaProjection}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
        <div>
          <Typography gutterBottom>Longitude: {longitude}</Typography>
          <Slider
            value={longitude}
            min={-360}
            max={360}
            size="small"
            onChange={(_, value) => setLongitude(value)}
            valueLabelDisplay="auto"
            disabled={usaProjection}
          />
        </div>
        <div>
          <Typography gutterBottom>Latitude: {latitude}</Typography>
          <Slider
            value={latitude}
            min={-360}
            max={360}
            size="small"
            onChange={(_, value) => setLatitude(value)}
            valueLabelDisplay="auto"
            disabled={usaProjection}
          />
        </div>
        <div>
          <Typography gutterBottom>Scale: {autoScale ? 'auto' : scale}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={autoScale}
                onChange={(event) => setAutoScale(event.target.checked)}
              />
            }
            label={`auto scale`}
          />
          <Slider
            value={scale}
            min={10}
            max={500}
            step={10}
            size="small"
            disabled={autoScale}
            onChange={(_, value) => setScale(value)}
            valueLabelDisplay="auto"
          />
        </div>
      </Stack>
    </Stack>
  );
}
