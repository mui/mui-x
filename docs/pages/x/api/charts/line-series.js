import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineSeries } from './types.line-series';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="LineSeries" allowedProps={allowedProps}>
      <TypesLineSeries />
    </TypesPageShell>
  );
}
