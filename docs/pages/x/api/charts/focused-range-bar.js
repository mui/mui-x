import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedRangeBar } from './types.focused-range-bar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedRangeBar" allowedProps={allowedProps}>
      <TypesFocusedRangeBar />
    </TypesPageShell>
  );
}
