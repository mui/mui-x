import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScatterChart } from './types.scatter-chart';

const allowedProps = ['axesGap', 'axisHighlight', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableClosestPoint', 'disableHitArea', 'disableKeyboardNavigation', 'disableVoronoi', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedItem', 'hitAreaRadius', 'id', 'initialHiddenItems', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'renderer', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis'];

export default function Page() {
  return (
    <TypesPageShell name="ScatterChart" allowedProps={allowedProps}>
      <TypesScatterChart />
    </TypesPageShell>
  );
}
