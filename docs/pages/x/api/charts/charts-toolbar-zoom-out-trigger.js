import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsToolbarZoomOutTrigger } from './types.charts-toolbar-zoom-out-trigger';

const allowedProps = ['render'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsToolbarZoomOutTrigger" allowedProps={allowedProps}>
      <TypesChartsToolbarZoomOutTrigger />
    </TypesPageShell>
  );
}
