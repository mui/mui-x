import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesCandlestickPlot } from './types.candlestick-plot';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="CandlestickPlot" allowedProps={allowedProps}>
      <TypesCandlestickPlot />
    </TypesPageShell>
  );
}
