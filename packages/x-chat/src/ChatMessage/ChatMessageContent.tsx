'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { alpha } from '@mui/material/styles';
import { MessageContent, type MessageContentProps } from '@mui/x-chat-headless';
import { styled, createUseThemeProps } from '../internals/zero-styled';
import { useCopyToClipboard } from '../internals/useCopyToClipboard';
import { useChatMessageUtilityClasses, type ChatMessageClasses } from './chatMessageClasses';
import { renderMarkdown } from './renderMarkdown';

// ---------------------------------------------------------------------------
// Inline SVG icons — kept module-local to avoid an @mui/icons-material dep.
// ---------------------------------------------------------------------------

function ToolDefaultIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-2.6 2.4-2.4z" />
    </svg>
  );
}

function ReasoningDefaultIcon(props: React.SVGAttributes<SVGSVGElement>) {
  // Simplified brain — two lobes with a central seam.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 5a3 3 0 0 0-5.5-1.7A2.5 2.5 0 0 0 4 6.5a2.5 2.5 0 0 0-1 4 2.5 2.5 0 0 0 1 4 2.5 2.5 0 0 0 2.5 3.2A3 3 0 0 0 12 19V5Z" />
      <path d="M12 5a3 3 0 0 1 5.5-1.7A2.5 2.5 0 0 1 20 6.5a2.5 2.5 0 0 1 1 4 2.5 2.5 0 0 1-1 4 2.5 2.5 0 0 1-2.5 3.2A3 3 0 0 1 12 19V5Z" />
    </svg>
  );
}

function StatusCheckIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

function StatusCrossIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function StatusWarningIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path d="M10.3 3.9 1.8 18.4A2 2 0 0 0 3.5 21.4h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function StatusSpinnerIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 3a9 9 0 1 1-9 9" />
    </svg>
  );
}

function CopySvgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}

function CheckSvgIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const useThemeProps = createUseThemeProps('MuiChatMessageContent');

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
})<{ ownerState?: { role?: string; variant?: string; isOwnMessage?: boolean } }>(({
  theme,
  ownerState,
}) => {
  const isUserRole = ownerState?.role === 'user';
  const isOwn = ownerState?.isOwnMessage ?? false;
  const isCompact = ownerState?.variant === 'compact';

  // Base text styles shared between default and compact modes.
  const baseTextStyles = {
    fontSize: theme.typography.body2.fontSize,
    lineHeight: theme.typography.body2.lineHeight,
    wordBreak: 'break-word' as const,
    // Plain text (user role) preserves user-typed newlines; markdown-rendered
    // assistant content collapses whitespace as usual.
    whiteSpace: (isUserRole ? 'pre-wrap' : 'normal') as React.CSSProperties['whiteSpace'],
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    '& p': {
      margin: 0,
    },
    '& ol, & ul': {
      margin: theme.spacing(0.5, 0),
      paddingLeft: theme.spacing(2.5),
    },
    '& li + li': {
      marginTop: theme.spacing(0.25),
    },
  };

  if (isCompact) {
    // Compact: plain text without bubble background, padding, or border-radius.
    return {
      ...baseTextStyles,
      alignSelf: 'flex-start',
      color: (theme.vars || theme).palette.text.primary,
      '& pre': {
        margin: 0,
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
        padding: theme.spacing(1),
        fontSize: theme.typography.caption.fontSize,
        background: (theme.vars || theme).palette.action.hover,
      },
      '& code': {
        fontFamily: 'monospace',
        fontSize: '0.875em',
        background: (theme.vars || theme).palette.action.hover,
        padding: '0.1em 0.3em',
      },
      '& pre code': {
        background: 'none',
        padding: 0,
      },
      '& .MuiChatCodeBlock-root': {
        background: 'none',
      },
      '& .MuiChatCodeBlock-root pre': {
        background: 'none',
        padding: 0,
        borderRadius: 0,
      },
      '& .MuiChatCodeBlock-root code': {
        background: 'none',
        padding: 0,
      },
    };
  }

  return {
    ...baseTextStyles,
    position: 'relative', // Anchor for inline meta (timestamp + status)
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
    // Shrink to fit content width; own messages align to the trailing edge so
    // assistant and other-user bubbles share the leading edge.
    alignSelf: isOwn ? 'flex-end' : 'flex-start',
    '& pre': {
      margin: 0,
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      padding: theme.spacing(1),
      fontSize: theme.typography.caption.fontSize,
      background: isOwn
        ? alpha(theme.palette.common.white, 0.15)
        : (theme.vars || theme).palette.action.hover,
    },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '0.875em',
      background: isOwn
        ? alpha(theme.palette.common.white, 0.15)
        : (theme.vars || theme).palette.action.hover,
      padding: '0.1em 0.3em',
    },
    '& pre code': {
      background: 'none',
      padding: 0,
    },
    // Reset bubble's pre/code overrides when inside a ChatCodeBlock
    '& .MuiChatCodeBlock-root': {
      background: 'none',
    },
    '& .MuiChatCodeBlock-root pre': {
      background: 'none',
      padding: 0,
      borderRadius: 0,
    },
    '& .MuiChatCodeBlock-root code': {
      background: 'none',
      padding: 0,
    },
    backgroundColor: isOwn
      ? (theme.vars || theme).palette.primary.main
      : (theme.vars || theme).palette.grey[100],
    ...(!isOwn &&
      theme.applyStyles('dark', {
        backgroundColor: (theme.vars || theme).palette.grey[800],
      })),
    color: isOwn
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
  margin: theme.spacing(0.5, 0),
  fontSize: theme.typography.caption.fontSize,
  fontFamily: theme.typography.fontFamily,
  whiteSpace: 'normal',
  // Indent everything after the header (sections, errors, actions) with a
  // shared left-border accent — gives the expanded body a clean tree look.
  '& > summary ~ *': {
    marginLeft: 8,
    paddingLeft: theme.spacing(1.25),
    borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  },
  '& > summary ~ * + *': {
    marginTop: theme.spacing(0.25),
  },
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
      onToggle={(event: React.SyntheticEvent<HTMLDetailsElement>) => {
        setOpen((event.currentTarget as HTMLDetailsElement).open);
      }}
    />
  );
}

