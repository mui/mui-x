import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsWrapper } from './types.charts-wrapper';

const allowedProps = ['extendVertically', 'hideLegend', 'legendDirection', 'legendPosition'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsWrapper" allowedProps={allowedProps}>
      <TypesChartsWrapper />
    </TypesPageShell>
  );
}
