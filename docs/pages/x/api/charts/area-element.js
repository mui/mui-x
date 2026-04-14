import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAreaElement } from './types.area-element';

const allowedProps = ['skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="AreaElement" allowedProps={allowedProps}>
      <TypesAreaElement />
    </TypesPageShell>
  );
}
