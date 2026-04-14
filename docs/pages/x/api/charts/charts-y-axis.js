import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsYAxis } from './types.charts-y-axis';

const allowedProps = ['axisId', 'classes', 'disableLine', 'disableTicks', 'label', 'labelStyle', 'slotProps', 'slots', 'tickInterval', 'tickLabelInterval', 'tickLabelPlacement', 'tickLabelStyle', 'tickMaxStep', 'tickMinStep', 'tickNumber', 'tickPlacement', 'tickSize'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsYAxis" allowedProps={allowedProps}>
      <TypesChartsYAxis />
    </TypesPageShell>
  );
}
