import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesPromptFieldControl } from './types.prompt-field-control';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="PromptFieldControl" allowedProps={allowedProps}>
      <TypesPromptFieldControl />
    </TypesPageShell>
  );
}
