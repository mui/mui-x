import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedRadarMark } from './types.focused-radar-mark';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedRadarMark" allowedProps={allowedProps}>
      <TypesFocusedRadarMark />
    </TypesPageShell>
  );
}
