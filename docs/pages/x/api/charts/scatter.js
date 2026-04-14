import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScatter } from './types.scatter';

const allowedProps = ['colorGetter', 'onItemClick'];

export default function Page() {
  return (
    <TypesPageShell name="Scatter" allowedProps={allowedProps}>
      <TypesScatter />
    </TypesPageShell>
  );
}
