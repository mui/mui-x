import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGaugeContainer } from './types.gauge-container';

const allowedProps = ['cornerRadius', 'cx', 'cy', 'desc', 'endAngle', 'height', 'id', 'innerRadius', 'margin', 'outerRadius', 'skipAnimation', 'startAngle', 'title', 'value', 'valueMax', 'valueMin', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="GaugeContainer" allowedProps={allowedProps}>
      <TypesGaugeContainer />
    </TypesPageShell>
  );
}
