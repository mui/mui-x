import type {
  ChatAdapter,
  ChatDraftAttachment,
  ChatMessage,
  ChatMessageChunk,
  ChatMessagePart,
  ChatToolInvocationState,
} from '@mui/x-chat/headless';
import type {
  CreateScenarioMessageInput,
  ScenarioAdapterOptions,
  ScenarioAttachmentSpec,
  ScenarioDataPart,
  ScenarioDocumentReference,
  ScenarioFileReference,
  ScenarioFixture,
  ScenarioReply,
  ScenarioReplyResolver,
  ScenarioReplyResolverInput,
  ScenarioSource,
  ScenarioStreamOptions,
  ScenarioToolStep,
  ScenarioWorkbenchSeed,
} from './types';

const DEFAULT_CHUNK_SIZE = 24;
const DEFAULT_LATENCY_MS = 55;

export function createScenarioMessage({
  text,
  parts,
  status = 'read',
  ...message
}: CreateScenarioMessageInput): ChatMessage {
  return {
    ...message,
    status,
    parts: parts ?? [{ type: 'text', text: text ?? '' }],
  };
}

export function createSourceUrlPart(source: ScenarioSource): ChatMessagePart {
  return {
    type: 'source-url',
    sourceId: source.id,
    url: source.url,
    title: source.title,
  };
}

export function createSourceDocumentPart(document: ScenarioDocumentReference): ChatMessagePart {
  return {
    type: 'source-document',
    sourceId: document.id,
    title: document.title,
    text: document.text,
  };
}

export function createFilePart(file: ScenarioFileReference): ChatMessagePart {
  return {
    type: 'file',
    mediaType: file.mediaType,
    url: file.url,
    filename: file.filename,
  };
}

export function createDataPart(part: ScenarioDataPart): ChatMessagePart {
  return {
    type: part.type,
    id: part.id,
    data: part.data,
    transient: part.transient,
  } as ChatMessagePart;
}

function resolveToolState(step: ScenarioToolStep): ChatToolInvocationState {
  if (step.state) {
    return step.state;
  }
  if (step.errorText) {
    return 'output-error';
  }
  if (step.approval?.approved === false) {
    return 'output-denied';
  }
  if (step.output !== undefined) {
    return 'output-available';
  }
  if (step.approval) {
    return 'approval-responded';
  }
  return 'input-available';
}

export function createToolPart(step: ScenarioToolStep): ChatMessagePart {
  return {
    type: 'dynamic-tool',
    toolInvocation: {
      toolCallId: step.toolCallId,
      toolName: step.toolName,
      state: resolveToolState(step),
      input: step.input,
      output: step.output,
      errorText: step.errorText,
      approval: step.approval,
      title: step.title,
      preliminary: step.preliminary,
    },
  };
}

