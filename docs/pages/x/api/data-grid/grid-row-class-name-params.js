import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridRowClassNameParams } from './types.grid-row-class-name-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridRowClassNameParams" allowedProps={allowedProps}>
      <TypesGridRowClassNameParams />
    </TypesPageShell>
  );
}
