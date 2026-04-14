import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsToolbarPro } from './types.charts-toolbar-pro';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChartsToolbarPro" allowedProps={allowedProps}>
      <TypesChartsToolbarPro />
    </TypesPageShell>
  );
}
