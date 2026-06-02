import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const countries = topojsonFeature(countriesTopology, 'countries');

export default function GeoDataPlotDemo() {
  const [fill, setFill] = React.useState('#e3f2fd');
  const [stroke, setStroke] = React.useState('#0d47a1');
  const [strokeWidth, setStrokeWidth] = React.useState(0.5);

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
        >
          <ChartsSurface>
            <GeoDataPlot fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </ChartsSurface>
        </ChartsGeoDataProviderPremium>
      </Box>
      <Stack spacing={2} sx={{ minWidth: 180 }}>
        <TextField
          label="fill"
          type="color"
          value={fill}
          onChange={(event) => setFill(event.target.value)}
        />
        <TextField
          label="stroke"
          type="color"
          value={stroke}
          onChange={(event) => setStroke(event.target.value)}
        />
        <TextField
          label="strokeWidth"
          type="number"
          slotProps={{ htmlInput: { min: 0, max: 5, step: 0.5 } }}
          value={strokeWidth}
          onChange={(event) => setStrokeWidth(Number(event.target.value))}
        />
      </Stack>
    </Stack>
  );
}
