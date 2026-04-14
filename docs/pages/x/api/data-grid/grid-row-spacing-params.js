import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridRowSpacingParams } from './types.grid-row-spacing-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridRowSpacingParams" allowedProps={allowedProps}>
      <TypesGridRowSpacingParams />
    </TypesPageShell>
  );
}
