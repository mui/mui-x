'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import type { SlotComponentProps } from '@mui/utils/types';
import type {
  ChatDynamicToolMessagePart,
  ChatFileMessagePart,
  ChatMessagePart,
  ChatPartRenderer,
  ChatPartRendererProps,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatToolMessagePart,
} from '@mui/x-chat-headless';
import { useChat } from '@mui/x-chat-headless';
import { styled } from '../internals/material/chatStyled';
import { createDefaultSlot, joinClassNames, mergeSlotPropsWithClassName } from '../internals/utils';
import { chatMessageClasses } from './chatMessageClasses';

type ChatPartLocaleText = {
  messageReasoningLabel: string;
  messageReasoningStreamingLabel: string;
  messageToolApproveButtonLabel: string;
  messageToolDenyButtonLabel: string;
  messageToolInputLabel: string;
  messageToolOutputLabel: string;
  toolStateLabel(state: string): string;
};

const DEFAULT_PART_LOCALE_TEXT: ChatPartLocaleText = {
  messageReasoningLabel: 'Reasoning',
  messageReasoningStreamingLabel: 'Thinking...',
  messageToolApproveButtonLabel: 'Approve',
  messageToolDenyButtonLabel: 'Deny',
  messageToolInputLabel: 'Input',
  messageToolOutputLabel: 'Output',
  toolStateLabel: (state) => state,
};

function createPartRenderer<
  TPart extends ChatMessagePart,
  TProps extends ChatPartRendererProps<TPart>,
>(
  Component: React.ComponentType<TProps>,
  defaultProps: Omit<TProps, 'index' | 'message' | 'onToolCall' | 'part'>,
): ChatPartRenderer<TPart> {
  return function StyledPartRenderer(props) {
    return (
      <Component
        {...(defaultProps as Omit<TProps, 'index' | 'message' | 'onToolCall' | 'part'>)}
        {...(props as unknown as TProps)}
      />
    );
  };
}

function formatStructuredValue(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function shouldCollapsePayload(text: string) {
  return text.length > 320 || text.split('\n').length > 8;
}

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z" />
      <path d="M5 5h6v2H7v10h10v-4h2v6H5V5Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M6 2h8l4 4v16H6V2Zm8 1.5V7h3.5L14 3.5Z" />
    </svg>
  );
}

function getToolStateColor(theme: Theme, state: string) {
  switch (state) {
    case 'output-error':
      return theme.palette.error.main;
    case 'output-denied':
    case 'approval-requested':
      return theme.palette.warning.main;
    case 'output-available':
      return theme.palette.success.main;
    default:
      return theme.palette.info.main;
  }
}

export interface ChatReasoningPartRendererOwnerState {
  messageId: string;
  role: ChatPartRendererProps<ChatReasoningMessagePart>['message']['role'];
  streaming: boolean;
}

export interface ChatReasoningPartRendererSlots {
  root: React.ElementType;
  summary: React.ElementType;
  content: React.ElementType;
}

export interface ChatReasoningPartRendererSlotProps {
  root?: SlotComponentProps<'details', {}, ChatReasoningPartRendererOwnerState>;
  summary?: SlotComponentProps<'summary', {}, ChatReasoningPartRendererOwnerState>;
  content?: SlotComponentProps<'div', {}, ChatReasoningPartRendererOwnerState>;
}

export interface ChatReasoningPartRendererProps extends ChatPartRendererProps<ChatReasoningMessagePart> {
  className?: string;
  localeText?: Partial<
    Pick<ChatPartLocaleText, 'messageReasoningLabel' | 'messageReasoningStreamingLabel'>
  >;
  slotProps?: ChatReasoningPartRendererSlotProps;
  slots?: Partial<ChatReasoningPartRendererSlots>;
  sx?: SxProps<Theme>;
}

