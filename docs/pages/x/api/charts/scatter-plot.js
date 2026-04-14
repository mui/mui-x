import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScatterPlot } from './types.scatter-plot';

const allowedProps = ['onItemClick', 'renderer', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="ScatterPlot" allowedProps={allowedProps}>
      <TypesScatterPlot />
    </TypesPageShell>
  );
}
