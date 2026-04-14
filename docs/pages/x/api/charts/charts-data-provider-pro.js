import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsDataProviderPro } from './types.charts-data-provider-pro';

const allowedProps = ['colors', 'dataset', 'height', 'id', 'localeText', 'margin', 'series', 'skipAnimation', 'slotProps', 'slots', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsDataProviderPro" allowedProps={allowedProps}>
      <TypesChartsDataProviderPro />
    </TypesPageShell>
  );
}
