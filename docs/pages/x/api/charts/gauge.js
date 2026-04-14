import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGauge } from './types.gauge';

const allowedProps = ['cornerRadius', 'cx', 'cy', 'desc', 'endAngle', 'height', 'id', 'innerRadius', 'margin', 'outerRadius', 'skipAnimation', 'startAngle', 'title', 'value', 'valueMax', 'valueMin', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="Gauge" allowedProps={allowedProps}>
      <TypesGauge />
    </TypesPageShell>
  );
}
