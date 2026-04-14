import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedSankeyNode } from './types.focused-sankey-node';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedSankeyNode" allowedProps={allowedProps}>
      <TypesFocusedSankeyNode />
    </TypesPageShell>
  );
}