export function cloneScenarioData<T>(value: T): T {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  if (typeof globalThis.structuredClone === 'function') {
    try {
      return globalThis.structuredClone(value);
    } catch {
      // Fall back to JSON for plain fixture objects.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export function cloneScenarioFixture(scenario: ScenarioFixture): ScenarioFixture {
  return {
    ...scenario,
    currentUser: cloneScenarioData(scenario.currentUser),
    assistant: cloneScenarioData(scenario.assistant),
    members: cloneScenarioData(scenario.members),
    conversations: cloneScenarioData(scenario.conversations),
    messages: cloneScenarioData(scenario.messages),
    suggestions: cloneScenarioData(scenario.suggestions),
    composer: cloneScenarioData(scenario.composer),
    insights: cloneScenarioData(scenario.insights),
    sources: cloneScenarioData(scenario.sources),
    documents: cloneScenarioData(scenario.documents),
  };
}

export function getScenarioMessages(
  scenario: ScenarioFixture,
  conversationId = scenario.activeConversationId,
): ChatMessage[] {
  return cloneScenarioData(
    scenario.messages.filter((message) => message.conversationId === conversationId),
  );
}

export function createScenarioThreadMap(scenario: ScenarioFixture): Record<string, ChatMessage[]> {
  return scenario.messages.reduce<Record<string, ChatMessage[]>>((threadMap, message) => {
    const conversationId = message.conversationId ?? scenario.activeConversationId;
    threadMap[conversationId] ??= [];
    threadMap[conversationId].push(cloneScenarioData(message));
    return threadMap;
  }, {});
}

export function getScenarioSuggestionPrompts(scenario: ScenarioFixture): string[] {
  return scenario.suggestions.map((suggestion) => suggestion.prompt);
}

export function extractMessageText(message: ChatMessage): string {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join(' ')
    .trim();
}

export function createScenarioId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function splitScenarioText(text: string, size = DEFAULT_CHUNK_SIZE): string[] {
  const safeSize = Math.max(1, size);
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += safeSize) {
    chunks.push(text.slice(index, index + safeSize));
  }
  return chunks;
}

function pushTextChunks(
  chunks: ChatMessageChunk[],
  type: 'text' | 'reasoning',
  id: string,
  text: string,
  chunkSize: number,
) {
  chunks.push({ type: `${type}-start`, id } as ChatMessageChunk);
  splitScenarioText(text, chunkSize).forEach((delta) => {
    chunks.push({ type: `${type}-delta`, id, delta } as ChatMessageChunk);
  });
  chunks.push({ type: `${type}-end`, id } as ChatMessageChunk);
}

export function createScenarioChunks(
  messageId: string,
  reply: ScenarioReply,
  options: ScenarioStreamOptions = {},
): ChatMessageChunk[] {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const chunks: ChatMessageChunk[] = [{ type: 'start', messageId, author: reply.author }];

  if (reply.reasoning) {
    pushTextChunks(chunks, 'reasoning', `${messageId}-reasoning`, reply.reasoning, chunkSize);
  }

  reply.tools?.forEach((tool) => {
    const state = resolveToolState(tool);
    if (state === 'approval-requested') {
      chunks.push({
        type: 'tool-approval-request',
        toolCallId: tool.toolCallId,
        toolName: tool.toolName,
        input: tool.input ?? {},
      });
      return;
    }

    chunks.push({
      type: 'tool-input-available',
      toolCallId: tool.toolCallId,
      toolName: tool.toolName,
      input: tool.input ?? {},
    });

    if (tool.output !== undefined) {
      chunks.push({
        type: 'tool-output-available',
        toolCallId: tool.toolCallId,
        output: tool.output,
        preliminary: tool.preliminary,
      });
    }

    if (tool.errorText) {
      chunks.push({
        type: 'tool-output-error',
        toolCallId: tool.toolCallId,
        errorText: tool.errorText,
      });
    }

    if (state === 'output-denied') {
      chunks.push({
        type: 'tool-output-denied',
        toolCallId: tool.toolCallId,
        reason: tool.approval?.reason,
      });
    }
  });

  pushTextChunks(chunks, 'text', `${messageId}-text`, reply.text, chunkSize);

  reply.sources?.forEach((source) => {
    chunks.push({
      type: 'source-url',
      sourceId: source.id,
      url: source.url,
      title: source.title,
    });
  });

  reply.documents?.forEach((document) => {
    chunks.push({
      type: 'source-document',
      sourceId: document.id,
      title: document.title,
      text: document.text,
    });
  });

  reply.files?.forEach((file) => {
    chunks.push({
      type: 'file',
      id: file.id,
      mediaType: file.mediaType,
      url: file.url,
      filename: file.filename,
    });
  });

  reply.dataParts?.forEach((part) => {
    chunks.push({
      type: part.type,
      id: part.id,
      data: part.data,
      transient: part.transient,
    } as ChatMessageChunk);
  });

  chunks.push({ type: 'finish', messageId, finishReason: reply.finishReason ?? 'stop' });
  return chunks;
}

export function createScenarioStream(
  messageId: string,
  reply: ScenarioReply,
  options: ScenarioStreamOptions = {},
): ReadableStream<ChatMessageChunk> {
  const chunks = createScenarioChunks(messageId, reply, options);
  const latencyMs = options.latencyMs ?? DEFAULT_LATENCY_MS;
  let cancelled = false;
  const timers: Array<ReturnType<typeof setTimeout>> = [];

  return new ReadableStream<ChatMessageChunk>({
    start(controller) {
      chunks.forEach((chunk, index) => {
        const timer = setTimeout(
          () => {
            if (cancelled) {
              return;
            }
            try {
              controller.enqueue(chunk);
              if (index === chunks.length - 1) {
                controller.close();
              }
            } catch {
              cancelled = true;
            }
          },
          latencyMs * (index + 1),
        );
        timers.push(timer);
      });
    },
    cancel() {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
    },
  });
}

function createDefaultScenarioReply(scenario: ScenarioFixture, prompt: string): ScenarioReply {
  return {
    author: scenario.assistant,
    text:
      prompt.length === 0
        ? `Try one of the ${scenario.shortTitle} suggestions to preview this scenario.`
        : `In the ${scenario.shortTitle} scenario, I would handle "${prompt}" with the same chat defaults, citations, and message states shown in the seeded thread.`,
  };
}

function resolveScenarioReply(
  scenario: ScenarioFixture,
  reply: ScenarioReply | ScenarioReplyResolver | undefined,
  input: Omit<ScenarioReplyResolverInput, 'scenario'>,
): ScenarioReply {
  if (typeof reply === 'function') {
    return reply({ scenario, ...input });
  }
  return reply ?? createDefaultScenarioReply(scenario, input.prompt);
}

export function createScenarioAdapter(
  scenario: ScenarioFixture,
  options: ScenarioAdapterOptions = {},
): ChatAdapter {
  return {
    async listConversations(input) {
      const query = input?.query?.trim().toLowerCase();
      const conversations = query
        ? scenario.conversations.filter((conversation) =>
            [conversation.title, conversation.subtitle, ...scenario.tags]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(query)),
          )
        : scenario.conversations;

      return {
        conversations: cloneScenarioData(conversations),
        hasMore: false,
      };
    },
    async listMessages({ conversationId }) {
      return {
        messages: getScenarioMessages(scenario, conversationId),
        hasMore: false,
      };
    },
    async sendMessage({ conversationId, message, messages, attachments }) {
      const prompt = extractMessageText(message);
      const reply = resolveScenarioReply(scenario, options.reply ?? scenario.reply, {
        prompt,
        conversationId,
        message,
        messages,
        attachments,
      });

      return createScenarioStream(createScenarioId('scenario-reply'), reply, options);
    },
    async markRead() {
      // No-op: this scenario adapter does not track read state.
    },
    async setTyping() {
      // No-op: this scenario adapter does not broadcast typing state.
    },
  };
}

