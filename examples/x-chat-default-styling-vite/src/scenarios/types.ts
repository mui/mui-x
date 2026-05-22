import type {
  ChatAdapter,
  ChatConversation,
  ChatDensity,
  ChatDraftAttachment,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
  ChatToolApproval,
  ChatToolInvocationState,
  ChatUser,
  ChatVariant,
} from '@mui/x-chat/headless';

export const SCENARIO_IDS = [
  'ai-assistant',
  'team-inbox',
  'support-widget',
  'agentic-rag',
] as const;

export type ScenarioId = (typeof SCENARIO_IDS)[number];

export type ScenarioCategory = 'assistant' | 'inbox' | 'support' | 'rag';

export type ScenarioTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ScenarioLayoutMode = 'standard' | 'split' | 'overlay';

export interface ScenarioInsight {
  id: string;
  label: string;
  value: string;
  tone?: ScenarioTone;
}

export interface ScenarioPromptSuggestion {
  id: string;
  label: string;
  prompt: string;
}

export interface ScenarioAttachmentSpec {
  name: string;
  type: string;
  size: number;
  status?: ChatDraftAttachment['status'];
  progress?: number;
  previewUrl?: string;
}

export interface ScenarioComposerSeed {
  placeholder: string;
  helperText?: string;
  value?: string;
  attachments?: ScenarioAttachmentSpec[];
  disabled?: boolean;
}

export interface ScenarioSource {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  kind?: 'documentation' | 'ticket' | 'knowledge-base' | 'dataset' | 'web' | 'internal';
}

export interface ScenarioDocumentReference {
  id: string;
  title: string;
  text: string;
  kind?: 'note' | 'policy' | 'runbook' | 'transcript' | 'report';
}

export interface ScenarioFileReference {
  id?: string;
  url: string;
  mediaType: string;
  filename?: string;
}

export interface ScenarioDataPart {
  type: `data-${string}`;
  id?: string;
  data: unknown;
  transient?: boolean;
}

export interface ScenarioToolStep {
  toolCallId: string;
  toolName: string;
  title?: string;
  state?: ChatToolInvocationState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: ChatToolApproval;
  preliminary?: boolean;
}

export interface ScenarioReply {
  author?: ChatUser;
  text: string;
  reasoning?: string;
  tools?: ScenarioToolStep[];
  sources?: ScenarioSource[];
  documents?: ScenarioDocumentReference[];
  files?: ScenarioFileReference[];
  dataParts?: ScenarioDataPart[];
  finishReason?: string;
}

export interface ScenarioReplyResolverInput {
  scenario: ScenarioFixture;
  prompt: string;
  conversationId?: string;
  message: ChatMessage;
  messages: ChatMessage[];
  attachments?: ChatDraftAttachment[];
}

export type ScenarioReplyResolver = (input: ScenarioReplyResolverInput) => ScenarioReply;

export interface ScenarioFixture {
  id: ScenarioId;
  title: string;
  shortTitle: string;
  description: string;
  category: ScenarioCategory;
  tags: string[];
  currentUser: ChatUser;
  assistant: ChatUser;
  members: ChatUser[];
  conversations: ChatConversation[];
  activeConversationId: string;
  messages: ChatMessage[];
  suggestions: ScenarioPromptSuggestion[];
  composer: ScenarioComposerSeed;
  variant?: ChatVariant;
  density?: ChatDensity;
  layoutMode?: ScenarioLayoutMode;
  insights?: ScenarioInsight[];
  sources?: ScenarioSource[];
  documents?: ScenarioDocumentReference[];
  reply?: ScenarioReply | ScenarioReplyResolver;
}

export interface CreateScenarioMessageInput {
  id: string;
  conversationId: string;
  role: ChatMessage['role'];
  author: ChatUser;
  createdAt: string;
  text?: string;
  parts?: ChatMessagePart[];
  status?: ChatMessage['status'];
  metadata?: ChatMessage['metadata'];
}

export interface ScenarioAdapterOptions {
  latencyMs?: number;
  chunkSize?: number;
  reply?: ScenarioReply | ScenarioReplyResolver;
}

export interface ScenarioStreamOptions {
  latencyMs?: number;
  chunkSize?: number;
}

export interface ScenarioWorkbenchSeed {
  scenarioId: ScenarioId;
  adapter: ChatAdapter;
  currentUser: ChatUser;
  members: ChatUser[];
  conversations: ChatConversation[];
  activeConversationId: string;
  messages: ChatMessage[];
  suggestions: string[];
  composer: ScenarioComposerSeed;
  variant: ChatVariant;
  density: ChatDensity;
  layoutMode?: ScenarioLayoutMode;
}

export interface ScenarioStreamEnvelope {
  messageId: string;
  chunks: ChatMessageChunk[];
}
