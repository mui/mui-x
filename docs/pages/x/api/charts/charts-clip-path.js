import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsClipPath } from './types.charts-clip-path';

const allowedProps = ['id', 'offset'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsClipPath" allowedProps={allowedProps}>
      <TypesChartsClipPath />
    </TypesPageShell>
  );
}
