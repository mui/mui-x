import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScatterSeries } from './types.scatter-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ScatterSeries" allowedProps={allowedProps}>
      <TypesScatterSeries />
    </TypesPageShell>
  );
}
