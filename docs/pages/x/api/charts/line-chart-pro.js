import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineChartPro } from './types.line-chart-pro';

const allowedProps = ['axesGap', 'axisHighlight', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'disableLineItemHighlight', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedAxis', 'highlightedItem', 'id', 'initialHiddenItems', 'initialZoom', 'loading', 'localeText', 'margin', 'onAreaClick', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onLineClick', 'onMarkClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'onZoomChange', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis', 'zoomData', 'zoomInteractionConfig'];

export default function Page() {
  return (
    <TypesPageShell name="LineChartPro" allowedProps={allowedProps}>
      <TypesLineChartPro />
    </TypesPageShell>
  );
}
