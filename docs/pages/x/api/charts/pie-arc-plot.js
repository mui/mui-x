import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieArcPlot } from './types.pie-arc-plot';

const allowedProps = ['arcLabelRadius', 'cornerRadius', 'faded', 'highlighted', 'innerRadius', 'onItemClick', 'outerRadius', 'paddingAngle', 'seriesId', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="PieArcPlot" allowedProps={allowedProps}>
      <TypesPieArcPlot />
    </TypesPageShell>
  );
}
