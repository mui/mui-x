import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatScrollToBottomAffordance } from './types.chat-scroll-to-bottom-affordance';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ChatScrollToBottomAffordance" allowedProps={allowedProps}>
      <TypesChatScrollToBottomAffordance />
    </TypesPageShell>
  );
}
