import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScatterChartPro } from './types.scatter-chart-pro';

const allowedProps = ['axesGap', 'axisHighlight', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableClosestPoint', 'disableHitArea', 'disableKeyboardNavigation', 'disableVoronoi', 'experimentalFeatures', 'grid', 'height', 'hiddenItems', 'hideLegend', 'highlightedItem', 'hitAreaRadius', 'id', 'initialHiddenItems', 'initialZoom', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'onZoomChange', 'renderer', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis', 'zoomData', 'zoomInteractionConfig'];

export default function Page() {
  return (
    <TypesPageShell name="ScatterChartPro" allowedProps={allowedProps}>
      <TypesScatterChartPro />
    </TypesPageShell>
  );
}
