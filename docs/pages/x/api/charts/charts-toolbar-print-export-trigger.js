import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsToolbarPrintExportTrigger } from './types.charts-toolbar-print-export-trigger';

const allowedProps = ['options', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsToolbarPrintExportTrigger" allowedProps={allowedProps}>
      <TypesChartsToolbarPrintExportTrigger />
    </TypesPageShell>
  );
}
