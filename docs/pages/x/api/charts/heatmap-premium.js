import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesHeatmapPremium } from './types.heatmap-premium';

const allowedProps = ['borderRadius', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'experimentalFeatures', 'height', 'hideLegend', 'highlightedItem', 'id', 'initialZoom', 'loading', 'localeText', 'margin', 'onHighlightChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'onZoomChange', 'renderer', 'series', 'showToolbar', 'slotProps', 'slots', 'title', 'tooltip', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis', 'zoomData', 'zoomInteractionConfig'];

export default function Page() {
  return (
    <TypesPageShell name="HeatmapPremium" allowedProps={allowedProps}>
      <TypesHeatmapPremium />
    </TypesPageShell>
  );
}
