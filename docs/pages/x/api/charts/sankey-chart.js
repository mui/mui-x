import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSankeyChart } from './types.sankey-chart';

const allowedProps = ['classes', 'colors', 'desc', 'disableKeyboardNavigation', 'experimentalFeatures', 'height', 'highlightedItem', 'id', 'loading', 'localeText', 'margin', 'onHighlightChange', 'onLinkClick', 'onNodeClick', 'onTooltipItemChange', 'series', 'slotProps', 'slots', 'title', 'tooltipItem', 'width'];

export default function Page() {
  return (
    <TypesPageShell name="SankeyChart" allowedProps={allowedProps}>
      <TypesSankeyChart />
    </TypesPageShell>
  );
}
