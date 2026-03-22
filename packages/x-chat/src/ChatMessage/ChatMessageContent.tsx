'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha } from '@mui/material/styles';
import { styled, createUseThemeProps } from '../internals/zero-styled';

const useThemeProps = createUseThemeProps('MuiChatMessage');
import { MessageContent, type MessageContentProps } from '@mui/x-chat-unstyled';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import { renderMarkdown } from './renderMarkdown';

export interface ChatMessageContentProps extends MessageContentProps {
  className?: string;
  classes?: Partial<ChatMessageClasses>;
}

const ChatMessageContentStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Content',
  overridesResolver: (_, styles) => styles.content,
})(({ theme }) => ({
  gridArea: 'content',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  minWidth: 0,
  maxWidth: '100%',
}));

const ChatMessageBubbleStyled = styled('div', {
  name: 'MuiChatMessage',
  slot: 'Bubble',
  overridesResolver: (_, styles) => styles.bubble,
})<{ ownerState?: { role?: string } }>(({ theme, ownerState }) => {
  const isUser = ownerState?.role === 'user';

  return {
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.body2.fontSize,
    lineHeight: theme.typography.body2.lineHeight,
    wordBreak: 'break-word',
    // User messages preserve literal line-breaks; assistant messages render markdown
    // which produces its own block elements, so normal whitespace handling is correct.
    whiteSpace: isUser ? 'pre-wrap' : 'normal',
    maxWidth: '100%',
    boxSizing: 'border-box',
    '& p': {
      margin: 0,
    },
    '& pre': {
      margin: 0,
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      padding: theme.spacing(1),
      fontSize: theme.typography.caption.fontSize,
      background: isUser ? 'rgba(255,255,255,0.15)' : (theme.vars || theme).palette.action.hover,
    },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '0.875em',
      background: isUser ? 'rgba(255,255,255,0.15)' : (theme.vars || theme).palette.action.hover,
      padding: '0.1em 0.3em',
    },
    '& pre code': {
      background: 'none',
      padding: 0,
    },
    backgroundColor: isUser
      ? (theme.vars || theme).palette.primary.main
      : (theme.vars || theme).palette.grey[100],
    ...(!isUser && theme.applyStyles('dark', {
      backgroundColor: (theme.vars || theme).palette.grey[800],
    })),
    color: isUser
      ? (theme.vars || theme).palette.primary.contrastText
      : (theme.vars || theme).palette.text.primary,
  };
});

// ---------------------------------------------------------------------------
// Tool Part — MUI-styled slot overrides
// ---------------------------------------------------------------------------

const ChatToolPartDetailsStyled = styled('details', {
  name: 'MuiChatMessage',
  slot: 'ToolRoot',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { state?: string } }>(({ theme }) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  margin: theme.spacing(0.75, 0),
  fontSize: theme.typography.caption.fontSize,
  fontFamily: theme.typography.fontFamily,
  whiteSpace: 'normal',
}));

// Collapsible root: manages open/close state, auto-opens when approval is requested
function ChatToolPartRoot({
  ownerState,
  ...rest
}: {
  ownerState?: { state?: string };
  [key: string]: unknown;
}) {
  const state = ownerState?.state;
  const [open, setOpen] = React.useState(
    () => state === 'approval-requested' || state === 'input-streaming',
  );

  React.useEffect(() => {
    if (state === 'approval-requested') {
      setOpen(true);
    }
  }, [state]);

  return (
    <ChatToolPartDetailsStyled
      {...(rest as React.ComponentPropsWithRef<typeof ChatToolPartDetailsStyled>)}
      ownerState={ownerState}
      open={open}
      onToggle={(e: React.SyntheticEvent<HTMLDetailsElement>) => {
        setOpen((e.currentTarget as HTMLDetailsElement).open);
      }}
    />
  );
}

const ChatToolPartHeader = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ToolHeader',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.25),
  backgroundColor: (theme.vars || theme).palette.action.hover,
  cursor: 'pointer',
  userSelect: 'none',
  listStyleType: 'none',
  '&::-webkit-details-marker': { display: 'none' },
  '&::marker': { display: 'none' },
  // Separator between header and body when expanded
  'details[open] > &': {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
}));

const ChatToolPartIconStyled = styled('span', {
  name: 'MuiChatMessage',
  slot: 'ToolIcon',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { toolName?: string } }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : 2,
  // Default (expanded): show the tool icon character at normal size
  fontSize: '0.6rem',
  fontFamily: 'monospace',
  fontWeight: theme.typography.fontWeightBold,
  flexShrink: 0,
  backgroundColor: (theme.vars || theme).palette.action.selected,
  color: (theme.vars || theme).palette.text.secondary,
  userSelect: 'none',
  lineHeight: 1,
  transition: 'opacity 100ms',
  // Collapsed + hovering summary: hide icon char, show '+' hint
  'details:not([open]) summary:hover &': {
    fontSize: 0,
    '&::before': {
      content: '"+"',
      fontSize: '0.8rem',
      fontWeight: theme.typography.fontWeightRegular,
      lineHeight: 1,
    },
  },
  // Expanded + hovering summary: hide icon char, show '−' hint
  'details[open] summary:hover &': {
    fontSize: 0,
    '&::before': {
      content: '"−"',
      fontSize: '0.9rem',
      fontWeight: theme.typography.fontWeightRegular,
      lineHeight: 1,
    },
  },
}));

