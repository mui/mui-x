import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsContainerPremium } from './types.charts-container-premium';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartsContainerPremium" allowedProps={allowedProps}>
      <TypesChartsContainerPremium />
    </TypesPageShell>
  );
}
