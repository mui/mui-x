import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesStandaloneEvent } from './types.standalone-event';

const allowedProps = ['className', 'nativeButton', 'onEventDrop', 'render', 'style', 'sx'];

export default function Page() {
  return (
    <TypesPageShell name="StandaloneEvent" allowedProps={allowedProps}>
      <TypesStandaloneEvent />
    </TypesPageShell>
  );
}
