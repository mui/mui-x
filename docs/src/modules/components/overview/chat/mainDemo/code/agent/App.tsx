import { ChatBox } from '@mui/x-chat';
import type { ChatAdapter, ChatConversation, ChatMessageChunk } from '@mui/x-chat/headless';

const tasks: ChatConversation[] = [
  {
    id: 'fix-tests',
    title: 'Fix failing tests',
    subtitle: 'Awaiting approval',
    unreadCount: 1,
    readState: 'unread',
  },
];

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream<ChatMessageChunk>({
      start(controller) {
        controller.enqueue({
          type: 'start',
          messageId: 'assistant-1',
          author: { id: 'codex', displayName: 'Codex' },
        });
        controller.enqueue({ type: 'start-step' });
        controller.enqueue({ type: 'reasoning-start', id: 'reasoning-1' });
        controller.enqueue({
          type: 'reasoning-delta',
          id: 'reasoning-1',
          delta: 'I should inspect the failing test output before editing files.',
        });
        controller.enqueue({ type: 'reasoning-end', id: 'reasoning-1' });
        controller.enqueue({
          type: 'tool-approval-request',
          dynamic: true,
          toolCallId: 'bash-1',
          toolName: 'bash',
          input: { command: 'pnpm test --runInBand' },
        });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({
          type: 'text-delta',
          id: 'text-1',
          delta: 'I found the failing suite and I am ready to patch the import path.',
        });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish-step' });
        controller.enqueue({ type: 'finish', messageId: 'assistant-1' });
        controller.close();
      },
    });
  },
  async addToolApprovalResponse({ approved }) {
    if (!approved) {
      return;
    }
  },
};

export default function App() {
  return (
    <ChatBox
      adapter={adapter}
      initialConversations={tasks}
      initialActiveConversationId={tasks[0].id}
    />
  );
}
