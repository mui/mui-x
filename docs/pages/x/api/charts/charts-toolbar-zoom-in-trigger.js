import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsToolbarZoomInTrigger } from './types.charts-toolbar-zoom-in-trigger';

const allowedProps = ['render'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsToolbarZoomInTrigger" allowedProps={allowedProps}>
      <TypesChartsToolbarZoomInTrigger />
    </TypesPageShell>
  );
}
