import * as React from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PrintIcon from '@mui/icons-material/Print';
import PhotoIcon from '@mui/icons-material/Photo';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import {
  ChartsToolbarZoomInTrigger,
  ChartsToolbarZoomOutTrigger,
  ChartsToolbarPrintExportTrigger,
  ChartsToolbarImageExportTrigger,
} from '@mui/x-charts-pro/ChartsToolbarPro';
import { chartsToolbarClasses, Toolbar, ToolbarButton } from '@mui/x-charts/Toolbar';
import { useChartApiContext } from '@mui/x-charts-pro/context';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { data } from './randomData';

const VerticalDivider = styled(Divider)(({ theme }) => ({
  height: 20,
  alignSelf: 'center',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

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
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      gap={1}
      flexWrap="wrap"
    >
      <Typography
        justifyContent="center"
        sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        variant="h6"
      >
        Chart with Custom Toolbar
      </Typography>
      <Stack>
        <Toolbar>
          <Tooltip title="Zoom in">
            <ChartsToolbarZoomInTrigger render={<ToolbarButton size="small" />}>
              <ZoomInIcon />
            </ChartsToolbarZoomInTrigger>
          </Tooltip>
          <Tooltip title="Zoom out">
            <ChartsToolbarZoomOutTrigger render={<ToolbarButton size="small" />}>
              <ZoomOutIcon />
            </ChartsToolbarZoomOutTrigger>
          </Tooltip>

          <ResetZoomButton>Reset</ResetZoomButton>
          <VerticalDivider orientation="vertical" />
          <Tooltip title="Print">
            <ChartsToolbarPrintExportTrigger
              render={<ToolbarButton render={<IconButton size="small" />} />}
              options={{ fileName: 'ChartWithCustomToolbar' }}
            >
              <PrintIcon />
            </ChartsToolbarPrintExportTrigger>
          </Tooltip>
          <Tooltip title="Export as PNG">
            <ChartsToolbarImageExportTrigger
              render={<ToolbarButton render={<IconButton size="small" />} />}
              options={{ type: 'image/png', fileName: 'ChartWithCustomToolbar' }}
            >
              <PhotoIcon />
            </ChartsToolbarImageExportTrigger>
          </Tooltip>
        </Toolbar>
      </Stack>
    </Stack>
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
