import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesColumnsPanelTrigger } from './types.columns-panel-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ColumnsPanelTrigger" allowedProps={allowedProps}>
      <TypesColumnsPanelTrigger />
    </TypesPageShell>
  );
}
