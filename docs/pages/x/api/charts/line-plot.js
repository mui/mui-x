import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLinePlot } from './types.line-plot';

const allowedProps = ['onItemClick', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="LinePlot" allowedProps={allowedProps}>
      <TypesLinePlot />
    </TypesPageShell>
  );
}