export type ChatReasoningPartRendererOptions = Omit<
  ChatReasoningPartRendererProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatReasoningRootSlot = styled('details', {
  name: 'MuiChatMessage',
  slot: 'Reasoning',
})(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  color: theme.palette.text.secondary,
  margin: 0,
  minWidth: 0,
  padding: theme.spacing(0.75, 1),
}));

const ChatReasoningSummarySlot = styled('summary', {
  name: 'MuiChatMessage',
  slot: 'ReasoningSummary',
})(({ theme }) => ({
  ...theme.typography.caption,
  cursor: 'pointer',
  fontWeight: theme.typography.fontWeightMedium,
  listStyle: 'none',
  outline: 0,
}));

const ChatReasoningContentSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ReasoningContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  marginBlockStart: theme.spacing(0.75),
  minWidth: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

export const ChatReasoningPartRenderer = React.forwardRef(function ChatReasoningPartRenderer(
  props: ChatReasoningPartRendererProps,
  ref: React.Ref<HTMLDetailsElement>,
) {
  const { className, localeText: localeTextProp, message, part, slotProps, slots, sx } = props;
  const localeText = React.useMemo(
    () => ({
      messageReasoningLabel: DEFAULT_PART_LOCALE_TEXT.messageReasoningLabel,
      messageReasoningStreamingLabel: DEFAULT_PART_LOCALE_TEXT.messageReasoningStreamingLabel,
      ...localeTextProp,
    }),
    [localeTextProp],
  );
  const ownerState = React.useMemo<ChatReasoningPartRendererOwnerState>(
    () => ({
      messageId: message.id,
      role: message.role,
      streaming: part.state === 'streaming',
    }),
    [message.id, message.role, part.state],
  );
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatReasoningRootSlot, sx),
    [slots?.root, sx],
  );
  const Summary = slots?.summary ?? ChatReasoningSummarySlot;
  const Content = slots?.content ?? ChatReasoningContentSlot;
  const rootProps = mergeSlotPropsWithClassName(
    slotProps?.root,
    className
      ? joinClassNames(chatMessageClasses.reasoning, className)
      : chatMessageClasses.reasoning,
  )(ownerState);
  const summaryProps = mergeSlotPropsWithClassName(
    slotProps?.summary,
    chatMessageClasses.reasoningSummary,
  )(ownerState);
  const contentProps = mergeSlotPropsWithClassName(
    slotProps?.content,
    chatMessageClasses.reasoningContent,
  )(ownerState);

  return (
    <Root {...rootProps} open={ownerState.streaming} ownerState={ownerState} ref={ref}>
      <Summary {...summaryProps} ownerState={ownerState}>
        {ownerState.streaming
          ? localeText.messageReasoningStreamingLabel
          : localeText.messageReasoningLabel}
      </Summary>
      <Content {...contentProps} ownerState={ownerState}>
        {part.text}
      </Content>
    </Root>
  );
});

export function createChatReasoningPartRenderer(
  defaultProps: ChatReasoningPartRendererOptions = {},
): ChatPartRenderer<ChatReasoningMessagePart> {
  return createPartRenderer(ChatReasoningPartRenderer, defaultProps);
}

type ToolPart = ChatToolMessagePart | ChatDynamicToolMessagePart;

export interface ChatToolPartRendererOwnerState {
  messageId: string;
  pendingApproval: boolean;
  role: ChatPartRendererProps<ToolPart>['message']['role'];
  state: ToolPart['toolInvocation']['state'];
}

interface ChatToolPartSectionOwnerState extends ChatToolPartRendererOwnerState {
  section: 'input' | 'output';
}

export interface ChatToolPartRendererSlots {
  root: React.ElementType;
  header: React.ElementType;
  title: React.ElementType;
  state: React.ElementType;
  section: React.ElementType;
  sectionContent: React.ElementType;
  error: React.ElementType;
  actions: React.ElementType;
  approveButton: React.ElementType;
  denyButton: React.ElementType;
}

