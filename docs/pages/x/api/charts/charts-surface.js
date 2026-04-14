import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsSurface } from './types.charts-surface';

const allowedProps = ['desc', 'title'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsSurface" allowedProps={allowedProps}>
      <TypesChartsSurface />
    </TypesPageShell>
  );
}
