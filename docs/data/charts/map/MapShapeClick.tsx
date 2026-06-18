import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { feature as topojsonFeature } from 'topojson-client';
import countriesTopology from 'visionscarto-world-atlas/world/110m.json';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import { type MapShapeItemIdentifier } from '@mui/x-charts-premium/models';
import { type ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { EU_COUNTRIES, countryData } from '../dataset/countryData';

const countries = topojsonFeature(
  countriesTopology as any,
  'countries',
) as unknown as ExtendedFeatureCollection;

export default function MapShapeClick() {
  const [itemData, setItemData] = React.useState<MapShapeItemIdentifier>();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1, maxWidth: 800 }}>
        <ChartsGeoDataProviderPremium
          geoData={countries}
          projection="naturalEarth1"
          height={360}
          series={[
            {
              type: 'mapShape',
              label: 'European Union',
              color: '#1976d2',
              data: EU_COUNTRIES.map((code) => ({
                name: countryData[code].country,
              })),
              valueFormatter: (point) => point.name,
            },
          ]}
        >
          <ChartsSurface>
            <GeoDataPlot fill="#f5f5f5" stroke="#bdbdbd" />
            <MapShapePlot
              onItemClick={(event, identifier) => setItemData(identifier)}
            />
          </ChartsSurface>
          <ChartsTooltip trigger="item" />
        </ChartsGeoDataProviderPremium>
      </Box>

      <Stack direction="column" sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography>Click on a shape</Typography>
          <IconButton
            aria-label="reset"
            size="small"
            onClick={() => setItemData(undefined)}
          >
            <UndoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <HighlightedCode
          code={`// Data from item click
${itemData ? JSON.stringify(itemData, null, 2) : '// The data will appear here'}
`}
          language="json"
          copyButtonHidden
        />
      </Stack>
    </Stack>
  );
}
