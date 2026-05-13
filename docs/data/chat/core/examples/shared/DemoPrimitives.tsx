import * as React from 'react';
import type {
  ChatConversation,
  ChatMessage,
  ChatMessagePart,
} from '@mui/x-chat/headless';

const styles = {
  frame: {
    border: '1px solid #d7dee7',
    borderRadius: 16,
    overflow: 'hidden',
    fontFamily:
      '"IBM Plex Sans", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    background:
      'linear-gradient(180deg, rgba(250,252,255,1) 0%, rgba(245,248,252,1) 100%)',
  } satisfies React.CSSProperties,
  split: {
    display: 'grid',
    gridTemplateColumns: '240px minmax(0, 1fr)',
    minHeight: 520,
  } satisfies React.CSSProperties,
  sidebar: {
    borderRight: '1px solid #d7dee7',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: '#f7fafc',
  } satisfies React.CSSProperties,
  main: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
  } satisfies React.CSSProperties,
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#132238',
  } satisfies React.CSSProperties,
  description: {
    margin: 0,
    fontSize: 13,
    color: '#5c6b7c',
  } satisfies React.CSSProperties,
  sectionLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#66788a',
  } satisfies React.CSSProperties,
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  } satisfies React.CSSProperties,
  conversationButton: {
    width: '100%',
    border: '1px solid #d7dee7',
    borderRadius: 12,
    background: '#fff',
    padding: 12,
    textAlign: 'left',
    cursor: 'pointer',
    font: 'inherit',
  } satisfies React.CSSProperties,
  activeConversationButton: {
    borderColor: '#0b6bcb',
    boxShadow: '0 0 0 1px #0b6bcb',
    background: '#eef6ff',
  } satisfies React.CSSProperties,
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minHeight: 160,
    maxHeight: 320,
    overflow: 'auto',
    padding: 4,
  } satisfies React.CSSProperties,
  messageBubble: {
    borderRadius: 14,
    padding: 12,
    maxWidth: '85%',
    border: '1px solid #d7dee7',
    background: '#fff',
  } satisfies React.CSSProperties,
  userBubble: {
    marginLeft: 'auto',
    background: '#0b6bcb',
    color: '#fff',
    borderColor: '#0b6bcb',
  } satisfies React.CSSProperties,
  meta: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
    fontSize: 12,
    color: '#5c6b7c',
  } satisfies React.CSSProperties,
  userMeta: {
    color: 'rgba(255,255,255,0.82)',
  } satisfies React.CSSProperties,
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  } satisfies React.CSSProperties,
  button: {
    border: '1px solid #c4d0dd',
    borderRadius: 999,
    background: '#fff',
    color: '#132238',
    padding: '8px 12px',
    cursor: 'pointer',
    font: 'inherit',
    whiteSpace: 'nowrap',
    fontSize: 13,
  } satisfies React.CSSProperties,
  buttonDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  } satisfies React.CSSProperties,
  textarea: {
    width: '100%',
    minHeight: 84,
    borderRadius: 12,
    border: '1px solid #c4d0dd',
    padding: 12,
    font: 'inherit',
    resize: 'vertical',
    background: '#fff',
    boxSizing: 'border-box',
  } satisfies React.CSSProperties,
  input: {
    flex: 1,
    minWidth: 0,
    borderRadius: 999,
    border: '1px solid #c4d0dd',
    padding: '10px 14px',
    font: 'inherit',
    background: '#fff',
    boxSizing: 'border-box',
  } satisfies React.CSSProperties,
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 8,
  } satisfies React.CSSProperties,
  statCard: {
    border: '1px solid #d7dee7',
    borderRadius: 12,
    padding: 10,
    background: '#fff',
  } satisfies React.CSSProperties,
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: '3px 8px',
    background: '#edf2f8',
    color: '#334a62',
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,
  codeBlock: {
    margin: 0,
    padding: 12,
    borderRadius: 12,
    background: '#132238',
    color: '#eff7ff',
    overflow: 'auto',
    fontSize: 12,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  } satisfies React.CSSProperties,
} as const;

export function DemoFrame({ children }: React.PropsWithChildren) {
  return <div style={styles.frame}>{children}</div>;
}

export function DemoSplitLayout({
  sidebar,
  children,
}: React.PropsWithChildren<{ sidebar: React.ReactNode }>) {
  return (
    <div style={styles.split}>
      <aside style={styles.sidebar}>{sidebar}</aside>
      <section style={styles.main}>{children}</section>
    </div>
  );
}

