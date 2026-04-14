import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsContainer } from './types.charts-container';

const allowedProps = ['axesGap', 'brushConfig', 'colors', 'dataset', 'desc', 'disableAxisListener', 'disableHitArea', 'disableKeyboardNavigation', 'experimentalFeatures', 'height', 'hiddenItems', 'highlightedAxis', 'highlightedItem', 'hitAreaRadius', 'id', 'initialHiddenItems', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onHighlightedAxisChange', 'onItemClick', 'onTooltipAxisChange', 'onTooltipItemChange', 'radiusAxis', 'rotationAxis', 'series', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipAxis', 'tooltipItem', 'width', 'xAxis', 'yAxis', 'zAxis'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsContainer" allowedProps={allowedProps}>
      <TypesChartsContainer />
    </TypesPageShell>
  );
}
