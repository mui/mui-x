import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { AxisItemIdentifier } from '@mui/x-charts/models';

const X_AXIS_ID = 'shared-x';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const charts = [
  {
    id: 'temperature',
    label: 'Temperature',
    color: '#02B2AF',
    data: [3.9, 5.1, 8.4, 12.1, 16.2, 19.8, 21.9, 21.5, 17.9, 13.4, 8.1, 4.8],
    valueFormatter: (value: number) => `${value} °C`,
  },
  {
    id: 'rainfall',
    label: 'Rainfall',
    color: '#2E96FF',
    data: [51, 42, 48, 53, 65, 55, 62, 59, 55, 62, 56, 60],
    valueFormatter: (value: number) => `${value} mm`,
  },
  {
    id: 'sunshine',
    label: 'Sunshine',
    color: '#B800D8',
    data: [62, 81, 129, 166, 194, 202, 212, 212, 168, 118, 68, 51],
    valueFormatter: (value: number) => `${value} h`,
  },
];

export default function SynchronizedTooltip() {
  // Shared between every chart. `[]` when no chart is hovered.
  const [highlightedAxis, setHighlightedAxis] = React.useState<AxisItemIdentifier[]>(
    [],
  );
  const dataIndex = highlightedAxis[0]?.dataIndex ?? null;

  const popperRef: PopperProps['popperRef'] = React.useRef(null);
  const positionRef = React.useRef({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    positionRef.current = { x: event.clientX, y: event.clientY };
    popperRef.current?.update();
  };

  const anchorEl = React.useMemo(
    () => ({
      getBoundingClientRect: () => ({
        x: positionRef.current.x,
        y: positionRef.current.y,
        top: positionRef.current.y,
        left: positionRef.current.x,
        right: positionRef.current.x,
        bottom: positionRef.current.y,
        width: 0,
        height: 0,
        toJSON: () => '',
      }),
    }),
    [],
  );

  return (
    <Stack sx={{ width: '100%' }} onPointerMove={handlePointerMove}>
      {charts.map((chart) => (
        <LineChart
          key={chart.id}
          height={160}
          margin={{ top: 10, bottom: 10 }}
          series={[
            {
              id: chart.id,
              data: chart.data,
              label: chart.label,
              color: chart.color,
              showMark: false,
              valueFormatter: (value) =>
                value === null ? '' : chart.valueFormatter(value),
            },
          ]}
          xAxis={[
            {
              id: X_AXIS_ID,
              scaleType: 'point',
              data: months,
              // Only the last chart displays the shared axis labels.
              tickLabelStyle:
                chart.id === charts[charts.length - 1].id
                  ? undefined
                  : { display: 'none' },
            },
          ]}
          yAxis={[{ width: 52 }]}
          axisHighlight={{ x: 'line' }}
          // Disable the built-in tooltip, a single one is rendered below.
          slotProps={{ tooltip: { trigger: 'none' } }}
          highlightedAxis={highlightedAxis}
          onHighlightedAxisChange={setHighlightedAxis}
          hideLegend
        />
      ))}

      <NoSsr>
        <Popper
          open={dataIndex !== null}
          placement="right-start"
          anchorEl={anchorEl}
          popperRef={popperRef}
          modifiers={popperModifiers}
          sx={{ pointerEvents: 'none', zIndex: (theme) => theme.zIndex.modal }}
        >
          {dataIndex !== null && (
            <Paper elevation={2} sx={{ p: 1.5, minWidth: 160 }}>
              <Typography sx={{ fontWeight: 'medium', mb: 0.5 }}>
                {months[dataIndex]}
              </Typography>
              <Stack spacing={0.5}>
                {charts.map((chart) => (
                  <Stack
                    key={chart.id}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        backgroundColor: chart.color,
                      }}
                    />
                    <Typography sx={{ flexGrow: 1, fontWeight: 'light' }}>
                      {chart.label}
                    </Typography>
                    <Typography>
                      {chart.valueFormatter(chart.data[dataIndex])}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          )}
        </Popper>
      </NoSsr>
    </Stack>
  );
}

const popperModifiers = [
  { name: 'offset', options: { offset: [0, 8] } },
  { name: 'preventOverflow', options: { altAxis: true } },
];
