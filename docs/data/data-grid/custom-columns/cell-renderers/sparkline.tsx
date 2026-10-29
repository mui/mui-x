import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import type { GridRenderCellParams } from '@mui/x-data-grid';

export function renderSparkline(params: GridRenderCellParams) {
  if (params.value == null) {
    return '';
  }

  return (
    <SparkLineChart
      data={params.value}
      width={params.colDef.computedWidth}
      plotType="bar"
    />
  );
}
