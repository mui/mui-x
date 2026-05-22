import { users } from '../data';
import { createScenarioMessage, createSourceDocumentPart, createToolPart } from './helpers';
import type { ScenarioFixture } from './types';

const launchConversationId = 'assistant-launch-plan';
const syncConversationId = 'assistant-weekly-sync';

export const aiAssistantScenario: ScenarioFixture = {
  id: 'ai-assistant',
  title: 'AI assistant',
  shortTitle: 'Assistant',
  description:
    'A personal assistant that turns loose product notes into launch plans, summaries, and next actions.',
  category: 'assistant',
  tags: ['assistant', 'planning', 'productivity', 'drafting'],
  currentUser: users.me,
  assistant: users.assistant,
  members: [users.me, users.assistant],
  variant: 'default',
  density: 'standard',
  layoutMode: 'split',
  activeConversationId: launchConversationId,
  conversations: [
    {
      id: launchConversationId,
      title: 'Launch planning copilot',
      subtitle: 'Survey notes, exec summary, owners',
      participants: [users.me, users.assistant],
      readState: 'unread',
      unreadCount: 1,
      lastMessageAt: '2026-05-05T16:42:00.000Z',
    },
    {
      id: syncConversationId,
      title: 'Weekly sync brief',
      subtitle: 'Open decisions for Monday',
      participants: [users.me, users.assistant],
      readState: 'read',
      unreadCount: 0,
      lastMessageAt: '2026-05-04T10:18:00.000Z',
    },
  ],
  messages: [
    createScenarioMessage({
      id: 'assistant-launch-1',
      conversationId: launchConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-05T16:30:00.000Z',
      text: 'Turn the onboarding survey notes into a launch plan for the new admin dashboard.',
    }),
    createScenarioMessage({
      id: 'assistant-launch-2',
      conversationId: launchConversationId,
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-05T16:31:00.000Z',
      parts: [
        {
          type: 'text',
          text: `Here is a launch plan that keeps the work concrete:

1. **Positioning** - lead with faster setup for workspace admins.
2. **Enablement** - publish a two-minute walkthrough and a migration checklist.
3. **Rollout** - ship to beta workspaces first, then expand after activation passes 68%.
4. **Measurement** - track first-run completion, invite rate, and support contacts per account.`,
        },
        createSourceDocumentPart({
          id: 'assistant-survey-themes',
          title: 'Survey theme extract',
          text: 'Admins asked for clearer invite status, fewer setup choices, and a way to preview permission changes before saving.',
          kind: 'note',
        }),
      ],
    }),
    createScenarioMessage({
      id: 'assistant-launch-3',
      conversationId: launchConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-05T16:35:00.000Z',
      text: 'Can you check whether design review and docs review are already on the calendar?',
    }),
    createScenarioMessage({
      id: 'assistant-launch-4',
      conversationId: launchConversationId,
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-05T16:36:00.000Z',
      parts: [
        createToolPart({
          toolCallId: 'assistant-calendar-1',
          toolName: 'calendar.search',
          title: 'Search calendar',
          input: {
            query: 'admin dashboard launch design docs review',
            window: '2026-05-06/2026-05-15',
          },
          output: {
            events: [
              { title: 'Design review', startsAt: '2026-05-07T14:00:00.000Z' },
              { title: 'Docs review', startsAt: '2026-05-09T15:30:00.000Z' },
            ],
          },
        }),
        {
          type: 'text',
          text: 'Both are scheduled. Design review is Thursday, May 7 at 14:00 UTC, and docs review is Friday, May 9 at 15:30 UTC. I would add a rollout readiness review after docs so support can sign off before beta expansion.',
        },
      ],
    }),
    createScenarioMessage({
      id: 'assistant-launch-5',
      conversationId: launchConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-05T16:40:00.000Z',
      text: 'Draft the exec summary in a more concise voice.',
    }),
    createScenarioMessage({
      id: 'assistant-launch-6',
      conversationId: launchConversationId,
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-05T16:42:00.000Z',
      status: 'sent',
      text: 'The new admin dashboard reduces setup friction by making invitations, permissions, and workspace readiness visible in one place. The beta plan validates activation quality before broad rollout, with clear checkpoints for design, docs, support, and launch metrics.',
    }),
    createScenarioMessage({
      id: 'assistant-sync-1',
      conversationId: syncConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-04T10:12:00.000Z',
      text: 'What should I raise in weekly sync?',
    }),
    createScenarioMessage({
      id: 'assistant-sync-2',
      conversationId: syncConversationId,
      role: 'assistant',
      author: users.assistant,
      createdAt: '2026-05-04T10:18:00.000Z',
      text: 'Raise the beta invite threshold, whether support gets a saved reply pack before launch, and who owns the admin dashboard walkthrough recording.',
    }),
  ],
  suggestions: [
    {
      id: 'assistant-suggest-brief',
      label: 'Write a brief',
      prompt: 'Turn these notes into a one-page launch brief.',
    },
    {
      id: 'assistant-suggest-tasks',
      label: 'Find next actions',
      prompt: 'Extract owners, dates, and open decisions from this thread.',
    },
    {
      id: 'assistant-suggest-tone',
      label: 'Change tone',
      prompt: 'Rewrite the summary for an executive audience.',
    },
  ],
  composer: {
    placeholder: 'Ask the assistant to draft, summarize, or plan...',
    helperText: 'Suggestions are seeded with planning and writing prompts.',
  },
  insights: [
    { id: 'assistant-insight-1', label: 'Open decisions', value: '3', tone: 'warning' },
    { id: 'assistant-insight-2', label: 'Launch owners', value: '5', tone: 'info' },
    { id: 'assistant-insight-3', label: 'Ready reviews', value: '2 scheduled', tone: 'success' },
  ],
  reply: ({ prompt, scenario }) => ({
    author: scenario.assistant,
    text:
      prompt.length === 0
        ? 'Share notes or pick a suggestion and I will turn them into a structured plan.'
        : `I would turn "${prompt}" into a short plan with an objective, audience, risks, owner table, and follow-up checklist.`,
  }),
};
