import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFunnelPlot } from './types.funnel-plot';

const allowedProps = ['onItemClick', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="FunnelPlot" allowedProps={allowedProps}>
      <TypesFunnelPlot />
    </TypesPageShell>
  );
}
