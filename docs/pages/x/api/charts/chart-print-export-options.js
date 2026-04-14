import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartPrintExportOptions } from './types.chart-print-export-options';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartPrintExportOptions" allowedProps={allowedProps}>
      <TypesChartPrintExportOptions />
    </TypesPageShell>
  );
}
