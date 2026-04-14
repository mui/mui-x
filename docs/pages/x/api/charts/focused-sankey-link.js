import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesFocusedSankeyLink } from './types.focused-sankey-link';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="FocusedSankeyLink" allowedProps={allowedProps}>
      <TypesFocusedSankeyLink />
    </TypesPageShell>
  );
}
