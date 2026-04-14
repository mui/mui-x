import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsDataProvider } from './types.charts-data-provider';

const allowedProps = ['colors', 'dataset', 'height', 'id', 'localeText', 'margin', 'series', 'skipAnimation', 'slotProps', 'slots', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsDataProvider" allowedProps={allowedProps}>
      <TypesChartsDataProvider />
    </TypesPageShell>
  );
}
