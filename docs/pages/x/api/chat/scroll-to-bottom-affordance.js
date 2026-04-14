import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesScrollToBottomAffordance } from './types.scroll-to-bottom-affordance';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="ScrollToBottomAffordance" allowedProps={allowedProps}>
      <TypesScrollToBottomAffordance />
    </TypesPageShell>
  );
}
