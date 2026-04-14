import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPromptFieldSend } from './types.prompt-field-send';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="PromptFieldSend" allowedProps={allowedProps}>
      <TypesPromptFieldSend />
    </TypesPageShell>
  );
}
