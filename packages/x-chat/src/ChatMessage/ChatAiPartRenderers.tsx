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
  ChatPartRenderer,
  ChatPartRendererProps,
  ChatReasoningMessagePart,
  ChatSourceDocumentMessagePart,
  ChatSourceUrlMessagePart,
  ChatToolMessagePart,
} from '@mui/x-chat-headless';
import {
  ReasoningPart,
  type ReasoningPartExternalProps,
  ToolPart,
  type ToolPartExternalProps,
  FilePart,
  type FilePartExternalProps,
  SourceUrlPart,
  type SourceUrlPartExternalProps,
  SourceDocumentPart,
  type SourceDocumentPartExternalProps,
} from '@mui/x-chat-unstyled';
import { styled } from '../internals/material/chatStyled';
import { chatMessageClasses } from './chatMessageClasses';

// ---------------------------------------------------------------------------
// Shared utilities
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Reasoning – styled slots
// ---------------------------------------------------------------------------

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
  const { slots, slotProps, className, ...other } = props;

  return (
    <ReasoningPart
      ref={ref}
      className={
        className ? `${chatMessageClasses.reasoning} ${className}` : chatMessageClasses.reasoning
      }
      slots={{
        root: ChatReasoningRootSlot,
        summary: ChatReasoningSummarySlot,
        content: ChatReasoningContentSlot,
        ...slots,
      }}
      slotProps={slotProps as ReasoningPartExternalProps['slotProps']}
      {...other}
    />
  );
});

export function createChatReasoningPartRenderer(
  defaultProps: ChatReasoningPartRendererOptions = {},
): ChatPartRenderer<ChatReasoningMessagePart> {
  return function StyledReasoningPartRenderer(props) {
    return <ChatReasoningPartRenderer {...defaultProps} {...props} />;
  };
}

// ---------------------------------------------------------------------------
// Tool – styled slots
// ---------------------------------------------------------------------------

type ToolPartType = ChatToolMessagePart | ChatDynamicToolMessagePart;

export interface ChatToolPartRendererOwnerState {
  messageId: string;
  pendingApproval: boolean;
  role: ChatPartRendererProps<ToolPartType>['message']['role'];
  state: ToolPartType['toolInvocation']['state'];
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

export interface ChatToolPartRendererProps extends ChatPartRendererProps<ToolPartType> {
  className?: string;
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

export const ChatToolPartRenderer = React.forwardRef(function ChatToolPartRenderer(
  props: ChatToolPartRendererProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, className, ...other } = props;

  return (
    <ToolPart
      ref={ref}
      className={className ? `${chatMessageClasses.tool} ${className}` : chatMessageClasses.tool}
      slots={{
        root: ChatToolRootSlot,
        header: ChatToolHeaderSlot,
        title: ChatToolTitleSlot,
        state: ChatToolStateSlot,
        section: ChatToolSectionSlot,
        sectionContent: ChatToolSectionContentSlot,
        error: ChatToolErrorSlot,
        actions: ChatToolActionsSlot,
        approveButton: ChatToolApproveButtonSlot,
        denyButton: ChatToolDenyButtonSlot,
        ...slots,
      }}
      slotProps={slotProps as ToolPartExternalProps['slotProps']}
      {...other}
    />
  );
});

export function createChatToolPartRenderer(
  defaultProps: ChatToolPartRendererOptions = {},
): ChatPartRenderer<ToolPartType> {
  return function StyledToolPartRenderer(props) {
    return <ChatToolPartRenderer {...defaultProps} {...props} />;
  };
}

// ---------------------------------------------------------------------------
// File – styled slots
// ---------------------------------------------------------------------------

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
  const { slots, slotProps, className, ...other } = props;

  return (
    <FilePart
      ref={ref}
      className={className ? `${chatMessageClasses.file} ${className}` : chatMessageClasses.file}
      slots={{
        root: ChatFileRootSlot,
        preview: ChatFilePreviewSlot,
        link: ChatFileLinkSlot,
        filename: ChatFileNameSlot,
        ...slots,
      }}
      slotProps={slotProps as FilePartExternalProps['slotProps']}
      {...other}
    />
  );
});

