import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapPlot } from './types.heatmap-plot';

const allowedProps = ['borderRadius', 'className', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapPlot" allowedProps={allowedProps}>
      <TypesHeatmapPlot />
    </TypesPageShell>
  );
}
