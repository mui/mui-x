import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsDataProviderPremium } from './types.charts-data-provider-premium';

const allowedProps = ['colors', 'dataset', 'height', 'id', 'localeText', 'margin', 'series', 'skipAnimation', 'slotProps', 'slots', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsDataProviderPremium" allowedProps={allowedProps}>
      <TypesChartsDataProviderPremium />
    </TypesPageShell>
  );
}