const ChatToolPartHeader = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ToolHeader',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.625),
  padding: theme.spacing(0.25, 0),
  cursor: 'pointer',
  userSelect: 'none',
  listStyleType: 'none',
  borderRadius: theme.shape.borderRadius,
  '&::-webkit-details-marker': { display: 'none' },
  '&::marker': { display: 'none' },
  // Chevron renders at the end of the header (after icon, title, state).
  '&::after': {
    content: '""',
    display: 'inline-block',
    width: 5,
    height: 5,
    borderRight: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    borderBottom: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    transform: 'rotate(-45deg)',
    transition: 'transform 150ms ease',
    flexShrink: 0,
    marginLeft: theme.spacing(0.25),
    opacity: 0.7,
  },
  'details[open] > &::after': {
    transform: 'rotate(45deg)',
  },
  '&:hover::after': {
    opacity: 1,
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
  width: 16,
  height: 16,
  flexShrink: 0,
  color: (theme.vars || theme).palette.text.secondary,
  fontSize: '1rem',
  lineHeight: 1,
}));

interface ChatToolPartIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  ownerState?: { toolName?: string };
}

/**
 * Default icon: a generic tool/wrench glyph.
 * Replace per tool via `toolSlots` / `toolSlotProps` on `partProps.tool`.
 */
const ChatToolPartIconComponent = React.forwardRef<HTMLSpanElement, ChatToolPartIconProps>(
  function ChatToolPartIcon({ ownerState, ...rest }, ref) {
    return (
      <ChatToolPartIconStyled ref={ref} ownerState={ownerState} {...rest}>
        <ToolDefaultIcon />
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
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
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

function resolveToolStatusIcon(state: string | undefined): React.ReactNode {
  switch (state) {
    case 'output-available':
      return <StatusCheckIcon />;
    case 'output-error':
    case 'output-denied':
      return <StatusCrossIcon />;
    case 'approval-requested':
      return <StatusWarningIcon />;
    case 'input-streaming':
    case 'input-available':
    case 'approval-responded':
      return <StatusSpinnerIcon className="MuiChatMessage-ToolStateSpinner" />;
    default:
      return null;
  }
}

const spinnerKeyframes = {
  '@keyframes mui-chat-tool-spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

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

  return {
    ...spinnerKeyframes,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 14,
    height: 14,
    flexShrink: 0,
    color,
    fontSize: '0.875rem',
    lineHeight: 1,
    '& .MuiChatMessage-ToolStateSpinner': {
      animation: 'mui-chat-tool-spin 1s linear infinite',
    },
  };
});

interface ChatToolPartStateRenderProps extends React.HTMLAttributes<HTMLSpanElement> {
  ownerState?: { state?: string };
  children?: React.ReactNode;
}

const ChatToolPartStateComponent = React.forwardRef<HTMLSpanElement, ChatToolPartStateRenderProps>(
  function ChatToolPartStateRender({ ownerState, children: _label, ...rest }, ref) {
    const icon = resolveToolStatusIcon(ownerState?.state);
    if (icon === null) {
      return null;
    }
    return (
      <ChatToolPartState
        ref={ref}
        ownerState={ownerState}
        aria-label={typeof _label === 'string' ? _label : undefined}
        role="status"
        {...rest}
      >
        {icon}
      </ChatToolPartState>
    );
  },
);

ChatToolPartStateComponent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  ownerState: PropTypes.shape({
    state: PropTypes.string,
  }),
} as any;

const ChatToolPartSectionDetails = styled('details', {
  name: 'MuiChatMessage',
  slot: 'ToolSection',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { section?: string } }>(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.caption.fontSize,
}));

