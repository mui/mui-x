import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesToolbarButton } from './types.toolbar-button';

const allowedProps = ['render'];

export default function Page() {
  return (
    <TypesPageShell name="ToolbarButton" allowedProps={allowedProps}>
      <TypesToolbarButton />
    </TypesPageShell>
  );
}
