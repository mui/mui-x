import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

export type PlaygroundCardStatus =
  | 'core'
  | 'compound'
  | 'slot'
  | 'state'
  | 'presentational'
  | 'stable'
  | 'new'
  | 'updated'
  | 'experimental'
  | 'deprecated';

export interface PlaygroundCardStatusBadge {
  label: string;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'error';
}

export interface PlaygroundCardRegistryMetadata {
  componentName?: string;
  importName?: string;
  packageName?: string;
  sourcePath?: string;
  docsPath?: string;
  status?: PlaygroundCardStatus | PlaygroundCardStatusBadge;
  parent?: string;
  slots?: readonly string[];
  classKeys?: readonly string[];
}

export interface PlaygroundCustomization {
  /** Identifier — slot name or class key. */
  name: string;
  /** Optional explanation for the editor row. */
  description?: string;
  /** CSS selector this entry produces (classes only). */
  selector?: string;
  /** Raw sx text the user is editing. */
  sx: string;
  // eslint-disable-next-line jsdoc/require-param
  /** Update handler. */
  onSxChange: (next: string) => void;
  /** Parse error reported by the consumer. */
  parseError?: string;
}

export type PlaygroundPreviewSize =
  | 'compact'
  | 'standard'
  | 'wide'
  | 'large'
  | 'full'
  | {
      minHeight?: number | string;
      maxHeight?: number | string;
      maxWidth?: number | string;
      controlsWidth?: number | string;
      aspectRatio?: string;
    };

export interface PlaygroundCardProps {
  title: string;
  description?: string;
  /** What renders in the preview area. */
  preview: React.ReactNode;
  /** Controls rendered in the sidebar. */
  controls?: React.ReactNode;
  /** Callback to reset all controls to their default values. */
  onReset?: () => void;
  /** Force the preview to fill its container instead of centring. */
  previewFill?: boolean;
  /** Override the preview area's min-height. */
  previewMinHeight?: number;
  /** Background applied behind the preview — useful for surfaces that ignore their parent. */
  previewBackground?: string;
  /** Span across the gallery grid (defaults to 1 column). */
  span?: 1 | 2 | 3;
  /** Registry-compatible metadata for the component shown by the card. */
  registry?: PlaygroundCardRegistryMetadata;
  /** Registry component name. Falls back to the leading component name in `title`. */
  componentName?: string;
  /** Public import name for the component. */
  importName?: string;
  /** Public package name for the component. */
  packageName?: string;
  /** Source path for registry/search metadata. */
  sourcePath?: string;
  /** Documentation path for registry/search metadata. */
  docsPath?: string;
  /** Component maturity/category badge. */
  status?: PlaygroundCardStatus | PlaygroundCardStatusBadge;
  /** Parent component when this card documents a slot/subcomponent. */
  parent?: string;
  /** Overridable slot keys to display. */
  slots?: readonly string[];
  /** Utility class keys to display. */
  classKeys?: readonly string[];
  /** Responsive sizing preset or explicit preview sizing. */
  previewSize?: PlaygroundPreviewSize;
  /** Editable slot overrides — when present, surfaces a "Slots" tab. */
  slotCustomizations?: readonly PlaygroundCustomization[];
  /** Editable class overrides — when present, surfaces a "Classes" tab. */
  classCustomizations?: readonly PlaygroundCustomization[];
  /** Reset handler for the Slots tab. */
  onSlotsReset?: () => void;
  /** Reset handler for the Classes tab. */
  onClassesReset?: () => void;
  // eslint-disable-next-line jsdoc/require-returns
  /** Returns the JSX snippet for the Copy code action. */
  copyCode?: () => string;
}

const DEFAULT_PACKAGE_NAME = '@mui/x-chat';

