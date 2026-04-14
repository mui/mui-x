import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsContainerPro } from './types.charts-container-pro';

const allowedProps = ['colors', 'dataset', 'disableAxisListener', 'height', 'highlightedItem', 'id', 'initialZoom', 'margin', 'onHighlightChange', 'onZoomChange', 'series', 'skipAnimation', 'width', 'xAxis', 'yAxis', 'zAxis'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsContainerPro" allowedProps={allowedProps}>
      <TypesChartsContainerPro />
    </TypesPageShell>
  );
}
