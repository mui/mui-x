import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import USATopology from 'us-atlas/states-10m.json';
import {
  Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium,
  MapZoomView,
} from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { useChartPremiumApiRef } from '@mui/x-charts-premium/hooks';
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

const countriesWithoutAntarctica = {
  ...countries,
  features: countries.features.filter(
    (feature) => feature.properties?.name !== 'Antarctica',
  ),
};

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
      'conicConformal',
      'conicEqualArea',
      'conicEquidistant',
      'albers',
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

const cities = [
  // { name: 'New York', coordinates: [-74.006, 40.7128] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] },
  { name: 'Rio', coordinates: [-43.1729, -22.9068] },
];

function getGeoDataForProjection(projection: D3NamedProjection) {
  if (projection === 'albersUsa') {
    return USAStates;
  }
  if (projection === 'conicConformal') {
    return countriesWithoutAntarctica;
  }
  return countries;
}

export default function MapZoomControl() {
  const [projection, setProjection] =
    React.useState<D3NamedProjection>('naturalEarth1');
  const apiRef = useChartPremiumApiRef<'mapShape'>();

  const [view, setView] = React.useState<MapZoomView>({
    zoomLevel: 1,
    center: [0, 0],
    translation: [0, 0],
    roll: 0,
  });

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={getGeoDataForProjection(projection)}
          projection={projection}
          apiRef={apiRef}
          zoom
          view={view}
          onViewChange={(newView) => {
            setView(newView);
          }}
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
            setProjection(event.target.value as D3NamedProjection);
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
            Center (longitude, latitude)
          </Typography>
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
                  return setView((prev) => ({
                    ...prev,
                    center: coordinates as [number, number],
                  }));
                }}
              >
                {name}
              </Button>
            ))}
          </ButtonGroup>
          <Slider
            value={view.center[0]}
            min={-180}
            max={180}
            step={1}
            size="small"
            valueLabelDisplay="auto"
            aria-label="center longitude"
            onChange={(event, value) => {
              setView((prev) => ({
                ...prev,
                center: [value as number, prev.center[1]],
              }));
            }}
          />
          <Slider
            value={view.center[1]}
            min={-90}
            max={90}
            step={1}
            size="small"
            valueLabelDisplay="auto"
            aria-label="center latitude"
            onChange={(event, value) => {
              setView((prev) => ({
                ...prev,
                center: [prev.center[0], value as number],
              }));
            }}
          />
          {[
            'azimuthalEqualArea',
            'azimuthalEquidistant',
            'gnomonic',
            'orthographic',
            'stereographic',
          ].includes(projection) && (
            <Slider
              value={view.roll}
              min={-180}
              max={180}
              step={1}
              size="small"
              valueLabelDisplay="auto"
              aria-label="map roll"
              onChange={(event, value) => {
                setView((prev) => ({
                  ...prev,
                  roll: value as number,
                }));
              }}
            />
          )}
        </div>
        <div>
          <Typography gutterBottom variant="caption">
            Translation (x, y as fraction of the drawing area)
          </Typography>
          <Slider
            value={view.translation[0]}
            min={-1}
            max={1}
            step={0.01}
            size="small"
            valueLabelDisplay="auto"
            aria-label="translation x"
            onChange={(event, value) => {
              setView((prev) => ({
                ...prev,
                translation: [value as number, prev.translation[1]],
              }));
            }}
          />
          <Slider
            value={view.translation[1]}
            min={-1}
            max={1}
            step={0.01}
            size="small"
            valueLabelDisplay="auto"
            aria-label="translation y"
            onChange={(event, value) => {
              setView((prev) => ({
                ...prev,
                translation: [prev.translation[0], value as number],
              }));
            }}
          />
        </div>
        <div>
          <Typography gutterBottom variant="caption">
            Zoom Level
          </Typography>
          <Slider
            value={view.zoomLevel}
            min={0.1}
            max={8}
            step={0.2}
            size="small"
            valueLabelDisplay="auto"
            aria-label="zoom level"
            onChange={(event, value) => {
              setView((prev) => ({ ...prev, zoomLevel: value as number }));
            }}
          />
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
