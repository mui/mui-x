import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesLineHighlightElement } from './types.line-highlight-element';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="LineHighlightElement" allowedProps={allowedProps}>
      <TypesLineHighlightElement />
    </TypesPageShell>
  );
}
