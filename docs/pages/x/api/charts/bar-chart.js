import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarChart } from './types.bar-chart';

const allowedProps = ['axesGap', 'axisHighlight', 'borderRadius', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedAxis', 'highlightedItem', 'id', 'initialHiddenItems', 'layout', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'renderer', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis'];

export default function Page() {
  return (
    <TypesPageShell name="BarChart" allowedProps={allowedProps}>
      <TypesBarChart />
    </TypesPageShell>
  );
}
