import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsToolbarImageExportTrigger } from './types.charts-toolbar-image-export-trigger';

const allowedProps = ['options', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsToolbarImageExportTrigger" allowedProps={allowedProps}>
      <TypesChartsToolbarImageExportTrigger />
    </TypesPageShell>
  );
}
