import * as React from 'react';
import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import {
  ChartsToolbarZoomInButton,
  ChartsToolbarZoomOutButton,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { chartsToolbarClasses, Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartApiContext } from '@mui/x-charts-pro/context';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import Button from '@mui/material/Button';
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

const ResetZoomButton = React.forwardRef<HTMLButtonElement, React.PropsWithChildren>(
  function ResetZoomButton(props, ref) {
    const apiRef = useChartApiContext<ChartProApi<'scatter'>>();

    return (
      <ToolbarButton
        {...props}
        ref={ref}
        onClick={() => {
          apiRef.current.setZoomData((prev) =>
            prev.map((zoom) => ({ ...zoom, start: 0, end: 100 })),
          );
        }}
        render={<Button />}
      />
    );
  },
);

function CustomToolbar() {
  return (
    <Toolbar>
      <Typography
        flexGrow={1}
        flexShrink={0}
        justifyContent="center"
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
      >
        Chart with Custom Toolbar
      </Typography>
      <Stack direction="row" flex={1} justifyContent={{ xs: 'center', sm: 'end' }}>
        <Tooltip title="Zoom in">
          <ChartsToolbarZoomInButton>
            <ZoomIn />
          </ChartsToolbarZoomInButton>
        </Tooltip>
        <Tooltip title="Zoom out">
          <ChartsToolbarZoomOutButton>
            <ZoomOut />
          </ChartsToolbarZoomOutButton>
        </Tooltip>

        <ResetZoomButton>Reset</ResetZoomButton>
      </Stack>
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
      sx={{
        [`& .${chartsToolbarClasses.root}`]: {
          width: '100%',
          justifyContent: 'space-between',
          padding: 2,
          flex: 1,
          flexWrap: 'wrap',
          marginBottom: 2,
        },
      }}
    />
  );
}
