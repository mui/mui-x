import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPiePlot } from './types.pie-plot';

const allowedProps = ['onItemClick', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="PiePlot" allowedProps={allowedProps}>
      <TypesPiePlot />
    </TypesPageShell>
  );
}
