import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';

export default function ExportChartAsSvg() {
  const apiRef = useChartProApiRef<'line'>();

  return (
    <Stack sx={{ width: '100%', gap: 2 }}>
      <LineChartPro
        apiRef={apiRef}
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          { data: [4, 9, 1, 4, 9, 6], label: 'Series A' },
          { data: [2, 5.5, 2, 8.5, 1.5, 5], area: true, label: 'Series B' },
        ]}
        height={300}
        grid={{ vertical: true, horizontal: true }}
      />
      <div>
        <Button
          onClick={() => apiRef.current!.exportAsSvg({ fileName: 'chart' })}
          variant="contained"
        >
          Export SVG
        </Button>
      </div>
    </Stack>
  );
}
