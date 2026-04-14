import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedHeatmapCell } from './types.focused-heatmap-cell';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedHeatmapCell" allowedProps={allowedProps}>
      <TypesFocusedHeatmapCell />
    </TypesPageShell>
  );
}
