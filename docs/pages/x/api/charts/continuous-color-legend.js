import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesContinuousColorLegend } from './types.continuous-color-legend';

const allowedProps = ['axisDirection', 'axisId', 'classes', 'direction', 'gradientId', 'labelPosition', 'maxLabel', 'minLabel', 'reverse', 'rotateGradient', 'thickness'];

export default function Page() {
  return (
    <TypesPageShell name="ContinuousColorLegend" allowedProps={allowedProps}>
      <TypesContinuousColorLegend />
    </TypesPageShell>
  );
}
