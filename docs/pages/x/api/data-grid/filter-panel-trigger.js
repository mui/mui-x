import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFilterPanelTrigger } from './types.filter-panel-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="FilterPanelTrigger" allowedProps={allowedProps}>
      <TypesFilterPanelTrigger />
    </TypesPageShell>
  );
}
