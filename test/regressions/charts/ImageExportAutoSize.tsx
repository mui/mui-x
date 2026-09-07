import * as React from 'react';
import Button from '@mui/material/Button';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';

/**
 * The chart has no `width`/`height` props, so it is sized by its parent element. The exported image
 * is the screenshot of the dedicated `index.test.ts` case, and is empty if the export collapses.
 */
export default function ImageExportAutoSize() {
  const apiRef = useChartProApiRef<'bar'>();

  return (
    <div>
      <div style={{ width: 300, height: 200 }}>
        <BarChartPro
          apiRef={apiRef}
          series={[{ data: [10, 20, 30] }, { data: [15, 5, 25] }]}
          xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
        />
      </div>
      <Button onClick={() => apiRef.current!.exportAsImage()} variant="contained">
        Export Image
      </Button>
    </div>
  );
}
