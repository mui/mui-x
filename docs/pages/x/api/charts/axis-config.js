import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAxisConfig } from './types.axis-config';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="AxisConfig" allowedProps={allowedProps}>
      <TypesAxisConfig />
    </TypesPageShell>
  );
}
