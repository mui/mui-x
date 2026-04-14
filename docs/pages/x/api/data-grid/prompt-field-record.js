import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPromptFieldRecord } from './types.prompt-field-record';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="PromptFieldRecord" allowedProps={allowedProps}>
      <TypesPromptFieldRecord />
    </TypesPageShell>
  );
}