const ChatToolPartSectionSummaryStyled = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ToolSectionSummary',
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState?: { section?: string } }>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  cursor: 'pointer',
  userSelect: 'none',
  listStyleType: 'none',
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.125, 0),
  '&::-webkit-details-marker': { display: 'none' },
  '&::marker': { display: 'none' },
  '& .MuiChatMessage-ToolSectionLabel': {
    fontWeight: theme.typography.fontWeightMedium,
    color: (theme.vars || theme).palette.text.primary,
    flexShrink: 0,
  },
  '& .MuiChatMessage-ToolSectionPreview': {
    color: (theme.vars || theme).palette.text.secondary,
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'monospace',
    fontSize: theme.typography.caption.fontSize,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  // Compact chevron — uses CSS-border square so it scales with currentColor.
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 5,
    height: 5,
    borderRight: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    borderBottom: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    transform: 'rotate(-45deg)',
    transition: 'transform 150ms ease',
    flexShrink: 0,
    opacity: 0.7,
  },
  'details[open] > &::before': {
    transform: 'rotate(45deg)',
  },
  '&:hover::before': {
    opacity: 1,
  },
  // Hide preview when the section is open
  'details[open] > & .MuiChatMessage-ToolSectionPreview': {
    display: 'none',
  },
}));

interface ChatToolPartSectionRenderProps extends React.HTMLAttributes<HTMLDetailsElement> {
  ownerState?: { section?: 'input' | 'output'; state?: string };
}

function ChatToolPartSection({ ownerState, ...rest }: ChatToolPartSectionRenderProps) {
  const section = ownerState?.section;
  const state = ownerState?.state;
  const initialOpen = React.useMemo(() => {
    if (section === 'input') {
      return state === 'input-streaming' || state === 'approval-requested';
    }
    if (section === 'output') {
      return state === 'output-available';
    }
    return false;
  }, [section, state]);
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <ChatToolPartSectionDetails
      ownerState={ownerState}
      open={open}
      onToggle={(event: React.SyntheticEvent<HTMLDetailsElement>) => {
        setOpen((event.currentTarget as HTMLDetailsElement).open);
      }}
      {...rest}
    />
  );
}

interface ChatToolPartSectionSummaryProps extends React.HTMLAttributes<HTMLElement> {
  ownerState?: {
    section?: 'input' | 'output';
    summaryLabel?: string;
    previewValue?: string;
  };
  children?: React.ReactNode;
}

const ChatToolPartSectionSummary = React.forwardRef<HTMLElement, ChatToolPartSectionSummaryProps>(
  function ChatToolPartSectionSummary({ ownerState, children, ...rest }, ref) {
    const label = ownerState?.summaryLabel ?? (typeof children === 'string' ? children : '');
    const preview = ownerState?.previewValue ?? '';
    return (
      <ChatToolPartSectionSummaryStyled
        ref={ref as React.Ref<HTMLElement>}
        ownerState={ownerState}
        {...(rest as any)}
      >
        <span className="MuiChatMessage-ToolSectionLabel">{label}:</span>
        {preview ? <span className="MuiChatMessage-ToolSectionPreview">{preview}</span> : null}
      </ChatToolPartSectionSummaryStyled>
    );
  },
);

ChatToolPartSectionSummary.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  ownerState: PropTypes.shape({
    previewValue: PropTypes.string,
    section: PropTypes.oneOf(['input', 'output']),
    summaryLabel: PropTypes.string,
  }),
} as any;

const ChatToolPartSectionContentWrapper = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolSectionContent',
})(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(0.375),
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  overflow: 'hidden',
}));

