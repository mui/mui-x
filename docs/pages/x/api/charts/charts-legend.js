import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsLegend } from './types.charts-legend';

const allowedProps = ['classes', 'direction', 'onItemClick', 'slotProps', 'slots', 'toggleVisibilityOnClick'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsLegend" allowedProps={allowedProps}>
      <TypesChartsLegend />
    </TypesPageShell>
  );
}