interface ChatToolPartIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  ownerState?: { toolName?: string };
}

/**
 * Default icon: shows the first letter of the tool name.
 * Replace per tool via `toolSlots` / `toolSlotProps` on `partProps.tool`.
 */
const ChatToolPartIconComponent = React.forwardRef<HTMLSpanElement, ChatToolPartIconProps>(
  function ChatToolPartIcon({ ownerState, ...rest }, ref) {
    const toolName = ownerState?.toolName ?? '';
    const letter = toolName.length > 0 ? toolName[0].toUpperCase() : '⚙';
    return (
      <ChatToolPartIconStyled ref={ref} ownerState={ownerState} {...rest}>
        {letter}
      </ChatToolPartIconStyled>
    );
  },
);

ChatToolPartIconComponent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  ownerState: PropTypes.shape({
    toolName: PropTypes.string,
  }),
} as any;

const ChatToolPartTitle = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolTitle',
})(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 1,
  minWidth: 0,
}));

type ToolStatePalette = 'warning' | 'success' | 'error' | 'info' | 'default';

function resolveToolStatePalette(state: string | undefined): ToolStatePalette {
  switch (state) {
    case 'input-streaming':
    case 'approval-requested':
      return 'warning';
    case 'output-available':
      return 'success';
    case 'output-error':
    case 'output-denied':
      return 'error';
    case 'input-available':
    case 'approval-responded':
      return 'info';
    default:
      return 'default';
  }
}

const ChatToolPartState = styled('span', {
  name: 'MuiChatMessage',
  slot: 'ToolState',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { state?: string } }>(({ theme, ownerState }) => {
  const palette = resolveToolStatePalette(ownerState?.state);
  const isDefault = palette === 'default';
  const color = isDefault
    ? (theme.vars || theme).palette.text.secondary
    : (theme.vars || theme).palette[palette].main;
  // Use theme.palette (not theme.vars) for alpha so we always get a real color string.
  const bg = isDefault
    ? (theme.vars || theme).palette.action.selected
    : alpha(theme.palette[palette].main, 0.12);

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0.75),
    height: 18,
    borderRadius: 9,
    fontSize: '0.6rem',
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    backgroundColor: bg,
    color,
  };
});

const ChatToolPartSection = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolSection',
})(({ theme }) => ({
  padding: theme.spacing(0.75, 1.25),
  '& + &': {
    borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '& strong': {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: (theme.vars || theme).palette.text.disabled,
    marginBottom: theme.spacing(0.5),
  },
}));

const ChatToolPartSectionContent = styled('pre', {
  name: 'MuiChatMessage',
  slot: 'ToolSectionContent',
})(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(0.75, 1),
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : 2,
  backgroundColor: (theme.vars || theme).palette.action.hover,
  fontSize: theme.typography.caption.fontSize,
  fontFamily: 'monospace',
  lineHeight: 1.5,
  overflow: 'auto',
  maxHeight: 240,
  color: (theme.vars || theme).palette.text.primary,
  whiteSpace: 'pre',
  wordBreak: 'normal',
}));

const ChatToolPartError = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolError',
})(({ theme }) => ({
  padding: theme.spacing(0.75, 1.25),
  color: (theme.vars || theme).palette.error.main,
  fontSize: theme.typography.caption.fontSize,
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ChatToolPartActions = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolActions',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 1.25),
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
  backgroundColor: (theme.vars || theme).palette.action.hover,
}));

const toolActionButtonBase = ({ theme }: { theme: any }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.4, 1.25),
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : 2,
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  fontFamily: theme.typography.fontFamily,
  lineHeight: 1.4,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'background-color 150ms, border-color 150ms, color 150ms',
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const ChatToolPartApproveButton = styled('button', {
  name: 'MuiChatMessage',
  slot: 'ToolApproveButton',
})(({ theme }) => ({
  ...toolActionButtonBase({ theme }),
  backgroundColor: (theme.vars || theme).palette.success.main,
  borderColor: (theme.vars || theme).palette.success.main,
  color: (theme.vars || theme).palette.success.contrastText,
  '&:hover:not(:disabled)': {
    backgroundColor: (theme.vars || theme).palette.success.dark,
    borderColor: (theme.vars || theme).palette.success.dark,
  },
}));

