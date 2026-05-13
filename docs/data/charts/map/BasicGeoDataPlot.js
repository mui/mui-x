import * as React from 'react';
import Box from '@mui/material/Box';
import { feature } from 'topojson-client';
import countriesTopology from 'world-atlas/countries-110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot } from '@mui/x-charts-premium/GeoDataPlot';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

const countries = feature(countriesTopology, 'countries');

export default function BasicGeoDataPlot() {
  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <ChartsGeoDataProviderPremium
        geoData={countries}
        projection="naturalEarth1"
        height={420}
      >
        <ChartsSurface>
          <GeoDataPlot fill="#1976d2" stroke="#0d47a1" />
        </ChartsSurface>
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
