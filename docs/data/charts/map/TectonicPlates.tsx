import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import {
  MapShapePlot,
  Graticule,
  D3NamedProjection,
} from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import {
  type ExtendedFeature,
  type ExtendedFeatureCollection,
} from '@mui/x-charts-vendor/d3-geo';
import tectonicPlates from '../dataset/tectonicPlates.json';

const plates = tectonicPlates as unknown as ExtendedFeatureCollection;

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

// Plates and countries share a few names (India, Australia, ...), so tag each
// feature with its layer and key on `layer:name` to keep the two series apart.
function tagLayer(collection: ExtendedFeatureCollection, layer: string) {
  return collection.features.map((feature) => ({
    ...feature,
    properties: { ...feature.properties, layer },
  }));
}

const geoData: ExtendedFeatureCollection = {
  type: 'FeatureCollection',
  features: [...tagLayer(plates, 'plate'), ...tagLayer(countries, 'country')],
};

const geoFeatureKey = (feature: ExtendedFeature) =>
  `${feature.properties?.layer}:${feature.properties?.name}`;

const plateNames = Array.from(
  new Set(plates.features.map((feature) => String(feature.properties?.name))),
);

const plateData = plateNames.map((name, index) => ({
  name: `plate:${name}`,
  label: name,
  color: `hsl(${Math.round((index / plateNames.length) * 360)}, 55%, 60%)`,
}));

const countryData = countries.features.map((feature) => ({
  name: `country:${feature.properties?.name}`,
}));

export default function TectonicPlates() {
  const [projection, setProjection] =
    React.useState<D3NamedProjection>('naturalEarth1');

  const isGlobe = projection === 'orthographic';

  return (
    <Stack spacing={1} sx={{ width: '100%', maxWidth: 760 }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant="body2" component="h6">
          The 54 tectonic plates of the Earth (PB2002 model)
        </Typography>
        <ToggleButtonGroup
          color="primary"
          size="small"
          exclusive
          value={projection}
          onChange={(_, value: D3NamedProjection | null) =>
            value && setProjection(value)
          }
          aria-label="projection"
        >
          <ToggleButton value="naturalEarth1">Map</ToggleButton>
          <ToggleButton value="orthographic">Globe</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box
        sx={{
          width: '100%',
          // Plates: colored fill with white boundaries.
          '& [data-series="plates"] path': { stroke: '#fff', strokeWidth: 0.5 },
          // Countries: outline only, drawn on top as non-interactive reference
          // geography so plate tooltips still trigger underneath.
          '& [data-series="countries"] path': {
            fill: 'none',
            stroke: '#263238',
            strokeWidth: 0.4,
            pointerEvents: 'none',
          },
        }}
      >
        <ChartsGeoDataProviderPremium
          geoData={geoData}
          geoFeatureKey={geoFeatureKey}
          projection={projection}
          {...(isGlobe && { rotate: [-160, -10] })}
          height={420}
          series={[
            {
              type: 'mapShape',
              id: 'plates',
              label: 'Tectonic plate',
              data: plateData,
              highlightScope: { highlight: 'item' },
              valueFormatter: () => '',
            },
            {
              type: 'mapShape',
              id: 'countries',
              label: 'Country',

              data: countryData,
            },
          ]}
        >
          <ChartsSurface>
            <MapShapePlot />
            <Graticule strokeWidth={0.4} opacity={0.1} />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
        </ChartsGeoDataProviderPremium>
      </Box>
    </Stack>
  );
}
