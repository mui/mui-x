import * as React from 'react';
import { Indicators, useChatComposer, useChatStatus } from '@mui/x-chat-headless';
import { formatBytes, formatConversationTime, formatMessageTime } from './demoUtils';

export const demoLocaleText = {
  messageTimestampLabel: formatMessageTime,
  conversationTimestampLabel: formatConversationTime,
};

export const palette = {
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#fafafa',
  border: '#e0e0e0',
  borderStrong: '#bdbdbd',
  text: '#111111',
  muted: '#666666',
  accent: '#111111',
  accentSoft: '#f5f5f5',
  success: '#2e7d32',
  warm: '#c62828',
} as const;

export function DemoFrame(
  props: React.PropsWithChildren<{ style?: React.CSSProperties }>,
) {
  const { children, style } = props;

  return (
    <div
      style={{
        background: palette.background,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DemoToolbarButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    tone?: 'default' | 'accent';
  },
) {
  const { tone = 'default', style, ...other } = props;

  return (
    <button
      {...other}
      style={{
        border: `1px solid ${tone === 'accent' ? palette.accent : palette.borderStrong}`,
        background: tone === 'accent' ? palette.accent : palette.surface,
        color: tone === 'accent' ? '#ffffff' : palette.text,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 600,
        cursor: other.disabled ? 'not-allowed' : 'pointer',
        opacity: other.disabled ? 0.5 : 1,
        ...style,
      }}
      type="button"
    />
  );
}

export function DemoScrollArea(
  props: React.PropsWithChildren<{ style?: React.CSSProperties }>,
) {
  const { children, style } = props;

  return (
    <div
      style={{
        ...style,
        overflow: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      {children}
    </div>
  );
}

export function DemoScrollToBottomOverlay() {
  return (
    <div style={{ pointerEvents: 'auto' }}>
      <Indicators.ScrollToBottomAffordance
        slotProps={{
          root: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: `1px solid ${palette.borderStrong}`,
              background: palette.surface,
              color: palette.text,
              padding: '6px 12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            },
          },
          badge: {
            style: {
              minWidth: 18,
              height: 18,
              display: 'inline-grid',
              placeItems: 'center',
              background: palette.accent,
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
            },
          },
        }}
      />
    </div>
  );
}

export const demoMessageListSlotProps = {
  messageListOverlay: {
    style: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: 12,
    },
  },
} satisfies Record<string, { style: React.CSSProperties }>;

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
        background: palette.surfaceAlt,
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
                  width: 40,
                  height: 40,
                  objectFit: 'cover',
                  background: palette.surface,
                }}
              />
            ) : (
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  display: 'grid',
                  placeItems: 'center',
                  color: palette.muted,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                FILE
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
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
              fontWeight: 600,
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

// ---------------------------------------------------------------------------
// Shared slot props — identical across all headless demos
// ---------------------------------------------------------------------------

export const demoSlotProps = {
  messageRoot: (ownerState: { role: string }) => ({
    style: {
      display: 'grid',
      gridTemplateColumns:
        ownerState.role === 'user' ? 'minmax(0, 1fr) 32px' : '32px minmax(0, 1fr)',
      gridTemplateRows: 'auto auto',
      gap: '4px 10px',
      alignItems: 'start',
    },
  }),
  messageAvatar: (ownerState: { role: string }) => ({
    style: {
      width: 32,
      height: 32,
      background: palette.accent,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gridColumn: ownerState.role === 'user' ? 2 : 1,
      gridRow: '1 / 3',
      alignSelf: 'start',
    },
  }),
  messageAvatarImage: {
    style: { width: 20, height: 20, filter: 'grayscale(1) invert(1)' },
  },
  messageContent: {
    style: { display: 'contents' },
  },
  messageBubble: (ownerState: { role: string }) => ({
    style: {
      display: 'grid',
      gap: 8,
      padding: '10px 14px',
      border: `1px solid ${ownerState.role === 'user' ? palette.accent : palette.border}`,
      background: ownerState.role === 'user' ? palette.accent : palette.surface,
      color: ownerState.role === 'user' ? '#ffffff' : palette.text,
      gridColumn: ownerState.role === 'user' ? 1 : 2,
      gridRow: 1,
      justifySelf: ownerState.role === 'user' ? 'end' : 'start',
      width: 'fit-content',
      maxWidth: '90%',
    },
  }),
  messageMeta: (ownerState: { role: string }) => ({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      color: palette.muted,
      gridColumn: ownerState.role === 'user' ? 1 : 2,
      gridRow: 2,
      justifySelf: ownerState.role === 'user' ? 'end' : 'start',
    },
  }),
  messageGroupRoot: (ownerState: { isFirst: boolean; isLast: boolean }) => ({
    style: {
      display: 'grid',
      gap: 4,
      marginTop: ownerState.isFirst ? 16 : 4,
      marginBottom: ownerState.isLast ? 4 : 0,
    },
  }),
  messageGroupAuthorName: (ownerState: { authorRole: string }) => ({
    style: {
      color: palette.muted,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
      marginLeft: ownerState.authorRole === 'user' ? 0 : 42,
      textAlign: (ownerState.authorRole === 'user' ? 'right' : 'left') as
        | 'right'
        | 'left',
      marginRight: ownerState.authorRole === 'user' ? 42 : 0,
    },
  }),
  conversationHeader: {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottom: `1px solid ${palette.border}`,
    },
  },
  conversationTitle: {
    fontSize: 18,
    fontWeight: 800,
  } satisfies React.CSSProperties,
  conversationSubtitle: {
    color: palette.muted,
    fontSize: 13,
    marginTop: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } satisfies React.CSSProperties,
  composerRoot: {
    style: {
      display: 'grid',
      gap: 10,
      paddingTop: 12,
      borderTop: `1px solid ${palette.border}`,
    },
  },
  composerTextArea: {
    style: {
      width: '100%',
      minHeight: 48,
      maxHeight: 180,
      resize: 'none',
      border: `1px solid ${palette.border}`,
      background: palette.surfaceAlt,
      color: palette.text,
      padding: '10px 12px',
      fontFamily: 'inherit',
      fontSize: 14,
      lineHeight: 1.5,
      outline: 'none',
      boxSizing: 'border-box',
    },
  },
  composerSendButton: (ownerState: { disabled: boolean }) => ({
    style: {
      border: `1px solid ${palette.accent}`,
      background: palette.accent,
      color: '#ffffff',
      padding: '8px 20px',
      fontSize: 13,
      fontWeight: 600,
      cursor: ownerState.disabled ? 'not-allowed' : 'pointer',
      opacity: ownerState.disabled ? 0.4 : 1,
      fontFamily: 'inherit',
    },
  }),
  conversationListItem: (ownerState: { selected: boolean }) => ({
    style: {
      display: 'grid',
      gridTemplateColumns: '36px minmax(0, 1fr) auto',
      gridTemplateRows: 'auto auto',
      gap: '2px 10px',
      alignItems: 'center',
      padding: '10px 12px',
      background: ownerState.selected ? palette.accentSoft : palette.surface,
      borderLeft: ownerState.selected
        ? `2px solid ${palette.accent}`
        : '2px solid transparent',
      borderBottom: `1px solid ${palette.border}`,
      cursor: 'pointer',
    },
  }),
  conversationListItemAvatar: {
    style: {
      width: 36,
      height: 36,
      background: palette.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      alignSelf: 'center',
    },
    slotProps: {
      image: {
        style: { width: 22, height: 22, filter: 'grayscale(1) invert(1)' },
      },
    },
  },
  conversationListItemContent: {
    style: {
      gridColumn: 2,
      gridRow: '1 / 3',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      minWidth: 0,
      gap: 2,
    },
  },
  conversationListTitle: (ownerState: { unread: boolean }) => ({
    style: {
      fontWeight: ownerState.unread ? 700 : 500,
      color: palette.text,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 14,
    },
  }),
  conversationListPreview: {
    style: {
      fontSize: 12,
      color: palette.muted,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  conversationListTimestamp: {
    style: {
      fontSize: 11,
      color: palette.muted,
      textAlign: 'end' as const,
      gridColumn: 3,
      gridRow: 1,
      alignSelf: 'end',
    },
  },
  conversationListUnreadBadge: {
    style: {
      display: 'inline-block',
      minWidth: 18,
      padding: '1px 5px',
      background: palette.accent,
      color: '#ffffff',
      fontWeight: 600,
      fontSize: 11,
      textAlign: 'center' as const,
      gridColumn: 3,
      gridRow: 2,
      justifySelf: 'end',
      alignSelf: 'start',
    },
  },
  dateDividerRoot: {
    style: {
      display: 'flex',
      justifyContent: 'center',
      margin: '14px 0',
    },
  },
  dateDividerLabel: {
    style: {
      background: palette.accentSoft,
      color: palette.muted,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 600,
    },
  },
  unreadMarkerRoot: {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '10px 0',
    },
  },
  unreadMarkerLabel: {
    style: {
      background: '#fce4ec',
      color: palette.warm,
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 700,
    },
  },
};

export const demoSurfaceStyles = {
  chatRoot: {
    display: 'grid',
    gap: 0,
    margin: '-12px',
    background: palette.surface,
    color: palette.text,
  } satisfies React.CSSProperties,
  layout: {
    height: 560,
    overflow: 'hidden',
  } satisfies React.CSSProperties,
  conversationsPane: {
    width: 280,
    paddingRight: 16,
    borderRight: `1px solid ${palette.border}`,
    display: 'grid',
    gap: 12,
  } satisfies React.CSSProperties,
  threadPane: {
    paddingLeft: 16,
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1fr)',
    gap: 14,
  } satisfies React.CSSProperties,
  conversationList: {
    display: 'grid',
    gap: 0,
    alignContent: 'start',
    minHeight: 0,
    overflow: 'auto',
    overscrollBehavior: 'contain',
  } satisfies React.CSSProperties,
  threadRoot: {
    minWidth: 0,
    minHeight: 0,
    display: 'grid',
    gridTemplateRows: 'auto minmax(0, 1fr) auto',
    gap: 14,
  } satisfies React.CSSProperties,
} as const;
