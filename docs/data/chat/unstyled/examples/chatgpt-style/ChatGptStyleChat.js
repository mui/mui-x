import * as React from 'react';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import MicNoneRoundedIcon from '@mui/icons-material/MicNoneRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

import {
  Chat,
  Conversation,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/headless';

import {
  createEchoAdapter,
  cloneConversations,
  cloneMessages,
  syncConversationPreview,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';

// ---------------------------------------------------------------------------
// ChatGPT-style brand tokens
// ---------------------------------------------------------------------------
const gpt = {
  bg: '#212121',
  sidebar: '#171717',
  sidebarHover: '#2f2f2f',
  sidebarSelected: '#2f2f2f',
  surface: '#212121',
  text: '#ececec',
  textSecondary: '#b4b4b4',
  textMuted: '#8e8e8e',
  border: '#2f2f2f',
  composerBg: '#2f2f2f',
  composerBorder: '#424242',
  accent: '#10a37f',
  userBubble: '#2f2f2f',
  unreadDot: '#3b82f6',
};

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------
const assistant = {
  id: 'chatgpt',
  displayName: 'ChatGPT',
  avatarUrl: undefined,
};

const you = {
  id: 'you',
  displayName: 'You',
  avatarUrl: undefined,
};

const conversations = [
  {
    id: 'historical',
    title: 'Fascinating Historical Figure',
    subtitle: 'Tell me about a fascinating historical figure',
    participants: [you, assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-15T14:00:00.000Z',
  },
  {
    id: 'cooking',
    title: 'Quick Pasta Recipe',
    subtitle: 'What is a quick pasta recipe?',
    participants: [you, assistant],
    readState: 'unread',
    unreadCount: 1,
    lastMessageAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 'coding',
    title: 'React Custom Hooks',
    subtitle: 'How do I create a custom hook in React?',
    participants: [you, assistant],
    readState: 'read',
    unreadCount: 0,
    lastMessageAt: '2026-03-13T16:30:00.000Z',
  },
];

const allThreads = {
  historical: [
    {
      id: 'h-u1',
      conversationId: 'historical',
      role: 'user',
      status: 'sent',
      createdAt: '2026-03-15T13:55:00.000Z',
      author: you,
      parts: [
        {
          type: 'text',
          text: 'Tell me about a fascinating historical figure that most people have never heard of.',
        },
      ],
    },
    {
      id: 'h-a1',
      conversationId: 'historical',
      role: 'assistant',
      status: 'sent',
      createdAt: '2026-03-15T14:00:00.000Z',
      author: assistant,
      parts: [
        {
          type: 'reasoning',
          text: "The user wants someone truly remarkable yet underrecognized.\n\nRamanujan immediately stands out — a self-taught prodigy from rural India who independently discovered thousands of theorems with no formal training. His partnership with Hardy, the taxicab number story, and results still being verified today make him a perfect answer.\n\nI'll highlight the most striking facts: the sheer volume of his work, the Hardy letter, and the 1729 number.",
          state: 'done',
        },
        {
          type: 'text',
          text: 'One of history\'s most fascinating yet overlooked figures is **Srinivasa Ramanujan** (1887\u20131920), an Indian mathematician who made extraordinary contributions to number theory, continued fractions, and infinite series.\n\nHere are some remarkable facts about him:\n\n- He had almost no formal training in mathematics, yet independently compiled nearly 3,900 results\n- Many of his theorems were so ahead of their time that mathematicians are still proving them correct today\n- He famously wrote a letter to G.H. Hardy at Cambridge, which Hardy described as "the most remarkable letter I have ever received"\n- The number 1729 is known as the "Hardy-Ramanujan number" \u2014 the smallest number expressible as the sum of two cubes in two different ways',
        },
      ],
    },
  ],
  cooking: [
    {
      id: 'c-u1',
      conversationId: 'cooking',
      role: 'user',
      status: 'sent',
      createdAt: '2026-03-14T09:55:00.000Z',
      author: you,
      parts: [
        {
          type: 'text',
          text: 'What is a quick pasta recipe I can make in 15 minutes?',
        },
      ],
    },
    {
      id: 'c-a1',
      conversationId: 'cooking',
      role: 'assistant',
      status: 'sent',
      createdAt: '2026-03-14T10:00:00.000Z',
      author: assistant,
      parts: [
        {
          type: 'text',
          text: "Here's a quick **Aglio e Olio** recipe:\n\n1. Boil spaghetti in salted water until al dente\n2. Slice 4-5 garlic cloves thinly\n3. Heat olive oil in a pan, saut\u00e9 garlic until golden\n4. Add red pepper flakes to taste\n5. Toss the drained pasta in the garlic oil\n6. Finish with fresh parsley and parmesan\n\nTotal time: about 12 minutes. Simple and delicious!",
        },
      ],
    },
  ],
  coding: [
    {
      id: 'r-u1',
      conversationId: 'coding',
      role: 'user',
      status: 'sent',
      createdAt: '2026-03-13T16:25:00.000Z',
      author: you,
      parts: [{ type: 'text', text: 'How do I create a custom hook in React?' }],
    },
    {
      id: 'r-a1',
      conversationId: 'coding',
      role: 'assistant',
      status: 'sent',
      createdAt: '2026-03-13T16:30:00.000Z',
      author: assistant,
      parts: [
        {
          type: 'dynamic-tool',
          toolInvocation: {
            toolCallId: 'tc-search-1',
            toolName: 'search_docs',
            title: 'Search React Docs',
            state: 'output-available',
            input: { query: 'custom hooks React rules' },
            output: {
              results: [
                'Hook names must start with "use" followed by a capital letter',
                'Only call hooks at the top level — not inside loops or conditions',
                'Only call hooks from React function components or other custom hooks',
              ],
            },
          },
        },
        {
          type: 'text',
          text: "A custom hook is just a JavaScript function whose name starts with `use` and that can call other hooks.\n\nHere's a simple example:\n\n```tsx\nfunction useWindowWidth() {\n  const [width, setWidth] = React.useState(window.innerWidth);\n\n  React.useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n\n  return width;\n}\n```\n\nKey rules:\n- Always prefix with `use`\n- Only call hooks at the top level\n- Only call hooks from React functions",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 3-dot dropdown menu
// ---------------------------------------------------------------------------
function ConversationMenu({ anchorEl, onClose }) {
  if (!anchorEl) {
    return null;
  }

  const rect = anchorEl.getBoundingClientRect();
  const menuItems = [
    { icon: <IosShareIcon style={{ fontSize: 15 }} />, label: 'Share' },
    {
      icon: <DriveFileRenameOutlineOutlinedIcon style={{ fontSize: 15 }} />,
      label: 'Rename',
    },
    { icon: <PushPinOutlinedIcon style={{ fontSize: 15 }} />, label: 'Pin chat' },
    { icon: <ArchiveOutlinedIcon style={{ fontSize: 15 }} />, label: 'Archive' },
    {
      icon: <DeleteOutlinedIcon style={{ fontSize: 15 }} />,
      label: 'Delete',
      color: '#ef4444',
    },
  ];

  return (
    <React.Fragment>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
        }}
      />
      {/* Menu */}
      <div
        style={{
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          zIndex: 1000,
          background: '#2f2f2f',
          borderRadius: 12,
          border: '1px solid #424242',
          padding: '4px 0',
          minWidth: 180,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={onClose}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              border: 'none',
              background: 'none',
              color: item.color ?? gpt.text,
              fontSize: 14,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#424242';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <span
              style={{
                width: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------------
// Slot components — Sidebar
// ---------------------------------------------------------------------------
const GptConversationItem = React.forwardRef(
  function GptConversationItem(props, ref) {
    const {
      children,
      ownerState,
      conversation,
      selected,
      unread,
      focused,
      style,
      ...other
    } = props;
    const [hovered, setHovered] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    const hasUnread = conversation?.unreadCount
      ? conversation.unreadCount > 0
      : false;

    return (
      <React.Fragment>
        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 8px',
            borderRadius: 8,
            background: ownerState?.selected
              ? gpt.sidebarSelected
              : hovered
                ? gpt.sidebarHover
                : 'transparent',
            color: gpt.text,
            fontSize: 14,
            cursor: 'pointer',
            position: 'relative',
            ...style,
          }}
          {...other}
        >
          {children}
          {/* Unread dot */}
          {hasUnread && !ownerState?.selected ? (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: gpt.unreadDot,
                flexShrink: 0,
                marginLeft: 'auto',
              }}
            />
          ) : null}
          {/* 3-dot menu button on hover */}
          {hovered ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuAnchor(e.currentTarget);
              }}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 24,
                height: 24,
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                color: gpt.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#424242';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <MoreHorizRoundedIcon style={{ fontSize: 16 }} />
            </button>
          ) : null}
        </div>
        <ConversationMenu
          anchorEl={menuAnchor}
          onClose={() => setMenuAnchor(null)}
        />
      </React.Fragment>
    );
  },
);

const GptConversationAvatar = React.forwardRef(
  function GptConversationAvatar(props, ref) {
    const { ownerState, conversation, selected, unread, focused, style, ...other } =
      props;
    return <div ref={ref} style={{ display: 'none', ...style }} {...other} />;
  },
);

const GptConversationTitle = React.forwardRef(
  function GptConversationTitle(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;
    return (
      <div
        ref={ref}
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingRight: 24,
          ...style,
        }}
        {...other}
      >
        {conversation?.title}
      </div>
    );
  },
);

const GptConversationPreview = React.forwardRef(
  function GptConversationPreview(props, ref) {
    const { ownerState, conversation, selected, unread, focused, ...other } = props;
    return <div ref={ref} style={{ display: 'none' }} {...other} />;
  },
);

const GptConversationTimestamp = React.forwardRef(
  function GptConversationTimestamp(props, ref) {
    const { ownerState, conversation, selected, unread, focused, ...other } = props;
    return <div ref={ref} style={{ display: 'none' }} {...other} />;
  },
);

const GptConversationUnreadBadge = React.forwardRef(
  function GptConversationUnreadBadge(props, ref) {
    const { ownerState, conversation, selected, unread, focused, ...other } = props;
    return <span ref={ref} style={{ display: 'none' }} {...other} />;
  },
);

// ---------------------------------------------------------------------------
// Slot components — Messages
// ---------------------------------------------------------------------------
const GptMessageGroup = React.forwardRef(function GptMessageGroup(props, ref) {
  const { children, ownerState, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gap: 4,
        marginTop: ownerState?.isFirst ? 0 : 16,
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

// Hide author name completely
const GptAuthorName = React.forwardRef(function GptAuthorName(props, ref) {
  const { children, ownerState, style, ...other } = props;
  return <div ref={ref} style={{ display: 'none', ...style }} {...other} />;
});

const GptMessageRoot = React.forwardRef(function GptMessageRoot(props, ref) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: 12,
        alignItems: 'flex-start',
        maxWidth: 680,
        margin: '0 auto',
        width: '100%',
        padding: '8px 0',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

// Avatar: show only for assistant (ChatGPT sparkle icon), hide for user
const GptAvatar = React.forwardRef(function GptAvatar(props, ref) {
  const {
    ownerState: _ownerState,
    children: _children,
    style: _style,
    ...other
  } = props;

  return <div ref={ref} style={{ display: 'none' }} {...other} />;
});

// Bubble: user gets a rounded bubble, assistant gets flat text
const GptBubble = React.forwardRef(function GptBubble(props, ref) {
  const { children, ownerState, style, ...other } = props;
  const isUser = ownerState?.role === 'user';

  return (
    <div
      ref={ref}
      style={{
        ...(isUser
          ? {
              background: gpt.userBubble,
              borderRadius: 20,
              padding: '10px 16px',
              maxWidth: '70%',
            }
          : {
              flex: 1,
              minWidth: 0,
            }),
        fontSize: 15,
        lineHeight: 1.7,
        color: gpt.text,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
      {...other}
    >
      {children}
    </div>
  );
});

// Hide timestamps
const GptMeta = React.forwardRef(function GptMeta(props, ref) {
  const { ownerState, style, ...other } = props;
  return <div ref={ref} style={{ display: 'none', ...style }} {...other} />;
});

// ---------------------------------------------------------------------------
// Slot components — Reasoning (thinking block)
// ---------------------------------------------------------------------------
const GptReasoningRoot = React.forwardRef(function GptReasoningRoot(props, ref) {
  const { ownerState: _ownerState, style, ...other } = props;
  return (
    <details
      ref={ref}
      style={{
        background: 'rgba(16, 163, 127, 0.06)',
        border: '1px solid rgba(16, 163, 127, 0.2)',
        borderRadius: 10,
        padding: '8px 12px',
        marginBottom: 10,
        fontSize: 13,
        color: gpt.textSecondary,
        ...style,
      }}
      {...other}
    />
  );
});

const GptReasoningSummary = React.forwardRef(
  function GptReasoningSummary(props, ref) {
    const { ownerState: _ownerState, children, style, ...other } = props;
    return (
      <summary
        ref={ref}
        style={{
          cursor: 'pointer',
          fontWeight: 500,
          color: gpt.accent,
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          userSelect: 'none',
          ...style,
        }}
        {...other}
      >
        <AutoAwesomeOutlinedIcon style={{ fontSize: 14 }} />
        {children}
      </summary>
    );
  },
);

const GptReasoningContent = React.forwardRef(
  function GptReasoningContent(props, ref) {
    const { ownerState: _ownerState, style, ...other } = props;
    return (
      <div
        ref={ref}
        style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid rgba(16, 163, 127, 0.15)',
          fontSize: 13,
          lineHeight: 1.65,
          color: gpt.textSecondary,
          whiteSpace: 'pre-wrap',
          ...style,
        }}
        {...other}
      />
    );
  },
);

// ---------------------------------------------------------------------------
// Slot components — Tool call block
// ---------------------------------------------------------------------------
const GptToolRoot = React.forwardRef(function GptToolRoot(props, ref) {
  const { ownerState: _ownerState, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        fontSize: 13,
        ...style,
      }}
      {...other}
    />
  );
});

const GptToolHeader = React.forwardRef(function GptToolHeader(props, ref) {
  const { ownerState: _ownerState, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        gap: 8,
        ...style,
      }}
      {...other}
    />
  );
});

const GptToolTitle = React.forwardRef(function GptToolTitle(props, ref) {
  const { ownerState: _ownerState, children, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontWeight: 500,
        color: gpt.text,
        ...style,
      }}
      {...other}
    >
      <ManageSearchRoundedIcon style={{ fontSize: 15, color: gpt.textSecondary }} />
      {children}
    </div>
  );
});

const GptToolState = React.forwardRef(function GptToolState(props, ref) {
  const { ownerState, style, ...other } = props;
  const isDone = ownerState?.state === 'output-available';
  return (
    <span
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: isDone ? gpt.accent : gpt.textMuted,
        fontWeight: 500,
        ...style,
      }}
      {...other}
    >
      {isDone ? <CheckRoundedIcon style={{ fontSize: 13 }} /> : null}
    </span>
  );
});

