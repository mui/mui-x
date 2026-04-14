import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesTypingIndicator } from './types.typing-indicator';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="TypingIndicator" allowedProps={allowedProps}>
      <TypesTypingIndicator />
    </TypesPageShell>
  );
}
