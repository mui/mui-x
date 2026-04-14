import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesBarSeries } from './types.bar-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="BarSeries" allowedProps={allowedProps}>
      <TypesBarSeries />
    </TypesPageShell>
  );
}
