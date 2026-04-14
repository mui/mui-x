import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPivotPanelTrigger } from './types.pivot-panel-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="PivotPanelTrigger" allowedProps={allowedProps}>
      <TypesPivotPanelTrigger />
    </TypesPageShell>
  );
}
