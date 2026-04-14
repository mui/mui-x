import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsTooltip } from './types.charts-tooltip';

const allowedProps = ['anchor', 'anchorEl', 'classes', 'component', 'components', 'componentsProps', 'container', 'disablePortal', 'keepMounted', 'modifiers', 'open', 'placement', 'popperOptions', 'popperRef', 'position', 'slotProps', 'slots', 'sort', 'sx', 'transition', 'trigger'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsTooltip" allowedProps={allowedProps}>
      <TypesChartsTooltip />
    </TypesPageShell>
  );
}