const defaultRegistryMetadata: Record<string, PlaygroundCardRegistryMetadata> = {
  ChatBox: {
    status: 'core',
    slots: [
      'conversationList',
      'conversationHeader',
      'messageList',
      'messageRoot',
      'messageContent',
      'composerRoot',
      'suggestions',
      'scrollToBottom',
    ],
    classKeys: ['root', 'layout', 'conversationsPane', 'threadPane'],
  },
  ChatConversation: {
    status: 'compound',
    slots: ['root'],
    classKeys: ['root'],
  },
  ChatConversationList: {
    status: 'compound',
    slots: [
      'item',
      'itemAvatar',
      'itemContent',
      'title',
      'preview',
      'timestamp',
      'unreadBadge',
    ],
    classKeys: [
      'root',
      'item',
      'itemSelected',
      'itemUnread',
      'itemFocused',
      'compact',
    ],
  },
  ChatConversationHeader: {
    status: 'compound',
    slots: ['header'],
    classKeys: ['header'],
  },
  ChatConversationHeaderInfo: {
    status: 'slot',
    parent: 'ChatConversationHeader',
    slots: ['headerInfo'],
    classKeys: ['headerInfo'],
  },
  ChatConversationTitle: {
    status: 'slot',
    parent: 'ChatConversationHeaderInfo',
    slots: ['title'],
    classKeys: ['title'],
  },
  ChatConversationSubtitle: {
    status: 'slot',
    parent: 'ChatConversationHeaderInfo',
    slots: ['subtitle'],
    classKeys: ['subtitle'],
  },
  ChatConversationHeaderActions: {
    status: 'slot',
    parent: 'ChatConversationHeader',
    slots: ['actions'],
    classKeys: ['headerActions'],
  },
  ChatMessageList: {
    status: 'compound',
    slots: [
      'messageList',
      'messageListScroller',
      'messageListContent',
      'messageListOverlay',
    ],
    classKeys: ['root', 'scroller', 'content'],
  },
  ChatMessageGroup: {
    status: 'compound',
    slots: ['group', 'authorName', 'groupTimestamp'],
    classKeys: ['group', 'groupAuthorName', 'groupTimestamp'],
  },
  ChatMessage: {
    status: 'compound',
    slots: ['root'],
    classKeys: ['root', 'roleUser', 'roleAssistant', 'streaming', 'error'],
  },
  ChatMessageAvatar: {
    status: 'slot',
    parent: 'ChatMessage',
    slots: ['avatar', 'image'],
    classKeys: ['avatar'],
  },
  ChatMessageAuthorLabel: {
    status: 'slot',
    parent: 'ChatMessageGroup',
    slots: ['authorLabel'],
    classKeys: ['authorLabel'],
  },
  ChatMessageContent: {
    status: 'slot',
    parent: 'ChatMessage',
    slots: ['content', 'bubble'],
    classKeys: ['content', 'bubble'],
  },
  ChatMessageMeta: {
    status: 'slot',
    parent: 'ChatMessage',
    slots: ['meta', 'timestamp', 'status', 'edited'],
    classKeys: ['meta'],
  },
  ChatMessageInlineMeta: {
    status: 'slot',
    parent: 'ChatMessageContent',
    slots: ['inlineMeta', 'inlineMetaSpacer'],
    classKeys: ['inlineMeta', 'inlineMetaSpacer'],
  },
  ChatMessageActions: {
    status: 'slot',
    parent: 'ChatMessage',
    slots: ['actions'],
    classKeys: ['actions'],
  },
  ChatMessageError: {
    status: 'state',
    parent: 'ChatMessage',
    classKeys: ['root', 'message', 'retryButton'],
  },
  ChatDateDivider: {
    status: 'state',
    parent: 'ChatMessageList',
    slots: ['divider', 'line', 'label'],
    classKeys: ['dateDivider'],
  },
  ChatComposer: {
    status: 'compound',
    slots: ['root'],
    classKeys: ['root', 'disabled', 'variantCompact'],
  },
  ChatComposerTextArea: {
    status: 'slot',
    parent: 'ChatComposer',
    slots: ['input'],
    classKeys: ['textArea'],
  },
  ChatComposerToolbar: {
    status: 'slot',
    parent: 'ChatComposer',
    slots: ['toolbar'],
    classKeys: ['toolbar'],
  },
  ChatComposerSendButton: {
    status: 'slot',
    parent: 'ChatComposerToolbar',
    slots: ['sendButton'],
    classKeys: ['sendButton'],
  },
  ChatComposerAttachButton: {
    status: 'slot',
    parent: 'ChatComposerToolbar',
    slots: ['attachButton', 'attachInput'],
    classKeys: ['attachButton'],
  },
  ChatComposerAttachmentList: {
    status: 'slot',
    parent: 'ChatComposer',
    slots: ['attachmentList'],
    classKeys: ['attachmentList'],
  },
  ChatComposerHelperText: {
    status: 'slot',
    parent: 'ChatComposer',
    slots: ['helperText'],
    classKeys: ['helperText'],
  },
  ChatComposerLabel: {
    status: 'slot',
    parent: 'ChatComposer',
    slots: ['label'],
    classKeys: ['label'],
  },
  ChatSuggestions: {
    status: 'state',
    parent: 'ChatMessageList',
    slots: ['root', 'item'],
    classKeys: ['root', 'item'],
  },
  ChatTypingIndicator: {
    status: 'state',
    parent: 'ChatMessageList',
    slots: ['root'],
    classKeys: ['root'],
  },
  ChatUnreadMarker: {
    status: 'state',
    parent: 'ChatMessageList',
    slots: ['root', 'label'],
    classKeys: ['root', 'label'],
  },
  ChatMessageSkeleton: {
    status: 'presentational',
    slots: ['root', 'line'],
    classKeys: ['root', 'line'],
  },
  ChatScrollToBottomAffordance: {
    status: 'state',
    parent: 'ChatMessageList',
    slots: ['root', 'badge', 'icon'],
    classKeys: ['root'],
  },
  ChatMessageSources: {
    status: 'presentational',
    slots: ['root', 'label', 'list'],
    classKeys: ['root', 'label', 'list'],
  },
  ChatCodeBlock: {
    status: 'presentational',
    classKeys: ['root', 'header', 'languageLabel', 'copyButton', 'pre', 'code'],
  },
  ChatConfirmation: {
    status: 'presentational',
    classKeys: [
      'root',
      'icon',
      'message',
      'actions',
      'confirmButton',
      'cancelButton',
    ],
  },
};

