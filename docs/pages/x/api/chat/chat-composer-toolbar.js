import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerToolbar } from './types.chat-composer-toolbar';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerToolbar" allowedProps={allowedProps}>
      <TypesChatComposerToolbar />
    </TypesPageShell>
  );
}
