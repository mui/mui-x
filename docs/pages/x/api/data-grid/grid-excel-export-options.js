import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridExcelExportOptions } from './types.grid-excel-export-options';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridExcelExportOptions" allowedProps={allowedProps}>
      <TypesGridExcelExportOptions />
    </TypesPageShell>
  );
}
