import { demoUsers } from './shared/demoData';

export const demoConversations = [
  { id: 'c1', title: 'Product design', subtitle: 'Roadmap sync', unreadCount: 2 },
  { id: 'c2', title: 'Support inbox', subtitle: 'Escalations' },
];

export const demoMessages = [
  {
    id: 'm1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:00:00.000Z',
    parts: [
      {
        type: 'text',
        text: 'Morning. I summarized the latest design feedback in the thread.',
      },
    ],
  },
  {
    id: 'm2',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-17T09:03:00.000Z',
    parts: [
      {
        type: 'text',
        text: 'Great. Pull out the three biggest blockers for launch.',
      },
    ],
  },
  {
    id: 'm3',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:04:30.000Z',
    parts: [
      {
        type: 'text',
        text: 'The biggest blockers are API latency, localization QA, and approval UX for tool calls.',
      },
    ],
  },
];

export function createClosedStream() {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

export function createTextResponseStream(text) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue({
        type: 'text-delta',
        id: 'assistant-text',
        delta: text,
      });
      controller.close();
    },
  });
}

export const basicAdapter = {
  async sendMessage() {
    return createClosedStream();
  },
};
