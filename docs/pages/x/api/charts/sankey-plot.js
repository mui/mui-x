import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesSankeyPlot } from './types.sankey-plot';

const allowedProps = ['classes', 'onLinkClick', 'onNodeClick'];

export default function Page() {
  return (
    <TypesPageShell name="SankeyPlot" allowedProps={allowedProps}>
      <TypesSankeyPlot />
    </TypesPageShell>
  );
}
