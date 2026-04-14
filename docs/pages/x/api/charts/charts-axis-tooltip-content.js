import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsAxisTooltipContent } from './types.charts-axis-tooltip-content';

const allowedProps = ['classes', 'sort'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsAxisTooltipContent" allowedProps={allowedProps}>
      <TypesChartsAxisTooltipContent />
    </TypesPageShell>
  );
}
