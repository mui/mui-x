import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsBrushOverlay } from './types.charts-brush-overlay';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartsBrushOverlay" allowedProps={allowedProps}>
      <TypesChartsBrushOverlay />
    </TypesPageShell>
  );
}