export interface ChatToolPartRendererSlotProps {
  root?: SlotComponentProps<typeof Paper, {}, ChatToolPartRendererOwnerState>;
  header?: SlotComponentProps<'div', {}, ChatToolPartRendererOwnerState>;
  title?: SlotComponentProps<'div', {}, ChatToolPartRendererOwnerState>;
  state?: SlotComponentProps<typeof Chip, {}, ChatToolPartRendererOwnerState>;
  section?: SlotComponentProps<'div', {}, ChatToolPartSectionOwnerState>;
  sectionContent?: SlotComponentProps<'pre', {}, ChatToolPartSectionOwnerState>;
  error?: SlotComponentProps<'div', {}, ChatToolPartRendererOwnerState>;
  actions?: SlotComponentProps<'div', {}, ChatToolPartRendererOwnerState>;
  approveButton?: SlotComponentProps<typeof Button, {}, ChatToolPartRendererOwnerState>;
  denyButton?: SlotComponentProps<typeof Button, {}, ChatToolPartRendererOwnerState>;
}

export interface ChatToolPartRendererProps extends ChatPartRendererProps<ToolPart> {
  className?: string;
  localeText?: Partial<
    Pick<
      ChatPartLocaleText,
      | 'messageToolApproveButtonLabel'
      | 'messageToolDenyButtonLabel'
      | 'messageToolInputLabel'
      | 'messageToolOutputLabel'
      | 'toolStateLabel'
    >
  >;
  slotProps?: ChatToolPartRendererSlotProps;
  slots?: Partial<ChatToolPartRendererSlots>;
  sx?: SxProps<Theme>;
}

export type ChatToolPartRendererOptions = Omit<
  ChatToolPartRendererProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatToolRootSlot = styled(Paper, {
  name: 'MuiChatMessage',
  slot: 'Tool',
})<{ ownerState: ChatToolPartRendererOwnerState }>(({ theme, ownerState }) => {
  const accentColor = getToolStateColor(theme, ownerState.state);

  return {
    backgroundColor: alpha(accentColor, 0.06),
    border: `1px solid ${alpha(accentColor, 0.28)}`,
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    color: theme.palette.text.primary,
    display: 'grid',
    gap: theme.spacing(1),
    minWidth: 0,
    padding: theme.spacing(1.25),
  };
});

const ChatToolHeaderSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolHeader',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
  minWidth: 0,
}));

const ChatToolTitleSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const ChatToolStateSlot = styled(Chip, {
  name: 'MuiChatMessage',
  slot: 'ToolState',
})<{ ownerState: ChatToolPartRendererOwnerState }>(({ theme, ownerState }) => {
  const accentColor = getToolStateColor(theme, ownerState.state);

  return {
    backgroundColor: alpha(accentColor, 0.12),
    color: accentColor,
    fontWeight: theme.typography.fontWeightMedium,
  };
});

const ChatToolSectionSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolSection',
})(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.12 : 0.03),
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
  minWidth: 0,
  padding: theme.spacing(0.75, 1),
}));

