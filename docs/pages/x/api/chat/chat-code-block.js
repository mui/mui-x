import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesChatCodeBlock } from './types.chat-code-block';

const allowedProps = ['children', 'highlighter', 'language'];

export default function Page() {
  return (
    <TypesPageShell name="ChatCodeBlock" allowedProps={allowedProps}>
      <TypesChatCodeBlock />
    </TypesPageShell>
  );
}
