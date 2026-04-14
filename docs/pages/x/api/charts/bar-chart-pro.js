import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarChartPro } from './types.bar-chart-pro';

const allowedProps = ['axesGap', 'axisHighlight', 'borderRadius', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedAxis', 'highlightedItem', 'id', 'initialHiddenItems', 'initialZoom', 'layout', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'onZoomChange', 'renderer', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis', 'zoomData', 'zoomInteractionConfig'];

export default function Page() {
  return (
    <TypesPageShell name="BarChartPro" allowedProps={allowedProps}>
      <TypesBarChartPro />
    </TypesPageShell>
  );
}
