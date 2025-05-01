import * as React from 'react';
import Cached from '@mui/icons-material/Cached';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import {
  ChartsToolbarZoomInButton,
  ChartsToolbarZoomOutButton,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartApiContext } from '@mui/x-charts-pro/context';
import Tooltip from '@mui/material/Tooltip';
import { data } from './randomData';

const params = {
  height: 300,
  series: [
    {
      label: 'Series A',
      data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    },
    {
      label: 'Series B',
      data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    },
  ],
};

function ResetZoomButton() {
  const api = useChartApiContext();

  return (
    <Tooltip title="Reset zoom">
      <ToolbarButton
        onClick={() => {
          api.setZoomData((prev) =>
            prev.map((zoom) => ({ ...zoom, start: 0, end: 100 })),
          );
        }}
      >
        <Cached />
      </ToolbarButton>
    </Tooltip>
  );
}

function CustomToolbar() {
  return (
    <Toolbar>
      <ChartsToolbarZoomInButton />
      <ChartsToolbarZoomOutButton />
      <ResetZoomButton />
    </Toolbar>
  );
}

export default function ChartsToolbarCustomToolbar() {
  return (
    <ScatterChartPro
      {...params}
      xAxis={[{ zoom: true }]}
      yAxis={[{ zoom: true }]}
      showToolbar
      slots={{ toolbar: CustomToolbar }}
    />
  );
}
