import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsXAxis } from './types.charts-x-axis';

const allowedProps = ['axisId', 'classes', 'disableLine', 'disableTicks', 'label', 'labelStyle', 'slotProps', 'slots', 'tickInterval', 'tickLabelInterval', 'tickLabelMinGap', 'tickLabelPlacement', 'tickLabelStyle', 'tickMaxStep', 'tickMinStep', 'tickNumber', 'tickPlacement', 'tickSize'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsXAxis" allowedProps={allowedProps}>
      <TypesChartsXAxis />
    </TypesPageShell>
  );
}
