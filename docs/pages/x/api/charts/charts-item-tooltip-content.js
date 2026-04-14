import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsItemTooltipContent } from './types.charts-item-tooltip-content';

const allowedProps = ['classes'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsItemTooltipContent" allowedProps={allowedProps}>
      <TypesChartsItemTooltipContent />
    </TypesPageShell>
  );
}
