import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridRenderContext } from './types.grid-render-context';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridRenderContext" allowedProps={allowedProps}>
      <TypesGridRenderContext />
    </TypesPageShell>
  );
}
