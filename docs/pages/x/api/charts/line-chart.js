import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineChart } from './types.line-chart';

const allowedProps = ['axesGap', 'axisHighlight', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'disableLineItemHighlight', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedAxis', 'highlightedItem', 'id', 'initialHiddenItems', 'loading', 'localeText', 'margin', 'onAreaClick', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onLineClick', 'onMarkClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis'];

export default function Page() {
  return (
    <TypesPageShell name="LineChart" allowedProps={allowedProps}>
      <TypesLineChart />
    </TypesPageShell>
  );
}
