import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieArcLabel } from './types.pie-arc-label';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="PieArcLabel" allowedProps={allowedProps}>
      <TypesPieArcLabel />
    </TypesPageShell>
  );
}
