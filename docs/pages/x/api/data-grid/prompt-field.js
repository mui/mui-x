import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPromptField } from './types.prompt-field';

const allowedProps = ['className', 'onRecordError', 'onSubmit', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="PromptField" allowedProps={allowedProps}>
      <TypesPromptField />
    </TypesPageShell>
  );
}
