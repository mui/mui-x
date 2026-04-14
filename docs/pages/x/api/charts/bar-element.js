import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarElement } from './types.bar-element';

const allowedProps = ['slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="BarElement" allowedProps={allowedProps}>
      <TypesBarElement />
    </TypesPageShell>
  );
}