const ChatToolPartSectionContentPre = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1, 1.25),
  paddingRight: theme.spacing(4.5), // reserve room for the copy button
  fontSize: theme.typography.caption.fontSize,
  fontFamily: 'monospace',
  lineHeight: 1.5,
  overflow: 'auto',
  maxHeight: 320,
  color: (theme.vars || theme).palette.text.primary,
  whiteSpace: 'pre',
  wordBreak: 'normal',
}));

const ChatToolPartSectionCopyButton = styled('button')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(0.375),
  right: theme.spacing(0.375),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : 2,
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'pointer',
  lineHeight: 0,
  fontSize: '0.875rem',
  opacity: 0.6,
  transition: theme.transitions.create(['background-color', 'color', 'opacity']),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
    color: (theme.vars || theme).palette.text.primary,
    opacity: 1,
  },
  '&:focus-visible': {
    outline: `2px solid ${(theme.vars || theme).palette.primary.main}`,
    outlineOffset: 2,
    opacity: 1,
  },
}));

interface ChatToolPartSectionContentRenderProps extends React.HTMLAttributes<HTMLDivElement> {
  ownerState?: { section?: 'input' | 'output' };
  children?: React.ReactNode;
}

function ChatToolPartSectionContent({
  ownerState: _ownerState,
  children,
  ...rest
}: ChatToolPartSectionContentRenderProps) {
  const text = typeof children === 'string' ? children : React.Children.toArray(children).join('');
  const { copyState, copy } = useCopyToClipboard();
  return (
    <ChatToolPartSectionContentWrapper {...rest}>
      <ChatToolPartSectionContentPre>{children}</ChatToolPartSectionContentPre>
      {text.length > 0 ? (
        <ChatToolPartSectionCopyButton
          type="button"
          onClick={() => copy(text)}
          title={copyState === 'copied' ? 'Copied!' : 'Copy'}
          aria-label={copyState === 'copied' ? 'Copied' : 'Copy to clipboard'}
        >
          {copyState === 'copied' ? <CheckSvgIcon /> : <CopySvgIcon />}
        </ChatToolPartSectionCopyButton>
      ) : null}
    </ChatToolPartSectionContentWrapper>
  );
}

const ChatToolPartError = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolError',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.error.main,
  fontSize: theme.typography.caption.fontSize,
}));

const ChatToolPartActions = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolActions',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
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
  state: ChatToolPartStateComponent,
  icon: ChatToolPartIconComponent,
  section: ChatToolPartSection,
  sectionSummary: ChatToolPartSectionSummary,
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
  margin: theme.spacing(0.5, 0),
  fontSize: theme.typography.caption.fontSize,
}));

const ChatReasoningPartSummaryStyled = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ReasoningSummary',
})(({ theme }) => ({
  cursor: 'pointer',
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  userSelect: 'none',
  listStyleType: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.625),
  padding: theme.spacing(0.25, 0),
  '&::-webkit-details-marker': { display: 'none' },
  '&::marker': { display: 'none' },
  '& .MuiChatMessage-ReasoningIcon': {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: (theme.vars || theme).palette.text.secondary,
    flexShrink: 0,
  },
  '&::after': {
    content: '""',
    display: 'inline-block',
    width: 5,
    height: 5,
    borderRight: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    borderBottom: `1.25px solid ${(theme.vars || theme).palette.text.secondary}`,
    transform: 'rotate(-45deg)',
    transition: 'transform 150ms ease',
    flexShrink: 0,
    marginLeft: theme.spacing(0.25),
    opacity: 0.7,
  },
  'details[open] > &::after': {
    transform: 'rotate(45deg)',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

interface ChatReasoningSummaryProps extends React.HTMLAttributes<HTMLElement> {
  ownerState?: { streaming?: boolean };
  children?: React.ReactNode;
}

const ChatReasoningPartSummary = React.forwardRef<HTMLElement, ChatReasoningSummaryProps>(
  function ChatReasoningPartSummaryRender({ ownerState, children, ...rest }, ref) {
    return (
      <ChatReasoningPartSummaryStyled ref={ref as React.Ref<HTMLElement>} {...(rest as any)}>
        <span className="MuiChatMessage-ReasoningIcon" aria-hidden>
          <ReasoningDefaultIcon />
        </span>
        <span>{children}</span>
      </ChatReasoningPartSummaryStyled>
    );
  },
);

ChatReasoningPartSummary.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  ownerState: PropTypes.shape({
    streaming: PropTypes.bool,
  }),
} as any;

const ChatReasoningPartContent = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ReasoningContent',
})(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginLeft: 8,
  paddingLeft: theme.spacing(1.25),
  borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
  fontSize: theme.typography.body2.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
}));

