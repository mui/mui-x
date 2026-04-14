import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapTooltip } from './types.heatmap-tooltip';

const allowedProps = ['anchor', 'anchorEl', 'classes', 'component', 'components', 'componentsProps', 'container', 'disablePortal', 'keepMounted', 'modifiers', 'open', 'placement', 'popperOptions', 'popperRef', 'position', 'slotProps', 'slots', 'sx', 'transition', 'trigger'];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapTooltip" allowedProps={allowedProps}>
      <TypesHeatmapTooltip />
    </TypesPageShell>
  );
}
