import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesExportPrint } from './types.export-print';

const allowedProps = ['options', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ExportPrint" allowedProps={allowedProps}>
      <TypesExportPrint />
    </TypesPageShell>
  );
}
