import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatComposerAttachmentList } from './types.chat-composer-attachment-list';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatComposerAttachmentList" allowedProps={allowedProps}>
      <TypesChatComposerAttachmentList />
    </TypesPageShell>
  );
}
