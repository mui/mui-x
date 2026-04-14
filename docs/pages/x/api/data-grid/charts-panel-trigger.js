import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsPanelTrigger } from './types.charts-panel-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsPanelTrigger" allowedProps={allowedProps}>
      <TypesChartsPanelTrigger />
    </TypesPageShell>
  );
}