const ChatToolSectionContentSlot = styled('pre', {
  name: 'MuiChatMessage',
  slot: 'ToolSectionContent',
})(({ theme }) => ({
  ...theme.typography.body2,
  fontFamily: theme.typography.fontFamily,
  margin: 0,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const ChatToolErrorSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolError',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.error.main,
  minWidth: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

const ChatToolActionsSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'ToolActions',
})(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const ChatToolApproveButtonSlot = styled(Button, {
  name: 'MuiChatMessage',
  slot: 'ToolApproveButton',
})({});

const ChatToolDenyButtonSlot = styled(Button, {
  name: 'MuiChatMessage',
  slot: 'ToolDenyButton',
})({});

function ToolPayloadSection(props: {
  label: string;
  ownerState: ChatToolPartRendererOwnerState;
  section: 'input' | 'output';
  slotProps?: ChatToolPartRendererSlotProps;
  slots?: Partial<ChatToolPartRendererSlots>;
  value: unknown;
}) {
  const { label, ownerState, section, slotProps, slots, value } = props;
  const formatted = React.useMemo(() => formatStructuredValue(value), [value]);
  const collapsed = shouldCollapsePayload(formatted);
  const sectionOwnerState = React.useMemo<ChatToolPartSectionOwnerState>(
    () => ({
      ...ownerState,
      section,
    }),
    [ownerState, section],
  );
  const Section = slots?.section ?? ChatToolSectionSlot;
  const SectionContent = slots?.sectionContent ?? ChatToolSectionContentSlot;
  const sectionProps = mergeSlotPropsWithClassName(
    slotProps?.section,
    chatMessageClasses.toolSection,
  )(sectionOwnerState);
  const sectionContentProps = mergeSlotPropsWithClassName(
    slotProps?.sectionContent,
    chatMessageClasses.toolSectionContent,
  )(sectionOwnerState);

  if (!collapsed) {
    return (
      <Section {...sectionProps} ownerState={sectionOwnerState}>
        <strong>{label}</strong>
        <SectionContent {...sectionContentProps} ownerState={sectionOwnerState}>
          {formatted}
        </SectionContent>
      </Section>
    );
  }

  return (
    <Section {...sectionProps} ownerState={sectionOwnerState}>
      <details>
        <summary>{label}</summary>
        <SectionContent {...sectionContentProps} ownerState={sectionOwnerState}>
          {formatted}
        </SectionContent>
      </details>
    </Section>
  );
}

export const ChatToolPartRenderer = React.forwardRef(function ChatToolPartRenderer(
  props: ChatToolPartRendererProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { addToolApprovalResponse } = useChat();
  const { className, localeText: localeTextProp, message, part, slotProps, slots, sx } = props;
  const [pendingApproval, setPendingApproval] = React.useState(false);
  const localeText = React.useMemo(
    () => ({
      messageToolApproveButtonLabel: DEFAULT_PART_LOCALE_TEXT.messageToolApproveButtonLabel,
      messageToolDenyButtonLabel: DEFAULT_PART_LOCALE_TEXT.messageToolDenyButtonLabel,
      messageToolInputLabel: DEFAULT_PART_LOCALE_TEXT.messageToolInputLabel,
      messageToolOutputLabel: DEFAULT_PART_LOCALE_TEXT.messageToolOutputLabel,
      toolStateLabel: DEFAULT_PART_LOCALE_TEXT.toolStateLabel,
      ...localeTextProp,
    }),
    [localeTextProp],
  );
  const ownerState = React.useMemo<ChatToolPartRendererOwnerState>(
    () => ({
      messageId: message.id,
      pendingApproval,
      role: message.role,
      state: part.toolInvocation.state,
    }),
    [message.id, message.role, part.toolInvocation.state, pendingApproval],
  );
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatToolRootSlot, sx),
    [slots?.root, sx],
  );
  const Header = slots?.header ?? ChatToolHeaderSlot;
  const Title = slots?.title ?? ChatToolTitleSlot;
  const State = slots?.state ?? ChatToolStateSlot;
  const Error = slots?.error ?? ChatToolErrorSlot;
  const Actions = slots?.actions ?? ChatToolActionsSlot;
  const ApproveButton = slots?.approveButton ?? ChatToolApproveButtonSlot;
  const DenyButton = slots?.denyButton ?? ChatToolDenyButtonSlot;
  const rootProps = mergeSlotPropsWithClassName(
    slotProps?.root,
    className ? joinClassNames(chatMessageClasses.tool, className) : chatMessageClasses.tool,
  )(ownerState);
  const headerProps = mergeSlotPropsWithClassName(
    slotProps?.header,
    chatMessageClasses.toolHeader,
  )(ownerState);
  const titleProps = mergeSlotPropsWithClassName(
    slotProps?.title,
    chatMessageClasses.toolTitle,
  )(ownerState);
  const stateProps = mergeSlotPropsWithClassName(
    slotProps?.state,
    chatMessageClasses.toolState,
  )(ownerState);
  const errorProps = mergeSlotPropsWithClassName(
    slotProps?.error,
    chatMessageClasses.toolError,
  )(ownerState);
  const actionsProps = mergeSlotPropsWithClassName(
    slotProps?.actions,
    chatMessageClasses.toolActions,
  )(ownerState);
  const approveButtonProps = mergeSlotPropsWithClassName(
    slotProps?.approveButton,
    chatMessageClasses.toolApproveButton,
  )(ownerState);
  const denyButtonProps = mergeSlotPropsWithClassName(
    slotProps?.denyButton,
    chatMessageClasses.toolDenyButton,
  )(ownerState);
  const { toolInvocation } = part;
  const toolTitle = toolInvocation.title ?? toolInvocation.toolName;
  const stateLabel = localeText.toolStateLabel(toolInvocation.state);

  const handleApproval = React.useCallback(
    async (approved: boolean) => {
      setPendingApproval(true);
      try {
        await addToolApprovalResponse({
          id: toolInvocation.toolCallId,
          approved,
        });
      } catch {
        // Errors are surfaced through the chat runtime error channel.
      } finally {
        setPendingApproval(false);
      }
    },
    [addToolApprovalResponse, toolInvocation.toolCallId],
  );

  return (
    <Root {...rootProps} elevation={0} ownerState={ownerState} ref={ref} variant="outlined">
      <Header {...headerProps} ownerState={ownerState}>
        <Title {...titleProps} ownerState={ownerState}>
          {toolTitle}
        </Title>
        <State {...stateProps} label={stateLabel} ownerState={ownerState} size="small" />
      </Header>
      {(toolInvocation.state === 'input-streaming' ||
        toolInvocation.state === 'input-available' ||
        toolInvocation.state === 'approval-requested' ||
        toolInvocation.state === 'approval-responded') &&
      toolInvocation.input !== undefined ? (
        <ToolPayloadSection
          label={localeText.messageToolInputLabel}
          ownerState={ownerState}
          section="input"
          slotProps={slotProps}
          slots={slots}
          value={toolInvocation.input}
        />
      ) : null}
      {toolInvocation.state === 'output-available' && toolInvocation.output !== undefined ? (
        <ToolPayloadSection
          label={localeText.messageToolOutputLabel}
          ownerState={ownerState}
          section="output"
          slotProps={slotProps}
          slots={slots}
          value={toolInvocation.output}
        />
      ) : null}
      {toolInvocation.state === 'output-error' && toolInvocation.errorText ? (
        <Error {...errorProps} ownerState={ownerState}>
          {toolInvocation.errorText}
        </Error>
      ) : null}
      {toolInvocation.state === 'output-denied' ? (
        <Error {...errorProps} ownerState={ownerState}>
          {toolInvocation.approval?.reason ?? localeText.toolStateLabel('output-denied')}
        </Error>
      ) : null}
      {toolInvocation.state === 'approval-requested' ? (
        <Actions {...actionsProps} ownerState={ownerState}>
          <ApproveButton
            {...approveButtonProps}
            disabled={pendingApproval}
            onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
              (
                approveButtonProps as {
                  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
                }
              ).onClick?.(event);
              if (!event.defaultPrevented) {
                await handleApproval(true);
              }
            }}
            ownerState={ownerState}
            size="small"
            variant="contained"
          >
            {localeText.messageToolApproveButtonLabel}
          </ApproveButton>
          <DenyButton
            {...denyButtonProps}
            color="inherit"
            disabled={pendingApproval}
            onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
              (
                denyButtonProps as {
                  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
                }
              ).onClick?.(event);
              if (!event.defaultPrevented) {
                await handleApproval(false);
              }
            }}
            ownerState={ownerState}
            size="small"
            variant="outlined"
          >
            {localeText.messageToolDenyButtonLabel}
          </DenyButton>
        </Actions>
      ) : null}
    </Root>
  );
});

