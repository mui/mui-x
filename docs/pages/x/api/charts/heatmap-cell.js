import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapCell } from './types.heatmap-cell';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapCell" allowedProps={allowedProps}>
      <TypesHeatmapCell />
    </TypesPageShell>
  );
}
