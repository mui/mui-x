import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsReferenceLine } from './types.charts-reference-line';

const allowedProps = ['axisId', 'classes', 'label', 'labelAlign', 'labelStyle', 'lineStyle', 'spacing', 'x', 'y'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsReferenceLine" allowedProps={allowedProps}>
      <TypesChartsReferenceLine />
    </TypesPageShell>
  );
}
