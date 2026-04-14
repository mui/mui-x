import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerTextArea } from './types.chat-composer-text-area';

const allowedProps = ['maxRows'];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerTextArea" allowedProps={allowedProps}>
      <TypesChatComposerTextArea />
    </TypesPageShell>
  );
}