const statusLabels: Record<PlaygroundCardStatus, string> = {
  core: 'Core',
  compound: 'Compound',
  slot: 'Slot',
  state: 'State',
  presentational: 'Presentational',
  stable: 'Stable',
  new: 'New',
  updated: 'Updated',
  experimental: 'Experimental',
  deprecated: 'Deprecated',
};

const statusColors: Record<
  PlaygroundCardStatus,
  PlaygroundCardStatusBadge['color']
> = {
  core: 'primary',
  compound: 'secondary',
  slot: 'info',
  state: 'warning',
  presentational: 'success',
  stable: 'success',
  new: 'primary',
  updated: 'info',
  experimental: 'warning',
  deprecated: 'error',
};

function getComponentName(title: string) {
  return title.match(/^Chat[A-Za-z0-9]+/)?.[0] ?? title.replace(/\s*\(.+\)$/, '');
}

function resolveStatus(
  status: PlaygroundCardRegistryMetadata['status'],
): PlaygroundCardStatusBadge | null {
  if (!status) {
    return null;
  }
  if (typeof status === 'string') {
    return {
      label: statusLabels[status] ?? status,
      color: statusColors[status] ?? 'default',
    };
  }
  return status;
}

function getPreviewSizing(
  previewSize: PlaygroundPreviewSize | undefined,
  minHeight: number,
) {
  if (previewSize && typeof previewSize === 'object') {
    return {
      minHeight: previewSize.minHeight ?? {
        xs: `clamp(${Math.min(minHeight, 180)}px, 50vh, ${minHeight}px)`,
        sm: minHeight,
      },
      maxHeight: previewSize.maxHeight,
      maxWidth: previewSize.maxWidth ?? '100%',
      controlsWidth: previewSize.controlsWidth ?? 276,
      aspectRatio: previewSize.aspectRatio,
    };
  }

  const preset = previewSize ?? 'standard';
  const presetMaxWidth = {
    compact: 460,
    standard: '100%',
    wide: '100%',
    large: '100%',
    full: '100%',
  }[preset];
  const presetMinHeight = {
    compact: Math.min(minHeight, 220),
    standard: minHeight,
    wide: Math.max(minHeight, 280),
    large: Math.max(minHeight, 320),
    full: minHeight,
  }[preset];

  return {
    minHeight: {
      xs: `clamp(${Math.min(presetMinHeight, 180)}px, 50vh, ${presetMinHeight}px)`,
      sm: presetMinHeight,
    },
    maxHeight: undefined,
    maxWidth: presetMaxWidth,
    controlsWidth: preset === 'full' ? 300 : 276,
    aspectRatio: undefined,
  };
}

