import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSparkLineChart } from './types.spark-line-chart';

const allowedProps = ['area', 'baseline', 'brushConfig', 'clipAreaOffset', 'color', 'data', 'dataset', 'desc', 'disableAxisListener', 'disableClipping', 'disableHitArea', 'disableKeyboardNavigation', 'experimentalFeatures', 'height', 'hiddenItems', 'highlightedAxis', 'highlightedItem', 'hitAreaRadius', 'id', 'initialHiddenItems', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'plotType', 'showHighlight', 'showTooltip', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'valueFormatter', 'width', 'xAxis', 'yAxis'];

export default function Page() {
  return (
    <TypesPageShell name="SparkLineChart" allowedProps={allowedProps}>
      <TypesSparkLineChart />
    </TypesPageShell>
  );
}
