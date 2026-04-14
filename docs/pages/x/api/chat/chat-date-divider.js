import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatDateDivider } from './types.chat-date-divider';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatDateDivider" allowedProps={allowedProps}>
      <TypesChatDateDivider />
    </TypesPageShell>
  );
}