function joinDataAttribute(values: readonly string[] | undefined) {
  return values && values.length > 0 ? values.join(',') : undefined;
}

function getCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

type ControlsTab = 'props' | 'slots' | 'classes';

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{
        transition: 'transform 0.15s ease-in-out',
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-selected={active}
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        px: 0,
        py: 0,
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        fontSize: '0.65rem',
        letterSpacing: 1.2,
        fontWeight: 700,
        lineHeight: 1,
        color: active ? 'text.primary' : 'text.secondary',
        borderBottom: '2px solid',
        borderColor: active ? 'primary.main' : 'transparent',
        pb: 0.75,
        mb: -0.25,
        transition: 'color 0.15s ease, border-color 0.15s ease',
        '&:hover': {
          color: active ? 'text.primary' : 'text.primary',
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      })}
    >
      {label}
      {typeof count === 'number' && count > 0 ? (
        <Box
          component="span"
          sx={(theme) => ({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 16,
            height: 16,
            px: 0.5,
            borderRadius: 8,
            bgcolor: 'primary.main',
            color: theme.palette.primary.contrastText,
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: 0,
          })}
        >
          {count}
        </Box>
      ) : null}
    </Box>
  );
}

function CustomizationRow({
  item,
  defaultOpen,
}: {
  item: PlaygroundCustomization;
  defaultOpen?: boolean;
}) {
  const hasOverride = item.sx.trim().length > 0;
  const [open, setOpen] = React.useState(defaultOpen ?? hasOverride);
  const [draft, setDraft] = React.useState(item.sx);
  React.useEffect(() => {
    setDraft(item.sx);
  }, [item.sx]);

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'text.primary',
          py: 0.5,
          px: 0,
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        })}
      >
        <Box sx={{ color: 'text.secondary', display: 'inline-flex' }}>
          <ChevronIcon open={open} />
        </Box>
        <Typography
          variant="caption"
          sx={(theme) => ({
            fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
            fontSize: '0.72rem',
            fontWeight: 500,
            color: 'text.primary',
            overflowWrap: 'anywhere',
            minWidth: 0,
            flex: 1,
          })}
        >
          {item.selector ?? item.name}
        </Typography>
        {hasOverride ? (
          <Box
            component="span"
            sx={(theme) => ({
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              color: theme.palette.success.main,
              border: `1px solid ${theme.palette.success.main}`,
              borderRadius: 1,
              px: 0.5,
              py: 0.125,
              lineHeight: 1,
            })}
          >
            on
          </Box>
        ) : null}
      </Box>
      {open ? (
        <Box sx={{ pl: 2, pb: 0.5 }}>
          {item.description ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: '0.65rem', mb: 0.5 }}
            >
              {item.description}
            </Typography>
          ) : null}
          <Box
            component="textarea"
            value={draft}
            placeholder={'{\n  // sx object\n}'}
            spellCheck={false}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDraft(event.target.value)
            }
            onBlur={() => {
              if (draft !== item.sx) {
                item.onSxChange(draft);
              }
            }}
            sx={(theme) => ({
              width: '100%',
              minHeight: 64,
              maxHeight: 200,
              resize: 'vertical',
              fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
              fontSize: '0.7rem',
              lineHeight: 1.5,
              p: 0.75,
              borderRadius: 1,
              border: '1px solid',
              borderColor: item.parseError ? 'error.main' : 'divider',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(0, 0, 0, 0.25)'
                  : 'rgba(255, 255, 255, 0.6)',
              color: 'text.primary',
              outline: 'none',
              '&:focus-visible': {
                borderColor: item.parseError ? 'error.main' : 'primary.main',
                boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
              },
            })}
          />
          {item.parseError ? (
            <Typography
              variant="caption"
              color="error"
              sx={(theme) => ({
                display: 'block',
                fontSize: '0.65rem',
                mt: 0.5,
                fontFamily: theme.typography.fontFamilyCode ?? 'Menlo, monospace',
              })}
            >
              {item.parseError}
            </Typography>
          ) : null}
          {item.sx ? (
            <Box
              component="button"
              type="button"
              onClick={() => item.onSxChange('')}
              sx={{
                mt: 0.5,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: 'text.secondary',
                fontSize: '0.65rem',
                p: 0,
                '&:hover': { color: 'primary.main' },
              }}
            >
              Clear override
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function ResetButton({
  onClick,
  label = 'Reset',
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'text.secondary',
        fontSize: '0.7rem',
        p: 0,
        '&:hover': { color: 'primary.main' },
      }}
    >
      <RefreshIcon />
      {label}
    </Box>
  );
}

