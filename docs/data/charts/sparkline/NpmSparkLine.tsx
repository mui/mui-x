import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import { SparkLineChart, SparkLineChartProps } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import data from './weekly-downloads.json';

const downloads = data.map((item) => item.downloads);
const weeks = data.map((item) => `${item.start} to ${item.end}`);

const settings: SparkLineChartProps = {
  data: downloads,
  margin: { bottom: 0, top: 5, left: 4, right: 4 },
  xAxis: { id: 'week-axis', data: weeks },
  yAxis: {
    domainLimit: (_, maxValue: number) => ({ min: 0, max: maxValue }),
  },

  sx: {
    [`& .${areaElementClasses.root}`]: { opacity: 0.2 },
    [`& .${lineElementClasses.root}`]: { strokeWidth: 3 },
    [`& .${chartsAxisHighlightClasses.root}`]: {
      stroke: 'rgb(137, 86, 255)',
      strokeDasharray: 'none',
      strokeWidth: 2,
    },
  },
  clipAreaOffset: { top: 2, bottom: 2 },
  axisHighlight: { x: 'line' },
};

export default function NpmSparkLine() {
  const [weekIndex, setWeekIndex] = React.useState<null | number>(null);

  return (
    <div
      onKeyDown={(event) => {
        switch (event.key) {
          case 'ArrowLeft':
            setWeekIndex((p) =>
              p === null ? weeks.length - 1 : (weeks.length + p - 1) % weeks.length,
            );
            break;
          case 'ArrowRight':
            setWeekIndex((p) => (p === null ? 0 : (p + 1) % weeks.length));
            break;
          default:
        }
      }}
      onFocus={() => {
        setWeekIndex((p) => (p === null ? 0 : p));
      }}
      role="button"
      aria-label="Showing weekly downloads"
      tabIndex={0}
    >
      <Stack direction="column" width={300}>
        <Typography sx={{ color: 'rgb(117, 117, 117)', fontWeight: 600, pt: 1 }}>
          <FileDownloadSharpIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
          {weekIndex === null ? 'Weekly Downloads' : weeks[weekIndex]}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ borderBottom: 'solid 2px rgba(137, 86, 255, 0.2)' }}
        >
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {downloads[weekIndex ?? downloads.length - 1].toLocaleString()}
          </Typography>

          <SparkLineChart
            height={40}
            width={200}
            area
            showHighlight
            color="rgb(137, 86, 255)"
            onHighlightedAxisChange={(axisItems) => {
              setWeekIndex(axisItems[0]?.dataIndex ?? null);
            }}
            highlightedAxis={
              weekIndex === null
                ? []
                : [{ axisId: 'week-axis', dataIndex: weekIndex }]
            }
            {...settings}
          />
        </Stack>
      </Stack>
    </div>
  );
}
