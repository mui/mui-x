import { users } from '../data';
import {
  createDataPart,
  createScenarioMessage,
  createSourceUrlPart,
  createToolPart,
} from './helpers';
import type { ScenarioFixture } from './types';

const releaseConversationId = 'inbox-release-triage';
const designConversationId = 'inbox-design-review';
const onCallConversationId = 'inbox-on-call';
const partnerConversationId = 'inbox-partner-feedback';

export const teamInboxScenario: ScenarioFixture = {
  id: 'team-inbox',
  title: 'Team inbox',
  shortTitle: 'Inbox',
  description:
    'A shared team inbox with human teammates, operational bots, unread state, handoffs, and decision threads.',
  category: 'inbox',
  tags: ['team', 'inbox', 'handoff', 'operations'],
  currentUser: users.me,
  assistant: users.opsBot,
  members: [users.me, users.alice, users.mira, users.sam, users.nora, users.diego, users.opsBot],
  variant: 'default',
  density: 'compact',
  layoutMode: 'split',
  activeConversationId: releaseConversationId,
  conversations: [
    {
      id: releaseConversationId,
      title: 'Release triage',
      subtitle: 'P1 docs gap and rollout owners',
      participants: [users.me, users.mira, users.sam, users.opsBot],
      readState: 'unread',
      unreadCount: 4,
      lastMessageAt: '2026-05-06T08:58:00.000Z',
    },
    {
      id: designConversationId,
      title: 'Design review',
      subtitle: 'Composer density follow-up',
      participants: [users.me, users.alice, users.nora],
      readState: 'read',
      unreadCount: 0,
      lastMessageAt: '2026-05-05T17:20:00.000Z',
    },
    {
      id: onCallConversationId,
      title: 'On-call handoff',
      subtitle: 'EU morning notes',
      participants: [users.me, users.diego, users.opsBot],
      readState: 'unread',
      unreadCount: 2,
      lastMessageAt: '2026-05-06T07:35:00.000Z',
    },
    {
      id: partnerConversationId,
      title: 'Partner feedback',
      subtitle: 'Enterprise workspace admin quotes',
      participants: [users.me, users.mira, users.alice],
      readState: 'read',
      unreadCount: 0,
      lastMessageAt: '2026-05-04T13:45:00.000Z',
    },
  ],
  messages: [
    createScenarioMessage({
      id: 'inbox-release-1',
      conversationId: releaseConversationId,
      role: 'user',
      author: users.mira,
      createdAt: '2026-05-06T08:41:00.000Z',
      text: 'Can we close release triage by 11:00? The admin dashboard beta still has one docs gap.',
    }),
    createScenarioMessage({
      id: 'inbox-release-2',
      conversationId: releaseConversationId,
      role: 'assistant',
      author: users.opsBot,
      createdAt: '2026-05-06T08:42:00.000Z',
      parts: [
        createToolPart({
          toolCallId: 'inbox-linear-1',
          toolName: 'linear.search',
          title: 'Find open release blockers',
          input: { project: 'Admin dashboard beta', labels: ['release-blocker'] },
          output: {
            issues: [
              {
                key: 'XCHAT-438',
                title: 'Publish migration checklist before beta expansion',
                owner: 'Sam Rivera',
                priority: 'P1',
              },
            ],
          },
        }),
        createDataPart({
          type: 'data-release-health',
          id: 'release-health-admin-dashboard',
          data: {
            blockers: 1,
            ownersMissing: 0,
            targetShip: '2026-05-08',
            confidence: 'medium',
          },
        }),
        {
          type: 'text',
          text: 'One release blocker remains: **XCHAT-438**. Sam owns the checklist, and the target ship date is still Friday, May 8 if docs are merged today.',
        },
      ],
    }),
    createScenarioMessage({
      id: 'inbox-release-3',
      conversationId: releaseConversationId,
      role: 'user',
      author: users.sam,
      createdAt: '2026-05-06T08:50:00.000Z',
      text: 'Checklist draft is ready. I need a review on the warning copy before I publish.',
    }),
    createScenarioMessage({
      id: 'inbox-release-4',
      conversationId: releaseConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-06T08:53:00.000Z',
      text: 'Send it here. I can review the copy now.',
    }),
    createScenarioMessage({
      id: 'inbox-release-5',
      conversationId: releaseConversationId,
      role: 'user',
      author: users.sam,
      createdAt: '2026-05-06T08:56:00.000Z',
      parts: [
        {
          type: 'text',
          text: 'Draft link and the two warning states are attached.',
        },
        {
          type: 'file',
          mediaType: 'application/pdf',
          url: 'https://example.com/admin-dashboard-migration-checklist.pdf',
          filename: 'admin-dashboard-migration-checklist.pdf',
        },
        createSourceUrlPart({
          id: 'inbox-checklist-doc',
          title: 'Checklist draft',
          url: 'https://docs.example.com/admin-dashboard/checklist',
          kind: 'internal',
        }),
      ],
    }),
    createScenarioMessage({
      id: 'inbox-release-6',
      conversationId: releaseConversationId,
      role: 'assistant',
      author: users.opsBot,
      createdAt: '2026-05-06T08:58:00.000Z',
      status: 'sent',
      text: 'I moved the release note to "reviewing" and linked this thread to XCHAT-438.',
    }),
    createScenarioMessage({
      id: 'inbox-design-1',
      conversationId: designConversationId,
      role: 'user',
      author: users.alice,
      createdAt: '2026-05-05T17:02:00.000Z',
      text: 'The compact composer looks good, but the helper text wraps early in German.',
    }),
    createScenarioMessage({
      id: 'inbox-design-2',
      conversationId: designConversationId,
      role: 'user',
      author: users.nora,
      createdAt: '2026-05-05T17:20:00.000Z',
      text: 'I added screenshots to the design note and marked the overflow case.',
    }),
    createScenarioMessage({
      id: 'inbox-oncall-1',
      conversationId: onCallConversationId,
      role: 'user',
      author: users.diego,
      createdAt: '2026-05-06T07:28:00.000Z',
      text: 'EU handoff: two payment retries recovered, one webhook delay still noisy.',
    }),
    createScenarioMessage({
      id: 'inbox-oncall-2',
      conversationId: onCallConversationId,
      role: 'assistant',
      author: users.opsBot,
      createdAt: '2026-05-06T07:35:00.000Z',
      text: 'Webhook delay volume is down 38% over the last hour. Next check is scheduled for 09:00 UTC.',
    }),
    createScenarioMessage({
      id: 'inbox-partner-1',
      conversationId: partnerConversationId,
      role: 'user',
      author: users.mira,
      createdAt: '2026-05-04T13:45:00.000Z',
      text: 'Partner admins liked the invite preview. Their top ask is an audit log export.',
    }),
  ],
  suggestions: [
    {
      id: 'inbox-suggest-unread',
      label: 'Summarize unread',
      prompt: 'Summarize unread threads and call out blockers.',
    },
    {
      id: 'inbox-suggest-handoff',
      label: 'Draft handoff',
      prompt: 'Draft a handoff note for the next owner.',
    },
    {
      id: 'inbox-suggest-owners',
      label: 'Find owners',
      prompt: 'List owners, due dates, and missing decisions.',
    },
  ],
  composer: {
    placeholder: 'Reply to the team...',
    helperText: 'Team inbox scenario includes mixed authors, files, tool output, and unread state.',
    attachments: [
      {
        name: 'warning-copy-review.txt',
        type: 'text/plain',
        size: 2180,
        status: 'uploaded',
      },
    ],
  },
  insights: [
    { id: 'inbox-insight-1', label: 'Unread threads', value: '2', tone: 'warning' },
    { id: 'inbox-insight-2', label: 'Release blockers', value: '1', tone: 'error' },
    { id: 'inbox-insight-3', label: 'Owners assigned', value: '100%', tone: 'success' },
  ],
  reply: ({ prompt, scenario }) => ({
    author: scenario.assistant,
    tools: [
      {
        toolCallId: 'inbox-draft-handoff',
        toolName: 'thread.summarize',
        input: { prompt, scope: 'unread' },
        output: {
          unreadThreads: 2,
          blockers: ['XCHAT-438 checklist review'],
          nextOwner: 'Sam Rivera',
        },
      },
    ],
    text:
      prompt.length === 0
        ? 'I can summarize unread work, draft a handoff, or find the next owner.'
        : 'Unread work centers on the release checklist review and the on-call webhook follow-up. Sam owns the checklist, you are reviewing warning copy, and Diego is watching the webhook noise until the 09:00 UTC check.',
  }),
};
