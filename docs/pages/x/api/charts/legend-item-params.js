import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLegendItemParams } from './types.legend-item-params';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="LegendItemParams" allowedProps={allowedProps}>
      <TypesLegendItemParams />
    </TypesPageShell>
  );
}
