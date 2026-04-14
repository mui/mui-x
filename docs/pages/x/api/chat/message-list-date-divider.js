import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesMessageListDateDivider } from './types.message-list-date-divider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="MessageListDateDivider" allowedProps={allowedProps}>
      <TypesMessageListDateDivider />
    </TypesPageShell>
  );
}
