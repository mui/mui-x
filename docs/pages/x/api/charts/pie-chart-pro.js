import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieChartPro } from './types.pie-chart-pro';

const allowedProps = ['colors', 'dataset', 'desc', 'disableKeyboardNavigation', 'experimentalFeatures', 'height', 'hiddenItems', 'hideLegend', 'highlightedItem', 'id', 'initialHiddenItems', 'loading', 'localeText', 'margin', 'onHiddenItemsChange', 'onHighlightChange', 'onItemClick', 'onTooltipItemChange', 'series', 'showToolbar', 'skipAnimation', 'slotProps', 'slots', 'title', 'tooltipItem', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="PieChartPro" allowedProps={allowedProps}>
      <TypesPieChartPro />
    </TypesPageShell>
  );
}
