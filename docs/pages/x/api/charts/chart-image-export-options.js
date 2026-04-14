import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartImageExportOptions } from './types.chart-image-export-options';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartImageExportOptions" allowedProps={allowedProps}>
      <TypesChartImageExportOptions />
    </TypesPageShell>
  );
}
