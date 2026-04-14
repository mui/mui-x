import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridCsvExportOptions } from './types.grid-csv-export-options';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridCsvExportOptions" allowedProps={allowedProps}>
      <TypesGridCsvExportOptions />
    </TypesPageShell>
  );
}
