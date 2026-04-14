import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridRowParams } from './types.grid-row-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridRowParams" allowedProps={allowedProps}>
      <TypesGridRowParams />
    </TypesPageShell>
  );
}
