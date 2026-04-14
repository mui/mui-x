import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerLabel } from './types.chat-composer-label';

const allowedProps = ['children', 'htmlFor'];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerLabel" allowedProps={allowedProps}>
      <TypesChatComposerLabel />
    </TypesPageShell>
  );
}
