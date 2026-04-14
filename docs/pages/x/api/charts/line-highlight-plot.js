import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineHighlightPlot } from './types.line-highlight-plot';

const allowedProps = ['slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="LineHighlightPlot" allowedProps={allowedProps}>
      <TypesLineHighlightPlot />
    </TypesPageShell>
  );
}
