import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMarkPlot } from './types.mark-plot';

const allowedProps = ['onItemClick', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="MarkPlot" allowedProps={allowedProps}>
      <TypesMarkPlot />
    </TypesPageShell>
  );
}
