import { Chat, Composer, Conversation, MessageGroup, MessageList } from '@mui/x-chat/headless';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const adapter = {
  async sendMessage() {
    return new ReadableStream();
  },
};

const conversations: ChatConversation[] = [
  {
    id: 'support',
    title: 'Fin',
    subtitle: 'Usually replies in a minute',
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'support-1',
    conversationId: 'support',
    role: 'assistant',
    author: { id: 'fin', displayName: 'Fin' },
    parts: [{ type: 'text', text: 'What can I help you with today?' }],
  },
];

export default function App() {
  return (
    <Chat.Root
      adapter={adapter}
      initialConversations={conversations}
      initialActiveConversationId={conversations[0].id}
      initialMessages={initialMessages}
    >
      <Conversation.Root style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr) auto' }}>
        <Conversation.Header>
          <div>
            <Conversation.Title />
            <Conversation.Subtitle />
          </div>
        </Conversation.Header>
        <MessageList.Root
          renderItem={({ id, index }) => <MessageGroup key={id} index={index} messageId={id} />}
        />
        <Composer.Root>
          <Composer.TextArea aria-label="Message" placeholder="Ask a question" />
          <Composer.SendButton>Send</Composer.SendButton>
        </Composer.Root>
      </Conversation.Root>
    </Chat.Root>
  );
}
