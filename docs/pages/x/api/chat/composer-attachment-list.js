import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesComposerAttachmentList } from './types.composer-attachment-list';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ComposerAttachmentList" allowedProps={allowedProps}>
      <TypesComposerAttachmentList />
    </TypesPageShell>
  );
}
