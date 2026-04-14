import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageListRoot } from './types.message-list-root';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageListRoot" allowedProps={allowedProps}>
      <TypesMessageListRoot />
    </TypesPageShell>
  );
}
