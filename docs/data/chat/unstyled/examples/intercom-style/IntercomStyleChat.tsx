import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/unstyled';
import type { ChatMessage, ChatUser } from '@mui/x-chat/headless';
import {
  createEchoAdapter,
  formatMessageTime,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';

// ---------------------------------------------------------------------------
// Intercom-style brand tokens
// ---------------------------------------------------------------------------
const intercom = {
  bg: '#ffffff',
  headerBg: '#ffffff',
  headerBorder: '#e8e8e8',
  bubbleAssistant: '#f4f4f4',
  bubbleUser: '#1a1a1a',
  textPrimary: '#1a1a1a',
  textSecondary: '#737373',
  textOnUser: '#ffffff',
  border: '#e8e8e8',
  inputBg: '#ffffff',
  accent: '#ff7a45',
  radius: 16,
  footerText: '#a3a3a3',
} as const;

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------
function createAvatarDataUrl(label: string, bg: string, fg = '#ffffff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${bg}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="600" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const finAgent: ChatUser = {
  id: 'fin',
  displayName: 'Fin',
  avatarUrl: createAvatarDataUrl('F', '#1a1a1a'),
};

const you: ChatUser = {
  id: 'you',
  displayName: 'You',
  avatarUrl: createAvatarDataUrl('Y', '#ff7a45'),
};

const conversation = {
  id: 'intercom',
  title: 'Fin',
  subtitle: 'The team can also help',
  participants: [you, finAgent],
  readState: 'read' as const,
  unreadCount: 0,
  lastMessageAt: '2026-03-15T12:04:00.000Z',
};

const initialMessages: ChatMessage[] = [
  {
    id: 'ic-a1',
    conversationId: 'intercom',
    role: 'assistant',
    status: 'sent',
    createdAt: '2026-03-15T12:00:00.000Z',
    author: finAgent,
    parts: [
      {
        type: 'text',
        text: "Hi there! I'm Fin, an AI assistant. I noticed you've been looking at our customer service solutions. How can I help you today?",
      },
    ],
  },
  {
    id: 'ic-u1',
    conversationId: 'intercom',
    role: 'user',
    status: 'sent',
    createdAt: '2026-03-15T12:02:00.000Z',
    author: you,
    parts: [{ type: 'text', text: 'Hello, how are you?' }],
  },
  {
    id: 'ic-a2',
    conversationId: 'intercom',
    role: 'assistant',
    status: 'sent',
    createdAt: '2026-03-15T12:04:00.000Z',
    author: finAgent,
    parts: [
      {
        type: 'text',
        text: "Hi there! I'm doing well, thanks for asking. I'm Fin, an AI assistant with Intercom.\n\nBefore I can help you further, could I get your email address?",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Slot components
// ---------------------------------------------------------------------------
const IntercomMessageGroup = React.forwardRef(function IntercomMessageGroup(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { isFirst?: boolean };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gap: 4,
        marginTop: ownerState?.isFirst ? 16 : 10,
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const IntercomAuthorName = React.forwardRef(function IntercomAuthorName(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { role?: string };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  if (ownerState?.role === 'user') {return null;}
  return (
    <div
      ref={ref}
      style={{
        display: 'none',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const IntercomMessageRoot = React.forwardRef(function IntercomMessageRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { role?: string };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 0,
        alignItems: 'flex-end',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const IntercomAvatar = React.forwardRef(function IntercomAvatar(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { role?: string };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  if (ownerState?.role === 'user') {return null;}
  return (
    <div
      ref={ref}
      style={{
        display: 'none',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const IntercomBubble = React.forwardRef(function IntercomBubble(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: { role?: string };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';
  return (
    <div
      ref={ref}
      style={{
        padding: '12px 16px',
        borderRadius: isUser
          ? `${intercom.radius}px ${intercom.radius}px 4px ${intercom.radius}px`
          : `${intercom.radius}px ${intercom.radius}px ${intercom.radius}px 4px`,
        background: isUser ? intercom.bubbleUser : intercom.bubbleAssistant,
        color: isUser ? intercom.textOnUser : intercom.textPrimary,
        maxWidth: '85%',
        fontSize: 14,
        lineHeight: 1.5,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

const IntercomMeta = React.forwardRef(function IntercomMeta(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      role?: string;
      message?: { createdAt?: string; status?: string; author?: ChatUser };
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';
  const author = ownerState?.message?.author;

  return (
    <div
      ref={ref}
      style={{
        color: intercom.textSecondary,
        fontSize: 12,
        textAlign: isUser ? 'right' : 'left',
        marginTop: 4,
        ...style,
      }}
      {...other}
    >
      {!isUser && author?.displayName ? `${author.displayName} · AI Agent · ` : null}
      {formatMessageTime(ownerState?.message?.createdAt)}
    </div>
  );
});

const IntercomComposerRoot = React.forwardRef(function IntercomComposerRoot(
  props: React.PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLFormElement>,
) {
  const { children, ownerState, style, ...other } = props;
  return (
    <form
      ref={ref}
      style={{
        display: 'grid',
        gap: 8,
        padding: '12px 16px',
        borderTop: `1px solid ${intercom.headerBorder}`,
        background: intercom.bg,
        ...style,
      }}
      {...other}
    >
      {children}
    </form>
  );
});

const IntercomTextArea = React.forwardRef(function IntercomTextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLTextAreaElement>,
) {
  const { ownerState, style, ...other } = props;
  return (
    <textarea
      ref={ref}
      style={{
        width: '100%',
        minHeight: 40,
        maxHeight: 160,
        resize: 'none',
        border: 'none',
        background: 'transparent',
        color: intercom.textPrimary,
        padding: 0,
        fontFamily: 'inherit',
        fontSize: 15,
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      {...other}
    />
  );
});

const IntercomSendButton = React.forwardRef(function IntercomSendButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    ownerState?: unknown;
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  const { ownerState, style, disabled, children, ...other } = props;
  return (
    <button
      ref={ref}
      disabled={disabled}
      type="submit"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: 'none',
        background: disabled ? intercom.border : intercom.accent,
        color: '#ffffff',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        justifySelf: 'end',
        ...style,
      }}
      {...other}
    >
      {'\u2191'}
    </button>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function IntercomStyleChat() {
  const [messages, setMessages] = React.useState(initialMessages);
  const adapter = React.useMemo(
    () =>
      createEchoAdapter({
        agent: finAgent,
        respond: (text) =>
          `Thanks for your message! I understand you're asking about "${text}". Let me look into that for you. Is there anything specific you'd like me to focus on?`,
      }),
    [],
  );

  return (
    <Chat.Root
      adapter={adapter}
      conversations={[conversation]}
      initialActiveConversationId="intercom"
      messages={messages}
      onMessagesChange={setMessages}
      slotProps={{
        root: {
          style: {
            background: intercom.bg,
            borderRadius: 20,
            border: `1px solid ${intercom.border}`,
            overflow: 'hidden',
            maxWidth: 400,
            margin: '0 auto',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'grid',
            gridTemplateRows: 'auto minmax(0, 1fr) auto auto',
            height: 560,
          },
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          borderBottom: `1px solid ${intercom.headerBorder}`,
        }}
      >
        <span style={{ fontSize: 18, cursor: 'pointer' }}>{'\u2039'}</span>
        <img
          alt="Fin"
          src={finAgent.avatarUrl}
          style={{ width: 32, height: 32, borderRadius: '50%' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: intercom.textPrimary,
            }}
          >
            Fin
          </div>
          <div style={{ fontSize: 12, color: intercom.textSecondary }}>
            The team can also help
          </div>
        </div>
        <span
          style={{
            fontSize: 20,
            color: intercom.textSecondary,
            cursor: 'pointer',
          }}
        >
          {'\u00b7\u00b7\u00b7'}
        </span>
        <span
          style={{
            fontSize: 20,
            color: intercom.textSecondary,
            cursor: 'pointer',
          }}
        >
          {'\u00d7'}
        </span>
      </div>

      {/* Messages */}
      <Conversation.Root
        slotProps={{
          root: {
            style: {
              minHeight: 0,
              display: 'grid',
              gridTemplateRows: 'minmax(0, 1fr)',
            },
          },
        }}
      >
        <MessageList.Root
          estimatedItemSize={100}
          renderItem={({ id, index }) => (
            <MessageGroup
              index={index}
              key={id}
              messageId={id}
              slots={{
                authorName: IntercomAuthorName,
                root: IntercomMessageGroup,
              }}
            >
              <Message.Root messageId={id} slots={{ root: IntercomMessageRoot }}>
                <Message.Avatar slots={{ avatar: IntercomAvatar }} />
                <Message.Content slots={{ bubble: IntercomBubble }} />
                <Message.Meta slots={{ meta: IntercomMeta }} />
              </Message.Root>
            </MessageGroup>
          )}
          slotProps={{
            root: {
              style: { paddingRight: 0 },
            },
            messageListScroller: {
              style: { padding: '0 16px' },
            },
          }}
        />
      </Conversation.Root>

      {/* Composer */}
      <Composer.Root slots={{ root: IntercomComposerRoot }}>
        <Composer.TextArea
          aria-label="Message"
          placeholder="Message..."
          slots={{ root: IntercomTextArea }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              color: intercom.textSecondary,
              fontSize: 18,
            }}
          >
            <span style={{ cursor: 'pointer' }} title="Attach">
              {'\ud83d\udcce'}
            </span>
            <span style={{ cursor: 'pointer' }} title="Emoji">
              {'\u263a'}
            </span>
            <span
              style={{
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                border: `1px solid ${intercom.border}`,
                borderRadius: 4,
                padding: '0 4px',
                lineHeight: '22px',
              }}
              title="GIF"
            >
              GIF
            </span>
          </div>
          <Composer.SendButton slots={{ root: IntercomSendButton }} />
        </div>
      </Composer.Root>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: intercom.footerText,
          padding: '8px 16px',
        }}
      >
        Powered by Fin
      </div>
    </Chat.Root>
  );
}
