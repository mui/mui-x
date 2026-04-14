import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPieSeries } from './types.pie-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="PieSeries" allowedProps={allowedProps}>
      <TypesPieSeries />
    </TypesPageShell>
  );
}
