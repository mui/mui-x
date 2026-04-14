import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsText } from './types.charts-text';

const allowedProps = ['lineHeight', 'needsComputation', 'style', 'text'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsText" allowedProps={allowedProps}>
      <TypesChartsText />
    </TypesPageShell>
  );
}
