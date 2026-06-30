import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import {
  D3NamedProjection,
  GeoDataPlot,
  Graticule,
} from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { useGeoPath } from '@mui/x-charts-premium/hooks';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

function getCountry(name: string): ExtendedFeatureCollection {
  return {
    ...countries,
    features: countries.features.filter(
      (feature) => feature.properties?.name === name,
    ),
  };
}

type Land = 'Japan' | 'United Kingdom' | 'Australia';

const LANDS: Record<
  Land,
  {
    geoData: ExtendedFeatureCollection;
    center: [number, number];
    parallels: [number, number];
  }
> = {
  Japan: {
    geoData: getCountry('Japan'),
    center: [138, 38],
    parallels: [33, 45],
  },
  'United Kingdom': {
    geoData: getCountry('United Kingdom'),
    center: [-2.5, 54],
    parallels: [50, 58],
  },
  Australia: {
    geoData: getCountry('Australia'),
    center: [134, -28],
    parallels: [-36, -18],
  },
};

const projectionGroups: { label: string; projections: D3NamedProjection[] }[] = [
  {
    // https://d3js.org/d3-geo/conic
    label: 'Conic',
    projections: ['conicConformal', 'conicEqualArea', 'conicEquidistant', 'albers'],
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
];

const CONIC_PROJECTIONS: D3NamedProjection[] = [
  'conicConformal',
  'conicEqualArea',
  'conicEquidistant',
  'albers',
];

function isConicProjection(projection: D3NamedProjection) {
  return CONIC_PROJECTIONS.includes(projection);
}

export default function CountryProjectionShape() {
  const [land, setLand] = React.useState<Land>('Japan');
  const [projection, setProjection] = React.useState<D3NamedProjection>('albers');
  const [parallels, setParallels] = React.useState<[number, number]>(
    LANDS.Japan.parallels,
  );

  const { geoData, center } = LANDS[land];
  const conic = isConicProjection(projection);

  const handleLandChange = (nextLand: Land) => {
    const config = LANDS[nextLand];
    setLand(nextLand);
    setProjection('albers');
    setParallels(config.parallels);
  };

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          // Remount when the land or projection changes so the view re-centers on the country.
          key={`${land}-${projection}`}
          geoData={geoData}
          projection={projection}
          parallels={conic ? parallels : undefined}
          initialView={{ zoomLevel: 1, center }}
          zoom
          height={300}
        >
          <ChartsSurface>
            <Graticule stroke="#90caf9" strokeWidth={0.5} />
            {conic && <Parallels parallels={parallels} />}
            <GeoDataPlot fill="#e3f2fd" stroke="#a7a7a7" strokeWidth={0.5} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 220 }}>
        <TextField
          select
          label="Land"
          value={land}
          onChange={(event) => handleLandChange(event.target.value as Land)}
        >
          {(Object.keys(LANDS) as Land[]).map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Projection"
          value={projection}
          onChange={(event) =>
            setProjection(event.target.value as D3NamedProjection)
          }
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
        {conic && (
          <div>
            <Typography gutterBottom variant="body2">
              Standard parallels
            </Typography>
            <Slider
              value={parallels}
              min={-90}
              max={90}
              valueLabelDisplay="auto"
              marks={[
                { value: -90, label: '-90°' },
                { value: 0, label: '0°' },
                { value: 90, label: '90°' },
              ]}
              onChange={(_, value) =>
                setParallels((value as number[]).slice(0, 2) as [number, number])
              }
            />
          </div>
        )}
      </Stack>
    </Stack>
  );
}

const angles = new Array(37).fill(0).map((_, i) => i * 10 - 180);
function Parallels(props: { parallels: [number, number] }) {
  const { parallels } = props;

  const path = useGeoPath();

  if (!path) {
    return null;
  }
  const d = path({
    type: 'MultiLineString',
    coordinates: [
      angles.map((p) => [p, parallels[0]]),

      ...(parallels[1] === parallels[0]
        ? []
        : [angles.map((p) => [p, parallels[1]])]),
    ],
  });

  if (!d) {
    return null;
  }
  return <path d={d} fill="none" stroke="red" strokeWidth={1} />;
}
