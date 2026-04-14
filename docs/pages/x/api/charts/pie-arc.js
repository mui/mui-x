import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieArc } from './types.pie-arc';

const allowedProps = ['skipAnimation', 'skipInteraction'];

export default function Page() {
  return (
    <TypesPageShell name="PieArc" allowedProps={allowedProps}>
      <TypesPieArc />
    </TypesPageShell>
  );
}
