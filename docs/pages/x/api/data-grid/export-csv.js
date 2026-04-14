import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesExportCsv } from './types.export-csv';

const allowedProps = ['options', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ExportCsv" allowedProps={allowedProps}>
      <TypesExportCsv />
    </TypesPageShell>
  );
}
