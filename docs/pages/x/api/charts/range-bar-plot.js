import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRangeBarPlot } from './types.range-bar-plot';

const allowedProps = ['borderRadius', 'onItemClick', 'skipAnimation', 'slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="RangeBarPlot" allowedProps={allowedProps}>
      <TypesRangeBarPlot />
    </TypesPageShell>
  );
}
