import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridExportStateParams } from './types.grid-export-state-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridExportStateParams" allowedProps={allowedProps}>
      <TypesGridExportStateParams />
    </TypesPageShell>
  );
}