export function createScenarioWorkbenchSeed(
  scenario: ScenarioFixture,
  options: ScenarioAdapterOptions = {},
): ScenarioWorkbenchSeed {
  const fixture = cloneScenarioFixture(scenario);
  return {
    scenarioId: fixture.id,
    adapter: createScenarioAdapter(scenario, options),
    currentUser: fixture.currentUser,
    members: fixture.members,
    conversations: fixture.conversations,
    activeConversationId: fixture.activeConversationId,
    messages: getScenarioMessages(fixture),
    suggestions: getScenarioSuggestionPrompts(fixture),
    composer: fixture.composer,
    variant: fixture.variant ?? 'default',
    density: fixture.density ?? 'standard',
    layoutMode: fixture.layoutMode,
  };
}

export function createScenarioDraftAttachments(
  files: ScenarioAttachmentSpec[],
): ChatDraftAttachment[] {
  return files.map((spec, index) => {
    const file = new File(['placeholder'], spec.name, { type: spec.type });
    try {
      Object.defineProperty(file, 'size', { value: spec.size });
    } catch {
      // File.size is read-only in some environments. The fixture remains usable.
    }

    return {
      localId: `scenario-attachment-${index}-${spec.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      file,
      previewUrl: spec.previewUrl,
      status: spec.status ?? 'uploaded',
      progress: spec.progress ?? (spec.status === 'uploading' ? 0.5 : 1),
    };
  });
}
