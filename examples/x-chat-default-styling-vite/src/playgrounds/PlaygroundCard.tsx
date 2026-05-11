import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { CodeBlock } from '../components/CodeBlock';

function ExpandMoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

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
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
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
  /** Code example to display in a collapsible section. */
  codeExample?: string;
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
    slots: ['item', 'itemAvatar', 'itemContent', 'title', 'preview', 'timestamp', 'unreadBadge'],
    classKeys: ['root', 'item', 'itemSelected', 'itemUnread', 'itemFocused', 'compact'],
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
    slots: ['messageList', 'messageListScroller', 'messageListContent', 'messageListOverlay'],
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
    classKeys: ['root', 'icon', 'message', 'actions', 'confirmButton', 'cancelButton'],
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

const statusColors: Record<PlaygroundCardStatus, PlaygroundCardStatusBadge['color']> = {
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
    return { label: statusLabels[status] ?? status, color: statusColors[status] ?? 'default' };
  }
  return status;
}

function getPreviewSizing(previewSize: PlaygroundPreviewSize | undefined, minHeight: number) {
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

function MetadataRow({ label, values }: { label: string; values: readonly string[] | undefined }) {
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
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, minWidth: 48 }}>
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
  codeExample,
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
}: PlaygroundCardProps) {
  const componentId = title.replace(/[^a-zA-Z0-9]/g, '');
  const inferredComponentName =
    componentNameProp ?? registry?.componentName ?? getComponentName(title);
  const defaultMetadata = defaultRegistryMetadata[inferredComponentName];
  const resolvedMetadata: PlaygroundCardRegistryMetadata = {
    ...defaultMetadata,
    ...registry,
    componentName: inferredComponentName,
    importName:
      importName ?? registry?.importName ?? defaultMetadata?.importName ?? inferredComponentName,
    packageName:
      packageName ?? registry?.packageName ?? defaultMetadata?.packageName ?? DEFAULT_PACKAGE_NAME,
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
        typeof resolvedMetadata.status === 'string' ? resolvedMetadata.status : undefined
      }
      data-parent={resolvedMetadata.parent}
      data-slots={joinDataAttribute(resolvedMetadata.slots)}
      data-class-keys={joinDataAttribute(resolvedMetadata.classKeys)}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.25, sm: 1.5 },
        gridColumn: { xs: 'span 1', lg: `span ${span}` },
        scrollMarginTop: '100px',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'action.disabled',
          boxShadow: 2,
        },
      }}
    >
      <Stack data-playground-header="" spacing={0.75}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
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
            maxHeight: previewSizing.maxHeight,
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
        {controls ? (
          <Stack
            data-playground-controls=""
            spacing={1.5}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'),
              p: 1.5,
              alignSelf: 'flex-start',
              width: '100%',
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 600, letterSpacing: 1 }}
              >
                props
              </Typography>
              {onReset ? (
                <Box
                  component="button"
                  onClick={onReset}
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                  Reset
                </Box>
              ) : null}
            </Box>
            {controls}
          </Stack>
        ) : null}
      </Box>
      {codeExample ? (
        <Accordion
          data-playground-code=""
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            bgcolor: 'transparent',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              minHeight: 40,
              '& .MuiAccordionSummary-content': {
                my: 0,
                alignItems: 'center',
                gap: 1,
              },
            }}
          >
            <Box component="span" sx={{ color: 'action.active', display: 'flex' }}>
              <CodeIcon />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              Code Example
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <CodeBlock code={codeExample} />
          </AccordionDetails>
        </Accordion>
      ) : null}
    </Paper>
  );
}
