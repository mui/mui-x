import * as React from 'react';
import { Indicators } from '@mui/x-chat-unstyled';
import { useChatComposer, useChatStatus } from '@mui/x-chat-headless';
import { formatBytes, formatConversationTime, formatMessageTime } from './demoUtils';

const palette = {
  background: '#f4f7fb',
  surface: '#ffffff',
  surfaceAlt: '#f8fbff',
  border: '#d7dee7',
  borderStrong: '#b8c7d7',
  text: '#10263d',
  muted: '#5c6b7c',
  accent: '#0b4f8a',
  accentSoft: '#eef6ff',
  success: '#0f766e',
  warm: '#b45309',
};

export function DemoFrame(props) {
  const { children, style } = props;

  return (
    <div
      style={{
        background: palette.background,
        border: `1px solid ${palette.border}`,
        borderRadius: 20,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DemoToolbarButton(props) {
  const { tone = 'default', style, ...other } = props;

  return (
    <button
      {...other}
      style={{
        border: `1px solid ${tone === 'accent' ? palette.accent : palette.borderStrong}`,
        background: tone === 'accent' ? palette.accent : palette.surface,
        color: tone === 'accent' ? '#ffffff' : palette.text,
        borderRadius: 999,
        padding: '8px 12px',
        fontSize: 12,
        fontWeight: 700,
        cursor: other.disabled ? 'not-allowed' : 'pointer',
        opacity: other.disabled ? 0.6 : 1,
        ...style,
      }}
      type="button"
    />
  );
}

export const DemoConversationItem = React.forwardRef(
  function DemoConversationItem(props, ref) {
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
    let borderColor = 'transparent';

    if (ownerState?.selected) {
      borderColor = palette.accent;
    } else if (ownerState?.focused) {
      borderColor = palette.borderStrong;
    }

    return (
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: '40px minmax(0, 1fr) auto',
          gap: 10,
          alignItems: 'center',
          padding: 12,
          borderRadius: 16,
          background: ownerState?.selected ? palette.accentSoft : palette.surface,
          border: `1px solid ${borderColor}`,
          boxShadow: ownerState?.focused
            ? '0 0 0 3px rgba(11, 79, 138, 0.12)'
            : 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoConversationItemAvatar = React.forwardRef(
  function DemoConversationItemAvatar(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;
    const participant = conversation?.participants?.[0];

    return (
      <div
        ref={ref}
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          overflow: 'hidden',
          background: palette.accentSoft,
          display: 'grid',
          placeItems: 'center',
          ...style,
        }}
        {...other}
      >
        {participant?.avatarUrl ? (
          <img
            alt={participant.displayName ?? ''}
            src={participant.avatarUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}
      </div>
    );
  },
);

export const DemoConversationTitle = React.forwardRef(
  function DemoConversationTitle(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    return (
      <div
        ref={ref}
        style={{
          fontWeight: ownerState?.unread ? 800 : 700,
          color: palette.text,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...other}
      >
        {conversation?.title ?? conversation?.id}
      </div>
    );
  },
);

export const DemoConversationPreview = React.forwardRef(
  function DemoConversationPreview(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    if (!conversation?.subtitle) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{
          fontSize: 12,
          color: palette.muted,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...style,
        }}
        {...other}
      >
        {conversation.subtitle}
      </div>
    );
  },
);

export const DemoConversationTimestamp = React.forwardRef(
  function DemoConversationTimestamp(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;

    if (!conversation?.lastMessageAt) {
      return null;
    }

    return (
      <div
        ref={ref}
        style={{ fontSize: 11, color: palette.muted, textAlign: 'end', ...style }}
        {...other}
      >
        <time dateTime={conversation.lastMessageAt}>
          {formatConversationTime(conversation.lastMessageAt)}
        </time>
      </div>
    );
  },
);

export const DemoConversationUnreadBadge = React.forwardRef(
  function DemoConversationUnreadBadge(props, ref) {
    const { conversation, ownerState, selected, unread, focused, style, ...other } =
      props;
    const unreadCount = conversation?.unreadCount ?? 0;

    if (unreadCount <= 0) {
      return null;
    }

    return (
      <span
        ref={ref}
        style={{
          display: 'inline-block',
          minWidth: 20,
          padding: '2px 7px',
          borderRadius: 999,
          background: palette.accent,
          color: '#ffffff',
          fontWeight: 700,
          fontSize: 11,
          textAlign: 'center',
          justifySelf: 'end',
          ...style,
        }}
        {...other}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    );
  },
);

export const DemoThreadHeader = React.forwardRef(
  function DemoThreadHeader(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'space-between',
          paddingBottom: 14,
          borderBottom: `1px solid ${palette.border}`,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageListRoot = React.forwardRef(
  function DemoMessageListRoot(props, ref) {
    const {
      children,
      estimatedItemSize,
      getItemKey,
      items,
      onReachTop,
      overscan,
      ownerState,
      renderItem,
      slotProps,
      slots,
      virtualization,
      style,
      ...other
    } = props;
    void estimatedItemSize;
    void getItemKey;
    void items;
    void onReachTop;
    void overscan;
    void ownerState;
    void renderItem;
    void slotProps;
    void slots;
    void virtualization;

    return (
      <div
        ref={ref}
        style={{
          position: 'relative',
          overflowY: 'auto',
          minHeight: 0,
          ...style,
        }}
        {...other}
      >
        {children}
        <div
          style={{
            position: 'sticky',
            bottom: 12,
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
            paddingBottom: 12,
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <Indicators.ScrollToBottomAffordance
              slots={{
                badge: DemoScrollBadge,
                root: DemoScrollButton,
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const DemoDateDividerRoot = React.forwardRef(
  function DemoDateDividerRoot(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '14px 0',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoDateDividerLabel = React.forwardRef(
  function DemoDateDividerLabel(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          borderRadius: 999,
          background: '#edf2f8',
          color: palette.muted,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 700,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoUnreadMarkerRoot = React.forwardRef(
  function DemoUnreadMarkerRoot(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          margin: '10px 0',
          ...style,
        }}
        {...other}
      >
        <div style={{ height: 1, flex: 1, background: palette.borderStrong }} />
        {children}
        <div style={{ height: 1, flex: 1, background: palette.borderStrong }} />
      </div>
    );
  },
);

export const DemoUnreadMarkerLabel = React.forwardRef(
  function DemoUnreadMarkerLabel(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          borderRadius: 999,
          background: '#fff3e6',
          color: palette.warm,
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 800,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageGroup = React.forwardRef(
  function DemoMessageGroup(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'grid',
          gap: 4,
          marginTop: ownerState?.isFirst ? 16 : 4,
          marginBottom: ownerState?.isLast ? 4 : 0,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageAuthor = React.forwardRef(
  function DemoMessageAuthor(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          color: palette.muted,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginLeft: 42,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageRoot = React.forwardRef(
  function DemoMessageRoot(props, ref) {
    const { children, ownerState, style, ...other } = props;
    const isUser = ownerState?.role === 'user';

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          flexDirection: isUser ? 'row-reverse' : 'row',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageAvatar = React.forwardRef(
  function DemoMessageAvatar(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          width: 32,
          height: 32,
          borderRadius: 12,
          overflow: 'hidden',
          background: palette.accentSoft,
          flexShrink: 0,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageContent = React.forwardRef(
  function DemoMessageContent(props, ref) {
    const { children, ownerState, style, ...other } = props;
    const isUser = ownerState?.role === 'user';

    return (
      <div
        ref={ref}
        style={{
          maxWidth: '72%',
          display: 'grid',
          gap: 8,
          padding: '12px 14px',
          borderRadius: 18,
          border: `1px solid ${isUser ? palette.accent : palette.border}`,
          background: isUser ? palette.accent : palette.surface,
          color: isUser ? '#ffffff' : palette.text,
          boxShadow: ownerState?.streaming
            ? '0 0 0 2px rgba(11, 79, 138, 0.08)'
            : 'none',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoMessageMeta = React.forwardRef(
  function DemoMessageMeta(props, ref) {
    const { ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          color: palette.muted,
          ...style,
        }}
        {...other}
      >
        <span>{formatMessageTime(ownerState?.message?.createdAt)}</span>
        {ownerState?.message?.status ? (
          <span>{ownerState.message.status}</span>
        ) : null}
      </div>
    );
  },
);

export const DemoComposerRoot = React.forwardRef(
  function DemoComposerRoot(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <form
        ref={ref}
        style={{
          display: 'grid',
          gap: 10,
          paddingTop: 14,
          borderTop: `1px solid ${palette.border}`,
          ...style,
        }}
        {...other}
      >
        {children}
      </form>
    );
  },
);

export const DemoComposerToolbar = React.forwardRef(
  function DemoComposerToolbar(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'space-between',
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoComposerInput = React.forwardRef(
  function DemoComposerInput(props, ref) {
    const { ownerState, style, ...other } = props;

    return (
      <textarea
        ref={ref}
        style={{
          width: '100%',
          minHeight: 84,
          maxHeight: 180,
          resize: 'none',
          borderRadius: 16,
          border: `1px solid ${ownerState?.isStreaming ? palette.accent : palette.border}`,
          background: palette.surface,
          color: palette.text,
          padding: '12px 14px',
          fontFamily: 'inherit',
          fontSize: 14,
          lineHeight: 1.5,
          outline: 'none',
          ...style,
        }}
        {...other}
      />
    );
  },
);

export const DemoComposerButton = React.forwardRef(
  function DemoComposerButton(props, ref) {
    const { ownerState, style, children, disabled, ...other } = props;
    const isPrimary = other['data-variant'] === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={{
          borderRadius: 999,
          border: `1px solid ${isPrimary ? palette.accent : palette.borderStrong}`,
          background: isPrimary ? palette.accent : palette.surface,
          color: isPrimary ? '#ffffff' : palette.text,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 800,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
        type={other.type === 'submit' ? 'submit' : 'button'}
        {...other}
      >
        {children}
      </button>
    );
  },
);

export const DemoComposerHelperText = React.forwardRef(
  function DemoComposerHelperText(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          color: palette.muted,
          fontSize: 12,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoTypingIndicator = React.forwardRef(
  function DemoTypingIndicator(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <div
        ref={ref}
        style={{
          borderRadius: 999,
          background: palette.surfaceAlt,
          color: palette.success,
          padding: '6px 10px',
          fontSize: 12,
          fontWeight: 700,
          ...style,
        }}
        {...other}
      >
        {children}
      </div>
    );
  },
);

export const DemoScrollButton = React.forwardRef(
  function DemoScrollButton(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <button
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRadius: 999,
          border: `1px solid ${palette.borderStrong}`,
          background: palette.surface,
          color: palette.text,
          padding: '8px 12px',
          boxShadow: '0 8px 24px rgba(16, 38, 61, 0.12)',
          ...style,
        }}
        type="button"
        {...other}
      >
        {children}
      </button>
    );
  },
);

export const DemoScrollBadge = React.forwardRef(
  function DemoScrollBadge(props, ref) {
    const { children, ownerState, style, ...other } = props;

    return (
      <span
        ref={ref}
        style={{
          minWidth: 20,
          height: 20,
          borderRadius: 999,
          display: 'inline-grid',
          placeItems: 'center',
          background: palette.accent,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 800,
          ...style,
        }}
        {...other}
      >
        {children}
      </span>
    );
  },
);

export function AttachmentPreviewList() {
  const composer = useChatComposer();
  const status = useChatStatus();

  if (composer.attachments.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
        padding: 12,
        borderRadius: 16,
        background: '#f8fafc',
        border: `1px solid ${palette.border}`,
      }}
    >
      {composer.attachments.map((attachment) => (
        <div
          key={attachment.localId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}
          >
            {attachment.previewUrl ? (
              <img
                alt={attachment.file.name}
                src={attachment.previewUrl}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  objectFit: 'cover',
                  background: palette.surface,
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  display: 'grid',
                  placeItems: 'center',
                  color: palette.muted,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                FILE
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: palette.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {attachment.file.name}
              </div>
              <div style={{ color: palette.muted, fontSize: 12 }}>
                {formatBytes(attachment.file.size)} · {attachment.status}
              </div>
            </div>
          </div>
          <button
            onClick={() => composer.removeAttachment(attachment.localId)}
            style={{
              border: 'none',
              background: 'transparent',
              color: status.isStreaming ? palette.borderStrong : palette.warm,
              fontWeight: 700,
              cursor: status.isStreaming ? 'not-allowed' : 'pointer',
            }}
            type="button"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export const demoSurfaceStyles = {
  chatRoot: {
    display: 'grid',
    gap: 16,
    background: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: 24,
    padding: 16,
    color: palette.text,
  },
  layout: {
    minHeight: 560,
  },
  conversationsPane: {
    width: 300,
    paddingRight: 16,
    borderRight: `1px solid ${palette.border}`,
    display: 'grid',
    gap: 12,
  },
  threadPane: {
    minWidth: 0,
    paddingLeft: 16,
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    gap: 14,
  },
  conversationList: {
    display: 'grid',
    gap: 10,
    alignContent: 'start',
  },
  threadRoot: {
    minWidth: 0,
    minHeight: 0,
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gap: 14,
  },
};