export function createChatToolPartRenderer(
  defaultProps: ChatToolPartRendererOptions = {},
): ChatPartRenderer<ToolPart> {
  return createPartRenderer(ChatToolPartRenderer, defaultProps);
}

export interface ChatFilePartRendererOwnerState {
  image: boolean;
  mediaType: string;
  messageId: string;
  role: ChatPartRendererProps<ChatFileMessagePart>['message']['role'];
}

export interface ChatFilePartRendererSlots {
  root: React.ElementType;
  preview: React.ElementType;
  link: React.ElementType;
  filename: React.ElementType;
}

export interface ChatFilePartRendererSlotProps {
  root?: SlotComponentProps<'div', {}, ChatFilePartRendererOwnerState>;
  preview?: SlotComponentProps<'img', {}, ChatFilePartRendererOwnerState>;
  link?: SlotComponentProps<typeof Link, {}, ChatFilePartRendererOwnerState>;
  filename?: SlotComponentProps<'span', {}, ChatFilePartRendererOwnerState>;
}

export interface ChatFilePartRendererProps extends ChatPartRendererProps<ChatFileMessagePart> {
  className?: string;
  slotProps?: ChatFilePartRendererSlotProps;
  slots?: Partial<ChatFilePartRendererSlots>;
  sx?: SxProps<Theme>;
}

