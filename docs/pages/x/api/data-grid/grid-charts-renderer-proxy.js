import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridChartsRendererProxy } from './types.grid-charts-renderer-proxy';

const allowedProps = ['id', 'label', 'onRender', 'renderer'];

export default function Page() {
  return (
    <TypesPageShell name="GridChartsRendererProxy" allowedProps={allowedProps}>
      <TypesGridChartsRendererProxy />
    </TypesPageShell>
  );
}