const ChatToolPartDenyButton = styled('button', {
  name: 'MuiChatMessage',
  slot: 'ToolDenyButton',
})(({ theme }) => ({
  ...toolActionButtonBase({ theme }),
  backgroundColor: 'transparent',
  borderColor: (theme.vars || theme).palette.divider,
  color: (theme.vars || theme).palette.text.secondary,
  '&:hover:not(:disabled)': {
    borderColor: (theme.vars || theme).palette.error.main,
    color: (theme.vars || theme).palette.error.main,
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
}));

const toolPartSlots = {
  root: ChatToolPartRoot,
  header: ChatToolPartHeader,
  title: ChatToolPartTitle,
  state: ChatToolPartState,
  icon: ChatToolPartIconComponent,
  section: ChatToolPartSection,
  sectionContent: ChatToolPartSectionContent,
  error: ChatToolPartError,
  actions: ChatToolPartActions,
  approveButton: ChatToolPartApproveButton,
  denyButton: ChatToolPartDenyButton,
};

// ---------------------------------------------------------------------------
// Reasoning Part — MUI-styled slot overrides
// ---------------------------------------------------------------------------

const ChatReasoningPartRoot = styled('details', {
  name: 'MuiChatMessage',
  slot: 'ReasoningRoot',
})(({ theme }) => ({
  borderLeft: `2px solid ${(theme.vars || theme).palette.divider}`,
  paddingLeft: theme.spacing(1),
  margin: theme.spacing(0.5, 0),
  '&[open] summary::marker, &[open] summary::-webkit-details-marker': {
    // handled via pseudo-element below
  },
}));

const ChatReasoningPartSummary = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ReasoningSummary',
})(({ theme }) => ({
  cursor: 'pointer',
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  userSelect: 'none',
  listStyleType: 'none',
  '&::-webkit-details-marker': {
    display: 'none',
  },
  '&::marker': {
    display: 'none',
  },
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  '&::before': {
    content: '"▶"',
    fontSize: '0.5rem',
    display: 'inline-block',
    transition: 'transform 0.15s ease',
  },
  'details[open] > &::before': {
    transform: 'rotate(90deg)',
  },
}));

const ChatReasoningPartContent = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ReasoningContent',
})(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.disabled,
  fontStyle: 'italic',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
}));

const reasoningPartSlots = {
  root: ChatReasoningPartRoot,
  summary: ChatReasoningPartSummary,
  content: ChatReasoningPartContent,
};

// ---------------------------------------------------------------------------
// ChatMessageContent
// ---------------------------------------------------------------------------

const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  function ChatMessageContent(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessage' });
    const {
      slots,
      slotProps,
      className,
      classes: classesProp,
      partProps: userPartProps,
      ...other
    } = props;
    const classes = useChatMessageUtilityClasses(classesProp);

    return (
      <MessageContent
        ref={ref}
        {...other}
        slots={{
          content: slots?.content ?? ChatMessageContentStyled,
          bubble: slots?.bubble ?? ChatMessageBubbleStyled,
          ...slots,
        }}
        slotProps={{
          ...slotProps,
          content: {
            className: clsx(classes.content, className),
            ...slotProps?.content,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          bubble: {
            className: classes.bubble,
            ...slotProps?.bubble,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
        partProps={{
          // Spread first so the specific entries below always override.
          // This lets unknown part types (file, source-url, …) pass through
          // without clobbering the Material-slot merges for the known ones.
          ...userPartProps,
          text: {
            renderText: renderMarkdown,
            ...userPartProps?.text,
          },
          tool: {
            slots: toolPartSlots,
            ...userPartProps?.tool,
          },
          'dynamic-tool': {
            slots: toolPartSlots,
            ...userPartProps?.['dynamic-tool'],
          },
          reasoning: {
            slots: reasoningPartSlots,
            ...userPartProps?.reasoning,
          },
        }}
      />
    );
  },
);

ChatMessageContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  className: PropTypes.string,
  /**
   * Props forwarded to the built-in unstyled part renderer components.
   * Use this to pass `slots` and `slotProps` to individual part type renderers.
   */
  partProps: PropTypes.shape({
    'dynamic-tool': PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      toolSlotProps: PropTypes.object,
      toolSlots: PropTypes.object,
    }),
    file: PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
    }),
    reasoning: PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
    }),
    'source-document': PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
    }),
    'source-url': PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
    }),
    text: PropTypes.shape({
      renderText: PropTypes.func,
    }),
    tool: PropTypes.shape({
      className: PropTypes.string,
      slotProps: PropTypes.object,
      slots: PropTypes.object,
      toolSlotProps: PropTypes.object,
      toolSlots: PropTypes.object,
    }),
  }),
  /**
   * @deprecated Use `partProps` instead.
   * Callback to resolve a built-in part renderer for a given part type.
   * @param {ChatMessagePart} part The message part to resolve a renderer for.
   * @param {ChatLocaleText} localeText The locale text for the chat.
   * @returns {ChatPartRenderer<ChatMessagePart> | null} A renderer or null.
   */
  resolveBuiltInPartRenderer: PropTypes.func,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
} as any;

export { ChatMessageContent };
