import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarPlot } from './types.bar-plot';

const allowedProps = ['borderRadius', 'className', 'onItemClick', 'renderer', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="BarPlot" allowedProps={allowedProps}>
      <TypesBarPlot />
    </TypesPageShell>
  );
}
