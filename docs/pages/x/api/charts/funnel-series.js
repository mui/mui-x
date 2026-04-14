import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFunnelSeries } from './types.funnel-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FunnelSeries" allowedProps={allowedProps}>
      <TypesFunnelSeries />
    </TypesPageShell>
  );
}
