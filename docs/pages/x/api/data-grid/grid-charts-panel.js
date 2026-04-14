import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridChartsPanel } from './types.grid-charts-panel';

const allowedProps = ['getColumnName', 'schema'];

export default function Page() {
  return (
    <TypesPageShell name="GridChartsPanel" allowedProps={allowedProps}>
      <TypesGridChartsPanel />
    </TypesPageShell>
  );
}
