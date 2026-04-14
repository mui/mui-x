import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieArcLabelPlot } from './types.pie-arc-label-plot';

const allowedProps = ['arcLabel', 'arcLabelMinAngle', 'arcLabelRadius', 'cornerRadius', 'faded', 'highlighted', 'innerRadius', 'outerRadius', 'paddingAngle', 'seriesId', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="PieArcLabelPlot" allowedProps={allowedProps}>
      <TypesPieArcLabelPlot />
    </TypesPageShell>
  );
}
