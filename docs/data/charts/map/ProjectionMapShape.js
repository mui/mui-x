import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import USATopology from 'us-atlas/states-10m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
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
  // { name: 'New York', coordinates: [-74.006, 40.7128] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] },
  { name: 'Rio', coordinates: [-43.1729, -22.9068] },
];

export default function ProjectionMapShape() {
  const [projection, setProjection] = React.useState('naturalEarth1');

  const [autoRotation, setAutoRotation] = React.useState(true);
  const [rotation, setRotation] = React.useState([0, 0]);

  const [autoTranslation, setAutoTranslation] = React.useState(true);
  const [translation, setTranslation] = React.useState([300, 300]);

  const [autoScale, setAutoScale] = React.useState(true);
  const [scale, setScale] = React.useState(100);

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
          {...(!autoRotation && { rotate: rotation })}
          {...(!autoTranslation && { translate: translation })}
          {...(!autoScale && { scale })}
          zoom={{ rotationAllowed: 'long', translationAllowed: 'both' }}
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
              setRotation((prev) => [prev[0], 0]);
              return;
            }
            if (isCylindrical(event.target.value)) {
              setRotation((prev) => [0, prev[1]]);
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
          <Typography gutterBottom>
            Rotation: {autoRotation ? 'auto' : `(${rotation[0]}°, ${rotation[1]}°)`}
          </Typography>
          {usaProjection ? (
            <Typography variant="caption">
              Rotation is not available for the Albers USA projection.
            </Typography>
          ) : (
            <React.Fragment>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={autoRotation}
                    onChange={(event) => setAutoRotation(event.target.checked)}
                  />
                }
                label={`auto rotation`}
              />
              {autoRotation ? null : (
                <div>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                    fullWidth
                  >
                    {cities.map(({ name, coordinates }) => (
                      <Button
                        size="small"
                        key={name}
                        onClick={() => {
                          if ('transverseMercator' === projection) {
                            return setRotation([0, -coordinates[1]]);
                          }
                          if (isCylindrical(projection)) {
                            return setRotation([-coordinates[0], 0]);
                          }
                          return setRotation([-coordinates[0], -coordinates[1]]);
                        }}
                        disabled={usaProjection}
                      >
                        {name}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <Slider
                    value={rotation[0]}
                    min={-180}
                    max={180}
                    step={10}
                    marks={[{ value: 0, label: '' }]}
                    aria-label="longitude"
                    size="small"
                    onChange={(_, value) => setRotation((prev) => [value, prev[1]])}
                    valueLabelDisplay="auto"
                    disabled={usaProjection}
                  />
                  <Slider
                    value={rotation[1]}
                    min={-180}
                    max={180}
                    step={10}
                    marks={[{ value: 0, label: '' }]}
                    aria-label="latitude"
                    size="small"
                    onChange={(_, value) => setRotation((prev) => [prev[0], value])}
                    valueLabelDisplay="auto"
                    disabled={usaProjection}
                  />
                </div>
              )}
            </React.Fragment>
          )}
        </div>
        <div>
          <Typography gutterBottom>
            Translate:{' '}
            {autoTranslation ? 'auto' : `(${translation[0]}, ${translation[1]})`}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={autoTranslation}
                onChange={(event) => setAutoTranslation(event.target.checked)}
              />
            }
            label={`auto translation`}
          />
          {autoTranslation ? null : (
            <div>
              <Slider
                value={translation[0]}
                min={-100}
                max={500}
                step={10}
                aria-label="translate x"
                size="small"
                onChange={(_, value) => setTranslation((prev) => [value, prev[1]])}
                valueLabelDisplay="auto"
              />
              <Slider
                value={translation[1]}
                min={-100}
                max={500}
                step={10}
                aria-label="translate y"
                size="small"
                onChange={(_, value) => setTranslation((prev) => [prev[0], value])}
                valueLabelDisplay="auto"
              />
            </div>
          )}
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
            min={100}
            max={1500}
            step={100}
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