export function createChatFilePartRenderer(
  defaultProps: ChatFilePartRendererOptions = {},
): ChatPartRenderer<ChatFileMessagePart> {
  return function StyledFilePartRenderer(props) {
    return <ChatFilePartRenderer {...defaultProps} {...props} />;
  };
}

// ---------------------------------------------------------------------------
// Source URL – styled slots
// ---------------------------------------------------------------------------

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
  const { slots, slotProps, className, ...other } = props;

  return (
    <SourceUrlPart
      ref={ref as React.Ref<HTMLSpanElement>}
      className={
        className ? `${chatMessageClasses.sourceUrl} ${className}` : chatMessageClasses.sourceUrl
      }
      slots={{
        root: ChatSourceUrlRootSlot,
        icon: ChatSourceUrlIconSlot,
        link: ChatSourceUrlLinkSlot,
        ...slots,
      }}
      slotProps={slotProps as SourceUrlPartExternalProps['slotProps']}
      {...other}
    />
  );
});

export function createChatSourceUrlPartRenderer(
  defaultProps: ChatSourceUrlPartRendererOptions = {},
): ChatPartRenderer<ChatSourceUrlMessagePart> {
  return function StyledSourceUrlPartRenderer(props) {
    return <ChatSourceUrlPartRenderer {...defaultProps} {...props} />;
  };
}

// ---------------------------------------------------------------------------
// Source Document – styled slots
// ---------------------------------------------------------------------------

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
    const { slots, slotProps, className, ...other } = props;

    return (
      <SourceDocumentPart
        ref={ref}
        className={
          className
            ? `${chatMessageClasses.sourceDocument} ${className}`
            : chatMessageClasses.sourceDocument
        }
        slots={{
          root: ChatSourceDocumentRootSlot,
          title: ChatSourceDocumentTitleSlot,
          excerpt: ChatSourceDocumentExcerptSlot,
          ...slots,
        }}
        slotProps={slotProps as SourceDocumentPartExternalProps['slotProps']}
        {...other}
      />
    );
  },
);

export function createChatSourceDocumentPartRenderer(
  defaultProps: ChatSourceDocumentPartRendererOptions = {},
): ChatPartRenderer<ChatSourceDocumentMessagePart> {
  return function StyledSourceDocumentPartRenderer(props) {
    return <ChatSourceDocumentPartRenderer {...defaultProps} {...props} />;
  };
}

// ---------------------------------------------------------------------------
// Slot groups – used by ChatMessageContent to pass styled slots via partProps
// ---------------------------------------------------------------------------

export const chatReasoningPartSlots = {
  root: ChatReasoningRootSlot,
  summary: ChatReasoningSummarySlot,
  content: ChatReasoningContentSlot,
};

export const chatToolPartSlots = {
  root: ChatToolRootSlot,
  header: ChatToolHeaderSlot,
  title: ChatToolTitleSlot,
  state: ChatToolStateSlot,
  section: ChatToolSectionSlot,
  sectionContent: ChatToolSectionContentSlot,
  error: ChatToolErrorSlot,
  actions: ChatToolActionsSlot,
  approveButton: ChatToolApproveButtonSlot,
  denyButton: ChatToolDenyButtonSlot,
};

export const chatFilePartSlots = {
  root: ChatFileRootSlot,
  preview: ChatFilePreviewSlot,
  link: ChatFileLinkSlot,
  filename: ChatFileNameSlot,
};

export const chatSourceUrlPartSlots = {
  root: ChatSourceUrlRootSlot,
  icon: ChatSourceUrlIconSlot,
  link: ChatSourceUrlLinkSlot,
};

export const chatSourceDocumentPartSlots = {
  root: ChatSourceDocumentRootSlot,
  title: ChatSourceDocumentTitleSlot,
  excerpt: ChatSourceDocumentExcerptSlot,
};
