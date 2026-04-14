import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsTooltipContainer } from './types.charts-tooltip-container';

const allowedProps = ['anchor', 'anchorEl', 'children', 'classes', 'component', 'components', 'componentsProps', 'container', 'disablePortal', 'keepMounted', 'modifiers', 'open', 'placement', 'popperOptions', 'popperRef', 'position', 'slotProps', 'slots', 'sx', 'transition', 'trigger'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsTooltipContainer" allowedProps={allowedProps}>
      <TypesChartsTooltipContainer />
    </TypesPageShell>
  );
}
