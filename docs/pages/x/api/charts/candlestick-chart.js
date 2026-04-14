import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesCandlestickChart } from './types.candlestick-chart';

const allowedProps = ['axesGap', 'axisHighlight', 'colors', 'dataset', 'desc', 'disableAxisListener', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedAxis', 'highlightedItem', 'id', 'initialHiddenItems', 'initialZoom', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onTooltipAxisChange', 'onTooltipItemChange', 'onZoomChange', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zoomData', 'zoomInteractionConfig'];

export default function Page() {
  return (
    <TypesPageShell name="CandlestickChart" allowedProps={allowedProps}>
      <TypesCandlestickChart />
    </TypesPageShell>
  );
}
