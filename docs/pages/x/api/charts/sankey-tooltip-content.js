import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSankeyTooltipContent } from './types.sankey-tooltip-content';

const allowedProps = ['classes'];

export default function Page() {
  return (
    <TypesPageShell name="SankeyTooltipContent" allowedProps={allowedProps}>
      <TypesSankeyTooltipContent />
    </TypesPageShell>
  );
}
