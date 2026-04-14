import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsAxisHighlight } from './types.charts-axis-highlight';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartsAxisHighlight" allowedProps={allowedProps}>
      <TypesChartsAxisHighlight />
    </TypesPageShell>
  );
}
