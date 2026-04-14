import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSankeyTooltip } from './types.sankey-tooltip';

const allowedProps = ['anchor', 'anchorEl', 'classes', 'component', 'components', 'componentsProps', 'container', 'disablePortal', 'keepMounted', 'modifiers', 'open', 'placement', 'popperOptions', 'popperRef', 'position', 'slotProps', 'slots', 'sx', 'transition', 'trigger'];

export default function Page() {
  return (
    <TypesPageShell name="SankeyTooltip" allowedProps={allowedProps}>
      <TypesSankeyTooltip />
    </TypesPageShell>
  );
}
