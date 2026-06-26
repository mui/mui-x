import * as React from 'react';
import Box from '@mui/material/Box';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '@mui/x-charts-premium/ChartsGeoDataProviderPremium';
import { MapShapePlot } from '@mui/x-charts-premium/Map';
import { useGeoPath } from '@mui/x-charts-premium/hooks';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartsTooltip } from '@mui/x-charts-premium/ChartsTooltip';
import { geoIdentity } from '@mui/x-charts-vendor/d3-geo';
import { floorPlan, floorData, floorLabels } from './floorPlan';

// Identity projection: coordinates are screen meters, fitted to the drawing area.
const identityProjection = geoIdentity();

function RoomLabels() {
  const path = useGeoPath();
  const projection = path?.projection();
  if (!projection) {
    return null;
  }
  return (
    <g>
      {floorLabels.map((room) => {
        const point = projection(room.center);
        if (!point) {
          return null;
        }
        return (
          <text
            key={room.name}
            x={point[0]}
            y={point[1]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fill="#000"
          >
            {room.name}
          </text>
        );
      })}
    </g>
  );
}

export default function FloorPlanMap() {
  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <ChartsGeoDataProviderPremium
        geoData={floorPlan}
        projection={identityProjection}
        height={460}
        series={[
          {
            type: 'mapShape',
            label: 'Room',
            data: floorData,
            color: '#ffffff',
            valueFormatter: (point) =>
              point.value == null ? 'No data' : `${point.value} m²`,
          },
        ]}
      >
        <ChartsSurface>
          <MapShapePlot stroke="#000" strokeWidth={4} />
          <RoomLabels />
        </ChartsSurface>
        <ChartsTooltip trigger="item" />
      </ChartsGeoDataProviderPremium>
    </Box>
  );
}
