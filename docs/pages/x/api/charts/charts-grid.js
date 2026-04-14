import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsGrid } from './types.charts-grid';

const allowedProps = ['classes', 'horizontal', 'vertical'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsGrid" allowedProps={allowedProps}>
      <TypesChartsGrid />
    </TypesPageShell>
  );
}
