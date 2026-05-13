import type { ChatDataPartMap, ChatMessageMetadata } from './chat-type-registry';
import type {
  ChatKnownDataPartType,
  ChatRegisteredDataPartType,
  ChatRegisteredToolName,
  ChatToolInput,
  ChatToolOutput,
} from './chat-type-helpers';

export interface ChatStartMessageChunk {
  type: 'start';
  messageId: string;
  author?: import('./chat-entities').ChatUser;
}

export interface ChatFinishMessageChunk {
  type: 'finish';
  messageId: string;
  finishReason?: string;
}

export interface ChatAbortMessageChunk {
  type: 'abort';
  messageId: string;
}

export interface ChatTextStartChunk {
  type: 'text-start';
  id: string;
}

export interface ChatTextDeltaChunk {
  type: 'text-delta';
  id: string;
  delta: string;
}

export interface ChatTextEndChunk {
  type: 'text-end';
  id: string;
}

export interface ChatReasoningStartChunk {
  type: 'reasoning-start';
  id: string;
}

export interface ChatReasoningDeltaChunk {
  type: 'reasoning-delta';
  id: string;
  delta: string;
}

export interface ChatReasoningEndChunk {
  type: 'reasoning-end';
  id: string;
}

interface ChatFallbackToolInputStartChunk<TToolName extends string = string> {
  type: 'tool-input-start';
  toolCallId: string;
  toolName: TToolName;
  dynamic?: boolean;
}

interface ChatRegisteredToolInputStartChunk<
  TToolName extends ChatRegisteredToolName = ChatRegisteredToolName,
> {
  type: 'tool-input-start';
  toolCallId: string;
  toolName: TToolName;
  dynamic?: false;
}

interface ChatDynamicToolInputStartChunk<TToolName extends string = string> {
  type: 'tool-input-start';
  toolCallId: string;
  toolName: TToolName;
  dynamic: true;
}

type ChatAnyRegisteredToolInputStartChunk = {
  [TToolName in ChatRegisteredToolName]: ChatRegisteredToolInputStartChunk<TToolName>;
}[ChatRegisteredToolName];

export type ChatToolInputStartChunk<TToolName extends string = string> = [
  ChatRegisteredToolName,
] extends [never]
  ? ChatFallbackToolInputStartChunk<TToolName>
  :
      | ChatAnyRegisteredToolInputStartChunk
      | ChatDynamicToolInputStartChunk<Exclude<TToolName, ChatRegisteredToolName>>;

export interface ChatToolInputDeltaChunk {
  type: 'tool-input-delta';
  toolCallId: string;
  inputTextDelta: string;
}

interface ChatFallbackToolInputAvailableChunk<TToolName extends string = string> {
  type: 'tool-input-available';
  toolCallId: string;
  toolName: TToolName;
  input: ChatToolInput<TToolName>;
}

interface ChatRegisteredToolInputAvailableChunk<
  TToolName extends ChatRegisteredToolName = ChatRegisteredToolName,
> {
  type: 'tool-input-available';
  toolCallId: string;
  toolName: TToolName;
  input: ChatToolInput<TToolName>;
}

interface ChatDynamicToolInputAvailableChunk<TToolName extends string = string> {
  type: 'tool-input-available';
  toolCallId: string;
  toolName: TToolName;
  input: unknown;
  dynamic: true;
}

type ChatAnyRegisteredToolInputAvailableChunk = {
  [TToolName in ChatRegisteredToolName]: ChatRegisteredToolInputAvailableChunk<TToolName>;
}[ChatRegisteredToolName];

export type ChatToolInputAvailableChunk<TToolName extends string = string> = [
  ChatRegisteredToolName,
] extends [never]
  ? ChatFallbackToolInputAvailableChunk<TToolName>
  :
      | ChatAnyRegisteredToolInputAvailableChunk
      | ChatDynamicToolInputAvailableChunk<Exclude<TToolName, ChatRegisteredToolName>>;

export interface ChatToolInputErrorChunk {
  type: 'tool-input-error';
  toolCallId: string;
  errorText: string;
}

interface ChatFallbackToolApprovalRequestChunk<TToolName extends string = string> {
  type: 'tool-approval-request';
  approvalId?: string;
  toolCallId: string;
  toolName: TToolName;
  input: ChatToolInput<TToolName>;
}