export function DemoHeading({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'start',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h3 style={styles.title}>{title}</h3>
        {description ? <p style={styles.description}>{description}</p> : null}
      </div>
      {actions ? (
        <div style={{ ...styles.toolbar, flexShrink: 0 }}>{actions}</div>
      ) : null}
    </div>
  );
}

export function DemoSectionLabel({ children }: React.PropsWithChildren) {
  return <p style={styles.sectionLabel}>{children}</p>;
}

export function DemoButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { style, disabled, ...other } = props;

  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        ...styles.button,
        ...(disabled ? styles.buttonDisabled : null),
        ...style,
      }}
      {...other}
    />
  );
}

export function DemoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...other } = props;

  return <input style={{ ...styles.input, ...style }} {...other} />;
}

export function DemoTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { style, ...other } = props;

  return <textarea style={{ ...styles.textarea, ...style }} {...other} />;
}

export function DemoTag({ children }: React.PropsWithChildren) {
  return <span style={styles.tag}>{children}</span>;
}

export function DemoConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: {
  conversations: ChatConversation[];
  activeConversationId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div style={styles.list}>
      {conversations.map((conversation) => (
        <button
          type="button"
          key={conversation.id}
          onClick={() => onSelect?.(conversation.id)}
          style={{
            ...styles.conversationButton,
            ...(conversation.id === activeConversationId
              ? styles.activeConversationButton
              : null),
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {conversation.title ?? conversation.id}
          </div>
          {conversation.subtitle ? (
            <div style={{ marginTop: 4, fontSize: 12, color: '#5c6b7c' }}>
              {conversation.subtitle}
            </div>
          ) : null}
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {conversation.unreadCount ? (
              <DemoTag>{conversation.unreadCount} unread</DemoTag>
            ) : null}
            {conversation.readState ? (
              <DemoTag>{conversation.readState}</DemoTag>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}

function renderDefaultPart(part: ChatMessagePart) {
  if (part.type === 'text' || part.type === 'reasoning') {
    return <div>{part.text}</div>;
  }

  if (part.type === 'tool' || part.type === 'dynamic-tool') {
    return (
      <div>
        <strong>{part.toolInvocation.toolName}</strong>: {part.toolInvocation.state}
      </div>
    );
  }

  if (part.type === 'file') {
    return (
      <a href={part.url} target="_blank" rel="noreferrer">
        {part.filename ?? part.url}
      </a>
    );
  }

  if (part.type === 'source-url') {
    return (
      <a href={part.url} target="_blank" rel="noreferrer">
        {part.title ?? part.url}
      </a>
    );
  }

  if (part.type === 'source-document') {
    return <div>{part.title ?? part.text ?? 'Source document'}</div>;
  }

  if (part.type === 'step-start') {
    return <div>Step started</div>;
  }

  if (part.type.startsWith('data-') && 'data' in part) {
    return <pre style={{ margin: 0 }}>{JSON.stringify(part.data, null, 2)}</pre>;
  }

  return <pre style={{ margin: 0 }}>{JSON.stringify(part, null, 2)}</pre>;
}

export function DemoMessageList({
  messages,
  renderPart,
  emptyLabel = 'No messages yet.',
}: {
  messages: ChatMessage[];
  renderPart?: (
    part: ChatMessagePart,
    message: ChatMessage,
    index: number,
  ) => React.ReactNode | null | undefined;
  emptyLabel?: string;
}) {
  if (messages.length === 0) {
    return (
      <div
        style={{ ...styles.messageList, justifyContent: 'center', color: '#5c6b7c' }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div style={styles.messageList}>
      {messages.map((message) => {
        const isUser = message.role === 'user';

        return (
          <div
            key={message.id}
            style={{
              ...styles.messageBubble,
              ...(isUser ? styles.userBubble : null),
            }}
          >
            <div style={{ ...styles.meta, ...(isUser ? styles.userMeta : null) }}>
              <strong>{message.author?.displayName ?? message.role}</strong>
              {message.status ? <span>{message.status}</span> : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {message.parts.map((part, index) => (
                <div key={`${message.id}-${part.type}-${index}`}>
                  {renderPart?.(part, message, index) ?? renderDefaultPart(part)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DemoStats({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <div style={styles.statsGrid}>
      {items.map((item) => (
        <div key={item.label} style={styles.statCard}>
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              color: '#66788a',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 16,
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DemoCodeBlock({ children }: React.PropsWithChildren) {
  return <pre style={styles.codeBlock}>{children}</pre>;
}