function CopyCodeBar({ getCode }: { getCode: () => string }) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | undefined>(undefined);
  React.useEffect(
    () => () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = React.useCallback(async () => {
    const code = getCode();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
      setCopied(true);
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(
        () => setCopied(false),
        1500,
      ) as unknown as number;
    } catch {
      // ignore — clipboard may be blocked in iframes
    }
  }, [getCode]);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 1.5,
        py: 0.875,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.02)',
      })}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.65rem', lineHeight: 1.3, minWidth: 0 }}
      >
        Copy JSX with your current props and overrides.
      </Typography>
      <Box
        component="button"
        type="button"
        onClick={handleCopy}
        sx={(theme) => ({
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          border: '1px solid',
          borderColor: copied ? theme.palette.success.main : 'divider',
          background:
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(0, 0, 0, 0.02)',
          color: copied ? theme.palette.success.main : 'text.primary',
          fontSize: '0.7rem',
          fontWeight: 600,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'color 0.15s ease, border-color 0.15s ease',
          '&:hover': {
            borderColor: copied
              ? theme.palette.success.main
              : theme.palette.primary.main,
            color: copied ? theme.palette.success.main : theme.palette.primary.main,
          },
        })}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied' : 'Copy code'}
      </Box>
    </Box>
  );
}

function MetadataRow({
  label,
  values,
}: {
  label: string;
  values: readonly string[] | undefined;
}) {
  if (!values || values.length === 0) {
    return null;
  }

  const visibleValues = values.slice(0, 4);
  const hiddenCount = values.length - visibleValues.length;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{ alignItems: 'center', minWidth: 0, flexWrap: 'wrap' }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 600, minWidth: 48 }}
      >
        {label}
      </Typography>
      {visibleValues.map((value) => (
        <Chip
          key={value}
          size="small"
          variant="outlined"
          label={value}
          sx={{ height: 22, fontSize: '0.7rem', maxWidth: 168 }}
        />
      ))}
      {hiddenCount > 0 ? (
        <Tooltip title={values.join(', ')}>
          <Chip
            size="small"
            variant="outlined"
            label={`+${hiddenCount}`}
            sx={{ height: 22, fontSize: '0.7rem' }}
          />
        </Tooltip>
      ) : null}
    </Stack>
  );
}