const GptToolSection = React.forwardRef(function GptToolSection(props, ref) {
  const { ownerState: _ownerState, style, ...other } = props;
  return (
    <div
      ref={ref}
      style={{
        borderTop: '1px solid #2a2a2a',
        padding: '6px 12px 8px',
        ...style,
      }}
      {...other}
    />
  );
});

const GptToolSectionContent = React.forwardRef(
  function GptToolSectionContent(props, ref) {
    const { ownerState: _ownerState, style, ...other } = props;
    return (
      <pre
        ref={ref}
        style={{
          margin: '4px 0 0',
          padding: '6px 10px',
          background: '#111',
          borderRadius: 6,
          fontSize: 12,
          color: gpt.textSecondary,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          ...style,
        }}
        {...other}
      />
    );
  },
);

// ---------------------------------------------------------------------------
// Slot components — Composer
// ---------------------------------------------------------------------------
const GptComposerRoot = React.forwardRef(function GptComposerRoot(props, ref) {
  const { children, ownerState, style, ...other } = props;
  return (
    <form
      ref={ref}
      style={{
        maxWidth: 680,
        margin: '0 auto',
        width: '100%',
        background: gpt.composerBg,
        borderRadius: 24,
        padding: '12px 16px',
        display: 'grid',
        gap: 8,
        ...style,
      }}
      {...other}
    >
      {children}
    </form>
  );
});