export type ChatFilePartRendererOptions = Omit<
  ChatFilePartRendererProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatFileRootSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'File',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  minWidth: 0,
}));

const ChatFilePreviewSlot = styled('img', {
  name: 'MuiChatMessage',
  slot: 'FilePreview',
})(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  display: 'block',
  height: 'auto',
  maxWidth: 'min(100%, 18rem)',
}));

const ChatFileLinkSlot = styled(Link, {
  name: 'MuiChatMessage',
  slot: 'FileLink',
})(({ theme }) => ({
  alignItems: 'center',
  color: 'inherit',
  display: 'inline-flex',
  gap: theme.spacing(1),
  minWidth: 0,
}));

const ChatFileNameSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'FileName',
})(({ theme }) => ({
  ...theme.typography.body2,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const ChatFilePartRenderer = React.forwardRef(function ChatFilePartRenderer(
  props: ChatFilePartRendererProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, message, part, slotProps, slots, sx } = props;
  const ownerState = React.useMemo<ChatFilePartRendererOwnerState>(
    () => ({
      image: part.mediaType.startsWith('image/'),
      mediaType: part.mediaType,
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role, part.mediaType],
  );
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatFileRootSlot, sx),
    [slots?.root, sx],
  );
  const Preview = slots?.preview ?? ChatFilePreviewSlot;
  const LinkSlot = slots?.link ?? ChatFileLinkSlot;
  const Filename = slots?.filename ?? ChatFileNameSlot;
  const rootProps = mergeSlotPropsWithClassName(
    slotProps?.root,
    className ? joinClassNames(chatMessageClasses.file, className) : chatMessageClasses.file,
  )(ownerState);
  const previewProps = mergeSlotPropsWithClassName(
    slotProps?.preview,
    chatMessageClasses.filePreview,
  )(ownerState);
  const linkProps = mergeSlotPropsWithClassName(
    slotProps?.link,
    chatMessageClasses.fileLink,
  )(ownerState);
  const filenameProps = mergeSlotPropsWithClassName(
    slotProps?.filename,
    chatMessageClasses.fileName,
  )(ownerState);

  return (
    <Root {...rootProps} ownerState={ownerState} ref={ref}>
      {ownerState.image ? (
        <LinkSlot
          href={part.url}
          rel="noreferrer noopener"
          target="_blank"
          underline="none"
          ownerState={ownerState}
          {...linkProps}
        >
          <Preview
            {...previewProps}
            alt={part.filename ?? ''}
            ownerState={ownerState}
            src={part.url}
          />
        </LinkSlot>
      ) : (
        <LinkSlot
          href={part.url}
          rel="noreferrer noopener"
          target="_blank"
          underline="hover"
          ownerState={ownerState}
          {...linkProps}
        >
          <FileIcon />
          <Filename {...filenameProps} ownerState={ownerState}>
            {part.filename ?? part.url}
          </Filename>
        </LinkSlot>
      )}
    </Root>
  );
});

export function createChatFilePartRenderer(
  defaultProps: ChatFilePartRendererOptions = {},
): ChatPartRenderer<ChatFileMessagePart> {
  return createPartRenderer(ChatFilePartRenderer, defaultProps);
}

export interface ChatSourceUrlPartRendererOwnerState {
  messageId: string;
  role: ChatPartRendererProps<ChatSourceUrlMessagePart>['message']['role'];
}

export interface ChatSourceUrlPartRendererSlots {
  root: React.ElementType;
  icon: React.ElementType;
  link: React.ElementType;
}

export interface ChatSourceUrlPartRendererSlotProps {
  root?: SlotComponentProps<'div', {}, ChatSourceUrlPartRendererOwnerState>;
  icon?: SlotComponentProps<'span', {}, ChatSourceUrlPartRendererOwnerState>;
  link?: SlotComponentProps<typeof Link, {}, ChatSourceUrlPartRendererOwnerState>;
}

export interface ChatSourceUrlPartRendererProps extends ChatPartRendererProps<ChatSourceUrlMessagePart> {
  className?: string;
  slotProps?: ChatSourceUrlPartRendererSlotProps;
  slots?: Partial<ChatSourceUrlPartRendererSlots>;
  sx?: SxProps<Theme>;
}

export type ChatSourceUrlPartRendererOptions = Omit<
  ChatSourceUrlPartRendererProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatSourceUrlRootSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceUrl',
})(({ theme }) => ({
  alignItems: 'center',
  display: 'inline-flex',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

const ChatSourceUrlIconSlot = styled('span', {
  name: 'MuiChatMessage',
  slot: 'SourceUrlIcon',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'inline-flex',
}));

const ChatSourceUrlLinkSlot = styled(Link, {
  name: 'MuiChatMessage',
  slot: 'SourceUrlLink',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: 'inherit',
}));

export const ChatSourceUrlPartRenderer = React.forwardRef(function ChatSourceUrlPartRenderer(
  props: ChatSourceUrlPartRendererProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { className, message, part, slotProps, slots, sx } = props;
  const ownerState = React.useMemo<ChatSourceUrlPartRendererOwnerState>(
    () => ({
      messageId: message.id,
      role: message.role,
    }),
    [message.id, message.role],
  );
  const Root = React.useMemo(
    () => slots?.root ?? createDefaultSlot(ChatSourceUrlRootSlot, sx),
    [slots?.root, sx],
  );
  const Icon = slots?.icon ?? ChatSourceUrlIconSlot;
  const LinkSlot = slots?.link ?? ChatSourceUrlLinkSlot;
  const rootProps = mergeSlotPropsWithClassName(
    slotProps?.root,
    className
      ? joinClassNames(chatMessageClasses.sourceUrl, className)
      : chatMessageClasses.sourceUrl,
  )(ownerState);
  const iconProps = mergeSlotPropsWithClassName(
    slotProps?.icon,
    chatMessageClasses.sourceUrlIcon,
  )(ownerState);
  const linkProps = mergeSlotPropsWithClassName(
    slotProps?.link,
    chatMessageClasses.sourceUrlLink,
  )(ownerState);

  return (
    <Root {...rootProps} ownerState={ownerState} ref={ref}>
      <Icon {...iconProps} ownerState={ownerState}>
        <ExternalLinkIcon />
      </Icon>
      <LinkSlot
        href={part.url}
        rel="noreferrer noopener"
        target="_blank"
        ownerState={ownerState}
        {...linkProps}
      >
        {part.title ?? part.url}
      </LinkSlot>
    </Root>
  );
});

export function createChatSourceUrlPartRenderer(
  defaultProps: ChatSourceUrlPartRendererOptions = {},
): ChatPartRenderer<ChatSourceUrlMessagePart> {
  return createPartRenderer(ChatSourceUrlPartRenderer, defaultProps);
}

export interface ChatSourceDocumentPartRendererOwnerState {
  messageId: string;
  role: ChatPartRendererProps<ChatSourceDocumentMessagePart>['message']['role'];
}

export interface ChatSourceDocumentPartRendererSlots {
  root: React.ElementType;
  title: React.ElementType;
  excerpt: React.ElementType;
}

export interface ChatSourceDocumentPartRendererSlotProps {
  root?: SlotComponentProps<typeof Paper, {}, ChatSourceDocumentPartRendererOwnerState>;
  title?: SlotComponentProps<'div', {}, ChatSourceDocumentPartRendererOwnerState>;
  excerpt?: SlotComponentProps<'div', {}, ChatSourceDocumentPartRendererOwnerState>;
}

export interface ChatSourceDocumentPartRendererProps extends ChatPartRendererProps<ChatSourceDocumentMessagePart> {
  className?: string;
  slotProps?: ChatSourceDocumentPartRendererSlotProps;
  slots?: Partial<ChatSourceDocumentPartRendererSlots>;
  sx?: SxProps<Theme>;
}

export type ChatSourceDocumentPartRendererOptions = Omit<
  ChatSourceDocumentPartRendererProps,
  'index' | 'message' | 'onToolCall' | 'part'
>;

const ChatSourceDocumentRootSlot = styled(Paper, {
  name: 'MuiChatMessage',
  slot: 'SourceDocument',
})(({ theme }) => ({
  backgroundColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.08 : 0.03),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  display: 'grid',
  gap: theme.spacing(0.5),
  minWidth: 0,
  padding: theme.spacing(1),
}));

const ChatSourceDocumentTitleSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceDocumentTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  minWidth: 0,
}));

const ChatSourceDocumentExcerptSlot = styled('div', {
  name: 'MuiChatMessage',
  slot: 'SourceDocumentExcerpt',
})(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const ChatSourceDocumentPartRenderer = React.forwardRef(
  function ChatSourceDocumentPartRenderer(
    props: ChatSourceDocumentPartRendererProps,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { className, message, part, slotProps, slots, sx } = props;
    const ownerState = React.useMemo<ChatSourceDocumentPartRendererOwnerState>(
      () => ({
        messageId: message.id,
        role: message.role,
      }),
      [message.id, message.role],
    );
    const Root = React.useMemo(
      () => slots?.root ?? createDefaultSlot(ChatSourceDocumentRootSlot, sx),
      [slots?.root, sx],
    );
    const Title = slots?.title ?? ChatSourceDocumentTitleSlot;
    const Excerpt = slots?.excerpt ?? ChatSourceDocumentExcerptSlot;
    const rootProps = mergeSlotPropsWithClassName(
      slotProps?.root,
      className
        ? joinClassNames(chatMessageClasses.sourceDocument, className)
        : chatMessageClasses.sourceDocument,
    )(ownerState);
    const titleProps = mergeSlotPropsWithClassName(
      slotProps?.title,
      chatMessageClasses.sourceDocumentTitle,
    )(ownerState);
    const excerptProps = mergeSlotPropsWithClassName(
      slotProps?.excerpt,
      chatMessageClasses.sourceDocumentExcerpt,
    )(ownerState);

    return (
      <Root {...rootProps} elevation={0} ownerState={ownerState} ref={ref} variant="outlined">
        {part.title ? (
          <Title {...titleProps} ownerState={ownerState}>
            {part.title}
          </Title>
        ) : null}
        {part.text ? (
          <Excerpt {...excerptProps} ownerState={ownerState}>
            {part.text}
          </Excerpt>
        ) : null}
      </Root>
    );
  },
);

export function createChatSourceDocumentPartRenderer(
  defaultProps: ChatSourceDocumentPartRendererOptions = {},
): ChatPartRenderer<ChatSourceDocumentMessagePart> {
  return createPartRenderer(ChatSourceDocumentPartRenderer, defaultProps);
}
