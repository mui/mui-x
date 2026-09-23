import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { interpolateBlues } from 'd3-scale-chromatic';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { useChartRootRef } from '@mui/x-charts/hooks';
import { useChartPremiumApiRef } from '@mui/x-charts-premium/hooks';
import { PiecewiseColorLegend } from '@mui/x-charts-premium/ChartsLegend';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { countryData } from '../dataset/countryData';
import { internetUsageByCountry } from '../dataset/internetUsageByCountry';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

const data = Object.keys(countryData).map((code) => ({
  name: code,
  label: countryData[code].country,
  colorValue: internetUsageByCountry[code],
}));

function CustomChartWrapper({ children }: React.PropsWithChildren) {
  const chartRootRef = useChartRootRef();

  return <div ref={chartRootRef}>{children}</div>;
}

export default function ExportMap() {
  const apiRef = useChartPremiumApiRef<'mapShape'>();

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button
          variant="contained"
          onClick={() => apiRef.current?.exportAsImage({ type: 'image/png' })}
        >
          Export as PNG
        </Button>
        <Button variant="outlined" onClick={() => apiRef.current?.exportAsPrint()}>
          Print / Export as PDF
        </Button>
      </Stack>
      <ChartsGeoDataProviderPremium
        apiRef={apiRef}
        geoData={countries}
        projection="naturalEarth1"
        height={420}
        series={[
          {
            type: 'mapShape',
            label: 'World',
            color: 'lightgray',
            data,
          },
        ]}
        zAxis={[
          {
            id: 'internet-usage',
            colorMap: {
              type: 'piecewise',
              thresholds: [25, 50, 75],
              colors: [0.25, 0.5, 0.75, 1].map(interpolateBlues),
            },
          },
        ]}
      >
        <CustomChartWrapper>
          <ChartsSurface>
            <GeoDataPlot fill="#e3f2fd" stroke="#0d47a1" />
          </ChartsSurface>
        </CustomChartWrapper>
        <PiecewiseColorLegend axisDirection="z" direction="horizontal" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