interface ChatRegisteredToolApprovalRequestChunk<
  TToolName extends ChatRegisteredToolName = ChatRegisteredToolName,
> {
  type: 'tool-approval-request';
  approvalId?: string;
  toolCallId: string;
  toolName: TToolName;
  input: ChatToolInput<TToolName>;
}

interface ChatDynamicToolApprovalRequestChunk<TToolName extends string = string> {
  type: 'tool-approval-request';
  approvalId?: string;
  toolCallId: string;
  toolName: TToolName;
  input: unknown;
  dynamic: true;
}

type ChatAnyRegisteredToolApprovalRequestChunk = {
  [TToolName in ChatRegisteredToolName]: ChatRegisteredToolApprovalRequestChunk<TToolName>;
}[ChatRegisteredToolName];

export type ChatToolApprovalRequestChunk<TToolName extends string = string> = [
  ChatRegisteredToolName,
] extends [never]
  ? ChatFallbackToolApprovalRequestChunk<TToolName>
  :
      | ChatAnyRegisteredToolApprovalRequestChunk
      | ChatDynamicToolApprovalRequestChunk<Exclude<TToolName, ChatRegisteredToolName>>;

export interface ChatToolOutputAvailableChunk<TToolName extends string = string> {
  type: 'tool-output-available';
  toolCallId: string;
  output: ChatToolOutput<TToolName>;
  preliminary?: boolean;
}

export interface ChatToolOutputErrorChunk {
  type: 'tool-output-error';
  toolCallId: string;
  errorText: string;
}

export interface ChatToolOutputDeniedChunk {
  type: 'tool-output-denied';
  toolCallId: string;
  reason?: string;
}

export interface ChatSourceUrlChunk {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
}

export interface ChatSourceDocumentChunk {
  type: 'source-document';
  sourceId: string;
  title?: string;
  text?: string;
}

export interface ChatFileChunk {
  type: 'file';
  id?: string;
  mediaType: string;
  url: string;
  filename?: string;
}

export interface ChatFallbackDataChunk<
  TType extends ChatKnownDataPartType = ChatKnownDataPartType,
> {
  type: TType;
  id?: string;
  data: [ChatRegisteredDataPartType] extends [never]
    ? unknown
    : TType extends keyof ChatDataPartMap
      ? ChatDataPartMap[TType]
      : never;
  transient?: boolean;
}

type ChatRegisteredDataChunk = {
  [TType in ChatRegisteredDataPartType]: {
    type: TType;
    id?: string;
    data: ChatDataPartMap[TType];
    transient?: boolean;
  };
}[ChatRegisteredDataPartType];

export type ChatDataChunk = [ChatRegisteredDataPartType] extends [never]
  ? ChatFallbackDataChunk
  : ChatRegisteredDataChunk;

export interface ChatStartStepChunk {
  type: 'start-step';
}

export interface ChatFinishStepChunk {
  type: 'finish-step';
}

export interface ChatMessageMetadataChunk {
  type: 'message-metadata';
  metadata: Partial<ChatMessageMetadata>;
}

export type ChatMessageChunk =
  | ChatStartMessageChunk
  | ChatFinishMessageChunk
  | ChatAbortMessageChunk
  | ChatTextStartChunk
  | ChatTextDeltaChunk
  | ChatTextEndChunk
  | ChatReasoningStartChunk
  | ChatReasoningDeltaChunk
  | ChatReasoningEndChunk
  | ChatToolInputStartChunk
  | ChatToolInputDeltaChunk
  | ChatToolInputAvailableChunk
  | ChatToolInputErrorChunk
  | ChatToolApprovalRequestChunk
  | ChatToolOutputAvailableChunk
  | ChatToolOutputErrorChunk
  | ChatToolOutputDeniedChunk
  | ChatSourceUrlChunk
  | ChatSourceDocumentChunk
  | ChatFileChunk
  | ChatDataChunk
  | ChatStartStepChunk
  | ChatFinishStepChunk
  | ChatMessageMetadataChunk;

export interface ChatStreamEnvelope {
  eventId?: string;
  sequence?: number;
  chunk: ChatMessageChunk;
}
