import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarLabel } from './types.bar-label';

const allowedProps = ['height', 'hidden', 'placement', 'width', 'x', 'xOrigin', 'y', 'yOrigin'];

export default function Page() {
  return (
    <TypesPageShell name="BarLabel" allowedProps={allowedProps}>
      <TypesBarLabel />
    </TypesPageShell>
  );
}