const reasoningPartSlots = {
  root: ChatReasoningPartRoot,
  summary: ChatReasoningPartSummary,
  content: ChatReasoningPartContent,
};

// ---------------------------------------------------------------------------
// File Part — MUI-styled slot overrides (compact chip appearance)
// ---------------------------------------------------------------------------

const ChatFilePartRoot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'FileRoot',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  maxWidth: 180,
  padding: theme.spacing(0.25, 0.75),
  border: '1px solid currentColor',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: theme.typography.caption.lineHeight,
  color: 'inherit',
  opacity: 0.75,
  transition: 'opacity 150ms',
  '&:hover': {
    opacity: 1,
  },
}));

const ChatFilePartPreview = styled('img', {
  name: 'MuiChatMessage',
  slot: 'FilePreview',
})({
  width: 20,
  height: 20,
  objectFit: 'cover',
  borderRadius: 3,
  flexShrink: 0,
});

const ChatFilePartLink = styled('a', {
  name: 'MuiChatMessage',
  slot: 'FileLink',
})({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  textDecoration: 'none',
  color: 'inherit',
  minWidth: 0,
});

const ChatFilePartFilename = styled('span', {
  name: 'MuiChatMessage',
  slot: 'FileFilename',
})({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

const filePartSlots = {
  root: ChatFilePartRoot,
  preview: ChatFilePartPreview,
  link: ChatFilePartLink,
  filename: ChatFilePartFilename,
};

// ---------------------------------------------------------------------------
// Source URL Part — MUI-styled slot overrides
// ---------------------------------------------------------------------------

const ChatSourceUrlPartRoot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'SourceUrlRoot',
})(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  verticalAlign: 'middle',
}));

const ChatSourceUrlPartIcon = styled('span', {
  name: 'MuiChatMessage',
  slot: 'SourceUrlIcon',
})(({ theme }) => ({
  display: 'inline-flex',
  fontSize: '0.75em',
  color: (theme.vars || theme).palette.text.secondary,
}));

const ChatSourceUrlPartLink = styled('a', {
  name: 'MuiChatMessage',
  slot: 'SourceUrlLink',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.primary.main,
  textDecoration: 'none',
  fontSize: theme.typography.caption.fontSize,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const sourceUrlPartSlots = {
  root: ChatSourceUrlPartRoot,
  icon: ChatSourceUrlPartIcon,
  link: ChatSourceUrlPartLink,
};

// ---------------------------------------------------------------------------
// Source Document Part — MUI-styled slot overrides
// ---------------------------------------------------------------------------

const ChatSourceDocumentPartRoot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceDocumentRoot',
})(({ theme }) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 1.5),
  margin: theme.spacing(0.5, 0),
}));

const ChatSourceDocumentPartTitle = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceDocumentTitle',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  color: (theme.vars || theme).palette.text.primary,
}));

const ChatSourceDocumentPartExcerpt = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceDocumentExcerpt',
})(({ theme }) => ({
  fontSize: theme.typography.caption.fontSize,
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(0.5),
  lineHeight: 1.5,
}));

const sourceDocumentPartSlots = {
  root: ChatSourceDocumentPartRoot,
  title: ChatSourceDocumentPartTitle,
  excerpt: ChatSourceDocumentPartExcerpt,
};

// ---------------------------------------------------------------------------
// ChatMessageContent
// ---------------------------------------------------------------------------

const ChatMessageContent = React.forwardRef<HTMLDivElement, ChatMessageContentProps>(
  function ChatMessageContent(inProps, ref) {
    const props = useThemeProps({ props: inProps, name: 'MuiChatMessageContent' });
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
          } as any,
          bubble: {
            className: classes.bubble,
            ...slotProps?.bubble,
          } as any,
        }}
        partProps={{
          // Spread first so the specific entries below always override.
          // This lets unknown part types pass through without clobbering
          // the Material-slot merges for the known ones.
          ...userPartProps,
          text: {
            renderText: renderMarkdown,
            ...userPartProps?.text,
          },
          file: {
            slots: filePartSlots,
            ...userPartProps?.file,
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
          'source-url': {
            slots: sourceUrlPartSlots,
            ...userPartProps?.['source-url'],
          },
          'source-document': {
            slots: sourceDocumentPartSlots,
            ...userPartProps?.['source-document'],
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
  /**
   * Content rendered inside the bubble after the message parts.
   * Useful for placing inline metadata (e.g. timestamp, status) inside the bubble.
   */
  afterContent: PropTypes.node,
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
