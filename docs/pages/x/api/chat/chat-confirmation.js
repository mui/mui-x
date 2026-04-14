import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatConfirmation } from './types.chat-confirmation';

const allowedProps = ['cancelLabel', 'confirmLabel', 'message', 'onCancel', 'onConfirm'];

export default function Page() {
  return (
    <TypesPageShell name="ChatConfirmation" allowedProps={allowedProps}>
      <TypesChatConfirmation />
    </TypesPageShell>
  );
}