const GptTextArea = React.forwardRef(function GptTextArea(props, ref) {
  const { ownerState, style, ...other } = props;
  return (
    <textarea
      ref={ref}
      style={{
        width: '100%',
        minHeight: 28,
        maxHeight: 200,
        resize: 'none',
        border: 'none',
        background: gpt.composerBg,
        color: gpt.text,
        caretColor: gpt.text,
        padding: 0,
        fontFamily: 'inherit',
        fontSize: 15,
        outline: 'none',
        boxShadow: 'none',
        boxSizing: 'border-box',
        colorScheme: 'dark',
        ...style,
      }}
      {...other}
    />
  );
});

const GptSendButton = React.forwardRef(function GptSendButton(props, ref) {
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
        background: disabled ? '#424242' : gpt.text,
        color: disabled ? gpt.textMuted : gpt.bg,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        flexShrink: 0,
        ...style,
      }}
      {...other}
    >
      <ArrowUpwardRoundedIcon style={{ fontSize: 20 }} />
    </button>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ChatGptStyleChat() {
  const [activeConversationId, setActiveConversationId] =
    React.useState('historical');
  const [convos, setConvos] = React.useState(() =>
    cloneConversations(conversations),
  );
  const [threads, setThreads] = React.useState(() =>
    Object.fromEntries(
      Object.entries(allThreads).map(([id, msgs]) => [id, cloneMessages(msgs)]),
    ),
  );
  const adapter = React.useMemo(
    () =>
      createEchoAdapter({
        agent: assistant,
        respond: (text) =>
          `That's an interesting question about "${text}". Let me think about that.\n\nHere are a few key points to consider:\n\n- The topic has multiple dimensions worth exploring\n- There are both practical and theoretical aspects\n- I'd recommend looking into recent developments in this area\n\nWould you like me to go deeper into any of these points?`,
      }),
    [],
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <Chat.Root
      activeConversationId={activeConversationId}
      adapter={adapter}
      conversations={convos}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({
          ...prev,
          [activeConversationId]: nextMessages,
        }));
        setConvos((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      slotProps={{
        root: {
          style: {
            background: gpt.bg,
            color: gpt.text,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            height: 600,
            width: '100%',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Chat.Layout
        slotProps={{
          root: {
            style: {
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '260px 1fr',
              gridTemplateRows: '100%',
            },
          },
          conversationsPane: {
            style: {
              width: 260,
              minWidth: 260,
              maxWidth: 260,
              background: gpt.sidebar,
              padding: '12px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              borderRight: `1px solid ${gpt.border}`,
              overflow: 'auto',
            },
          },
          threadPane: {
            style: {
              minWidth: 0,
              minHeight: 0,
              background: gpt.bg,
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Sidebar */}
        <React.Fragment>
          <div
            style={{
              padding: '8px 8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: gpt.text,
              }}
            >
              ChatGPT
            </span>
            <span
              style={{
                cursor: 'pointer',
                color: gpt.textSecondary,
                display: 'flex',
                alignItems: 'center',
              }}
              title="New chat"
            >
              <DriveFileRenameOutlineOutlinedIcon style={{ fontSize: 20 }} />
            </span>
          </div>
          <div
            style={{
              padding: '0 8px 6px',
              fontSize: 11,
              color: gpt.textMuted,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Recent
          </div>
          <ConversationList.Root
            aria-label="Chat history"
            slotProps={{ root: { style: { display: 'grid', gap: 1 } } }}
            slots={{
              item: GptConversationItem,
              itemAvatar: GptConversationAvatar,
              title: GptConversationTitle,
              preview: GptConversationPreview,
              timestamp: GptConversationTimestamp,
              unreadBadge: GptConversationUnreadBadge,
            }}
          />
        </React.Fragment>

        {/* Main thread area */}
        <Conversation.Root
          slotProps={{
            root: {
              style: {
                height: '100%',
                display: 'grid',
                gridTemplateRows: 'auto minmax(0, 1fr) auto',
              },
            },
          }}
        >
          {/* Header */}
          <Conversation.Header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              borderBottom: `1px solid ${gpt.border}`,
            }}
          >
            <Conversation.Title
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: gpt.text,
              }}
            />
          </Conversation.Header>

          {/* Messages */}
          <MessageList.Root
            estimatedItemSize={120}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slots={{
                  authorName: GptAuthorName,
                  root: GptMessageGroup,
                }}
              >
                <Message.Root messageId={id} slots={{ root: GptMessageRoot }}>
                  <Message.Avatar slots={{ avatar: GptAvatar }} />
                  <Message.Content
                    slots={{ bubble: GptBubble }}
                    slotProps={{
                      content: { style: { display: 'contents' } },
                    }}
                    partProps={{
                      reasoning: {
                        slots: {
                          root: GptReasoningRoot,
                          summary: GptReasoningSummary,
                          content: GptReasoningContent,
                        },
                      },
                      'dynamic-tool': {
                        slots: {
                          root: GptToolRoot,
                          header: GptToolHeader,
                          title: GptToolTitle,
                          state: GptToolState,
                          section: GptToolSection,
                          sectionContent: GptToolSectionContent,
                        },
                      },
                    }}
                  />
                  <Message.Meta slots={{ meta: GptMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
            slotProps={{
              root: {
                style: { paddingRight: 0 },
              },
              messageListScroller: {
                style: { padding: '0 24px' },
              },
            }}
          />
          {/* Composer */}
          <div style={{ padding: '12px 24px 16px' }}>
            <Composer.Root slots={{ root: GptComposerRoot }}>
              <Composer.TextArea
                aria-label="Message ChatGPT"
                placeholder="Ask anything"
                slots={{ input: GptTextArea }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}
              >
                {/* Left: + button */}
                <button
                  type="button"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: 'none',
                    background: '#424242',
                    color: gpt.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 300,
                    flexShrink: 0,
                  }}
                  title="Add attachment"
                >
                  +
                </button>
                {/* Right: mic + send */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'transparent',
                      color: gpt.textSecondary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                    title="Voice input"
                  >
                    <MicNoneRoundedIcon style={{ fontSize: 20 }} />
                  </button>
                  <Composer.SendButton slots={{ sendButton: GptSendButton }} />
                </div>
              </div>
            </Composer.Root>
          </div>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
