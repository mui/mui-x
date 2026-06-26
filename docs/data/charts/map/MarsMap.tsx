import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { MapImagePlot, MapShapePlot } from '@mui/x-charts-premium/Map';
import { useGeoPath } from '@mui/x-charts-premium/hooks';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { ContinuousColorLegend } from '@mui/x-charts-premium/ChartsLegend';
import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { marsRegions, marsData, marsFeatures } from './marsRegions';

const MARS_IMAGE = '/static/x/charts/mars-viking-mdim21.jpg';

const FEATURE_COLORS = { landmark: '#ffcc66', mission: '#4fc3f7' } as const;

// Notable features projected as labeled markers.
function MarsFeatureMarkers() {
  const path = useGeoPath();
  const projection = path?.projection() as GeoProjection | null;
  if (!projection) {
    return null;
  }
  return (
    <g>
      {marsFeatures.map((feature) => {
        const point = projection([feature.lon, feature.lat]);
        if (!point) {
          return null;
        }
        // Hide features on the hidden hemisphere: their coordinate does not
        // round-trip back to itself through the projection.
        const back = projection.invert?.(point);
        if (
          back &&
          (Math.abs(back[0] - feature.lon) > 1 ||
            Math.abs(back[1] - feature.lat) > 1)
        ) {
          return null;
        }
        const [x, y] = point;
        return (
          <g key={feature.name}>
            <title>{feature.name}</title>
            <circle
              cx={x}
              cy={y}
              r={3}
              fill={FEATURE_COLORS[feature.kind]}
              stroke="#1a1a1a"
              strokeWidth={0.75}
            />
            <text
              x={x + 5}
              y={y + 3}
              fontSize={9}
              fill="#fff"
              stroke="rgba(0, 0, 0, 0.7)"
              strokeWidth={0.5}
              paintOrder="stroke"
            >
              {feature.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

type ProjectionName = 'orthographic' | 'equirectangular';

export default function MarsMap() {
  const [projection, setProjection] = React.useState<ProjectionName>('orthographic');

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 800 }}>
      <ToggleButtonGroup
        color="primary"
        size="small"
        exclusive
        value={projection}
        onChange={(_, value: ProjectionName | null) => value && setProjection(value)}
        aria-label="projection"
      >
        <ToggleButton value="orthographic">orthographic</ToggleButton>
        <ToggleButton value="equirectangular">equirectangular</ToggleButton>
      </ToggleButtonGroup>
      <ChartsGeoDataProviderPremium
        geoData={marsRegions}
        projection={projection}
        rotate={projection === 'orthographic' ? [160, -10] : [0, 0]}
        height={360}
        series={[
          {
            type: 'mapShape',
            label: 'Elevation',
            data: marsData,
            highlightScope: { highlight: 'item' },
            valueFormatter: (point) =>
              point.colorValue == null
                ? 'No data'
                : `${point.colorValue > 0 ? '+' : ''}${point.colorValue} km`,
          },
        ]}
        zAxis={[
          {
            colorMap: {
              type: 'continuous',
              min: -6,
              max: 8,
              color: ['#2c5d8a', '#d8b98c'],
            },
          },
        ]}
      >
        <ChartsSurface>
          <MapImagePlot href={MARS_IMAGE} />
          <g opacity={0.5}>
            <MapShapePlot stroke="#fff" strokeWidth={0.4} />
          </g>
          <MarsFeatureMarkers />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
        <ContinuousColorLegend
          axisDirection="z"
          sx={{ maxWidth: 150, mx: 'auto' }}
        />
      </ChartsGeoDataProviderPremium>
    </Stack>
  );
}
