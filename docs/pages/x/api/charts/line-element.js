import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineElement } from './types.line-element';

const allowedProps = ['hidden', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="LineElement" allowedProps={allowedProps}>
      <TypesLineElement />
    </TypesPageShell>
  );
}
