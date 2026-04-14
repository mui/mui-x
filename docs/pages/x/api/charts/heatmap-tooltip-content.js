import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapTooltipContent } from './types.heatmap-tooltip-content';

const allowedProps = ['classes'];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapTooltipContent" allowedProps={allowedProps}>
      <TypesHeatmapTooltipContent />
    </TypesPageShell>
  );
}
