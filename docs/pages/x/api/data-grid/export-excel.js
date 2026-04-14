import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesExportExcel } from './types.export-excel';

const allowedProps = ['options', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ExportExcel" allowedProps={allowedProps}>
      <TypesExportExcel />
    </TypesPageShell>
  );
}
