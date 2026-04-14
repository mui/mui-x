import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFunnelChart } from './types.funnel-chart';

const allowedProps = ['axisHighlight', 'categoryAxis', 'colors', 'desc', 'disableAxisListener', 'disableKeyboardNavigation', 'experimentalFeatures', 'gap', 'height', 'hiddenItems', 'hideLegend', 'highlightedItem', 'id', 'initialHiddenItems', 'loading', 'localeText', 'margin', 'onAxisClick', 'onHiddenItemsChange', 'onHighlightChange', 'onItemClick', 'onTooltipItemChange', 'series', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipItem', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="FunnelChart" allowedProps={allowedProps}>
      <TypesFunnelChart />
    </TypesPageShell>
  );
}
