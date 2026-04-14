import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAreaPlot } from './types.area-plot';

const allowedProps = ['onItemClick', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="AreaPlot" allowedProps={allowedProps}>
      <TypesAreaPlot />
    </TypesPageShell>
  );
}
