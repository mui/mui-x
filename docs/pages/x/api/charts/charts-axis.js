import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChartsAxis } from './types.charts-axis';

const allowedProps = ['slotProps', 'slots'];

export default function Page() {
  return (
    <TypesPageShell name="ChartsAxis" allowedProps={allowedProps}>
      <TypesChartsAxis />
    </TypesPageShell>
  );
}
