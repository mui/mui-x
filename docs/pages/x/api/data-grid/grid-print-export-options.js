import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridPrintExportOptions } from './types.grid-print-export-options';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridPrintExportOptions" allowedProps={allowedProps}>
      <TypesGridPrintExportOptions />
    </TypesPageShell>
  );
}
