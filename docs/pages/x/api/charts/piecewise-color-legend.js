import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPiecewiseColorLegend } from './types.piecewise-color-legend';

const allowedProps = ['axisDirection', 'axisId', 'classes', 'direction', 'labelFormatter', 'labelPosition', 'markType', 'onItemClick'];

export default function Page() {
  return (
    <TypesPageShell name="PiecewiseColorLegend" allowedProps={allowedProps}>
      <TypesPiecewiseColorLegend />
    </TypesPageShell>
  );
}
