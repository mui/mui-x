import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesAiAssistantPanelTrigger } from './types.ai-assistant-panel-trigger';

const allowedProps = ['className', 'render'];

export default function Page() {
  return (
    <TypesPageShell name="AiAssistantPanelTrigger" allowedProps={allowedProps}>
      <TypesAiAssistantPanelTrigger />
    </TypesPageShell>
  );
}
