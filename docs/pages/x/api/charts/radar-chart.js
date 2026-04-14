import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesRadarChart } from './types.radar-chart';

const allowedProps = ['className', 'colors', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'divisions', 'experimentalFeatures', 'height', 'hiddenItems', 'hideLegend', 'highlight', 'highlightedItem', 'id', 'initialHiddenItems', 'loading', 'localeText', 'margin', 'onAreaClick', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onMarkClick', 'onTooltipItemChange', 'radar', 'series', 'shape', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'stripeColor', 'title', 'tooltipItem', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="RadarChart" allowedProps={allowedProps}>
      <TypesRadarChart />
    </TypesPageShell>
  );
}