/**
 * Frame used by every playground card. Lays out a preview area on the left
 * and a controls sidebar on the right; collapses to a single column on
 * narrow screens.
 */
export function PlaygroundCard({
  title,
  description,
  preview,
  controls,
  onReset,
  previewFill = false,
  previewMinHeight = 220,
  previewBackground,
  span = 1,
  registry,
  componentName: componentNameProp,
  importName,
  packageName,
  sourcePath,
  docsPath,
  status,
  parent,
  slots,
  classKeys,
  previewSize,
  slotCustomizations,
  classCustomizations,
  onSlotsReset,
  onClassesReset,
  copyCode,
}: PlaygroundCardProps) {
  const slotsOverrideCount = React.useMemo(
    () => slotCustomizations?.filter((entry) => entry.sx.trim()).length ?? 0,
    [slotCustomizations],
  );
  const classesOverrideCount = React.useMemo(
    () => classCustomizations?.filter((entry) => entry.sx.trim()).length ?? 0,
    [classCustomizations],
  );
  const hasSlotsTab = (slotCustomizations?.length ?? 0) > 0;
  const hasClassesTab = (classCustomizations?.length ?? 0) > 0;
  const showTabs = hasSlotsTab || hasClassesTab;
  const [activeTab, setActiveTab] = React.useState<ControlsTab>('props');
  const componentId = title.replace(/[^a-zA-Z0-9]/g, '');
  const inferredComponentName =
    componentNameProp ?? registry?.componentName ?? getComponentName(title);
  const defaultMetadata = defaultRegistryMetadata[inferredComponentName];
  const resolvedMetadata: PlaygroundCardRegistryMetadata = {
    ...defaultMetadata,
    ...registry,
    componentName: inferredComponentName,
    importName:
      importName ??
      registry?.importName ??
      defaultMetadata?.importName ??
      inferredComponentName,
    packageName:
      packageName ??
      registry?.packageName ??
      defaultMetadata?.packageName ??
      DEFAULT_PACKAGE_NAME,
    sourcePath: sourcePath ?? registry?.sourcePath ?? defaultMetadata?.sourcePath,
    docsPath: docsPath ?? registry?.docsPath ?? defaultMetadata?.docsPath,
    status: status ?? registry?.status ?? defaultMetadata?.status,
    parent: parent ?? registry?.parent ?? defaultMetadata?.parent,
    slots: slots ?? registry?.slots ?? defaultMetadata?.slots,
    classKeys: classKeys ?? registry?.classKeys ?? defaultMetadata?.classKeys,
  };
  const statusBadge = resolveStatus(resolvedMetadata.status);
  const previewSizing = getPreviewSizing(previewSize, previewMinHeight);
  const controlsWidth = getCssSize(previewSizing.controlsWidth);

  return (
    <Paper
      id={componentId}
      data-playground-card=""
      data-playground-title={title}
      data-component-name={resolvedMetadata.componentName}
      data-import-name={resolvedMetadata.importName}
      data-package-name={resolvedMetadata.packageName}
      data-source-path={resolvedMetadata.sourcePath}
      data-docs-path={resolvedMetadata.docsPath}
      data-status={statusBadge?.label}
      data-status-key={
        typeof resolvedMetadata.status === 'string'
          ? resolvedMetadata.status
          : undefined
      }
      data-parent={resolvedMetadata.parent}
      data-slots={joinDataAttribute(resolvedMetadata.slots)}
      data-class-keys={joinDataAttribute(resolvedMetadata.classKeys)}
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.25, sm: 1.5 },
        gridColumn: { xs: 'span 1', lg: `span ${span}` },
        scrollMarginTop: '100px',
      }}
    >
      <Stack data-playground-header="" spacing={0.75}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, minWidth: 0 }}>
            {title}
          </Typography>
          {statusBadge ? (
            <Chip
              size="small"
              color={statusBadge.color}
              variant="outlined"
              label={statusBadge.label}
              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
            />
          ) : null}
          {resolvedMetadata.parent ? (
            <Chip
              size="small"
              variant="outlined"
              label={`in ${resolvedMetadata.parent}`}
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
          ) : null}
        </Stack>
        {description ? (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        ) : null}
        {resolvedMetadata.slots?.length || resolvedMetadata.classKeys?.length ? (
          <Stack spacing={0.5} sx={{ pt: 0.25 }}>
            <MetadataRow label="slots" values={resolvedMetadata.slots} />
            <MetadataRow label="classes" values={resolvedMetadata.classKeys} />
          </Stack>
        ) : null}
      </Stack>
      <Divider data-playground-divider="" flexItem />
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: controls
            ? { xs: '1fr', md: `minmax(0, 1fr) minmax(232px, ${controlsWidth})` }
            : '1fr',
          minHeight: 0,
        }}
      >
        <Box
          data-playground-preview=""
          sx={{
            minHeight: previewSizing.minHeight,
            maxHeight:
              previewSizing.maxHeight ??
              (previewFill ? previewSizing.minHeight : undefined),
            height: previewFill ? previewSizing.minHeight : undefined,
            display: 'flex',
            alignItems: previewFill ? 'stretch' : 'center',
            justifyContent: 'center',
            borderRadius: 2,
            backgroundColor: previewBackground,
            p: previewBackground ? { xs: 1, sm: 1.25 } : 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: previewSizing.maxWidth,
              height: previewFill ? '100%' : 'auto',
              aspectRatio: previewSizing.aspectRatio,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            {preview}
          </Box>
        </Box>
        {controls || showTabs ? (
          <Stack
            data-playground-controls=""
            spacing={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              alignSelf: 'flex-start',
              width: '100%',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                pt: showTabs ? 1 : 1,
                pb: showTabs ? 0 : 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              {showTabs ? (
                <Box
                  role="tablist"
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1.25,
                    minWidth: 0,
                    flexWrap: 'wrap',
                  }}
                >
                  <TabButton
                    label="Props"
                    active={activeTab === 'props'}
                    onClick={() => setActiveTab('props')}
                  />
                  {hasSlotsTab ? (
                    <TabButton
                      label="Slots"
                      count={slotsOverrideCount}
                      active={activeTab === 'slots'}
                      onClick={() => setActiveTab('slots')}
                    />
                  ) : null}
                  {hasClassesTab ? (
                    <TabButton
                      label="Classes"
                      count={classesOverrideCount}
                      active={activeTab === 'classes'}
                      onClick={() => setActiveTab('classes')}
                    />
                  ) : null}
                </Box>
              ) : (
                <Typography
                  variant="overline"
                  color="text.secondary"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    fontSize: '0.65rem',
                    lineHeight: 1,
                  }}
                >
                  Props
                </Typography>
              )}
              {activeTab === 'props' && onReset ? (
                <ResetButton onClick={onReset} />
              ) : null}
              {activeTab === 'slots' && onSlotsReset ? (
                <ResetButton onClick={onSlotsReset} />
              ) : null}
              {activeTab === 'classes' && onClassesReset ? (
                <ResetButton onClick={onClassesReset} />
              ) : null}
            </Box>
            {activeTab === 'props' && controls ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75,
                  px: 1.25,
                  py: 1,
                }}
              >
                {controls}
              </Box>
            ) : null}
            {activeTab === 'slots' && slotCustomizations ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  '& > *': {
                    py: 0.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& > *:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                {slotCustomizations.map((entry) => (
                  <CustomizationRow key={entry.name} item={entry} />
                ))}
              </Box>
            ) : null}
            {activeTab === 'classes' && classCustomizations ? (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  '& > *': {
                    py: 0.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& > *:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                {classCustomizations.map((entry) => (
                  <CustomizationRow key={entry.name} item={entry} />
                ))}
              </Box>
            ) : null}
            {copyCode ? <CopyCodeBar getCode={copyCode} /> : null}
          </Stack>
        ) : null}
      </Box>
    </Paper>
  );
}
