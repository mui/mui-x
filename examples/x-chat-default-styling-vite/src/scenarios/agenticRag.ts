import { users } from '../data';
import {
  createDataPart,
  createScenarioMessage,
  createSourceDocumentPart,
  createSourceUrlPart,
  createToolPart,
} from './helpers';
import type { ScenarioDocumentReference, ScenarioFixture, ScenarioSource } from './types';

const ragConversationId = 'rag-renewal-risk';

const renewalRiskSources: ScenarioSource[] = [
  {
    id: 'rag-source-renewals',
    title: 'Renewal workbook: Q4 enterprise accounts',
    url: 'https://example.com/data/renewal-workbook-q4',
    kind: 'dataset',
    snippet: 'Account-level renewal date, ARR, health score, adoption trend, and open risks.',
  },
  {
    id: 'rag-source-support',
    title: 'Support themes: dashboard admins',
    url: 'https://example.com/reports/support-themes-admin-dashboard',
    kind: 'internal',
    snippet: 'Top support contacts mention permissions preview, invite status, and audit export.',
  },
  {
    id: 'rag-source-playbook',
    title: 'Renewal save playbook',
    url: 'https://example.com/playbooks/renewal-save',
    kind: 'knowledge-base',
    snippet: 'Recommended actions by risk level and customer segment.',
  },
];

const renewalRiskDocuments: ScenarioDocumentReference[] = [
  {
    id: 'rag-doc-contoso',
    title: 'Contoso workspace health note',
    kind: 'report',
    text: 'Contoso adoption dropped from 71% to 54% after the permissions migration. Champions asked for a preview mode and audit export before renewal.',
  },
  {
    id: 'rag-doc-northwind',
    title: 'Northwind support digest',
    kind: 'transcript',
    text: 'Northwind opened six admin-dashboard tickets in 14 days. Four are related to invite visibility and two are related to CSV export limits.',
  },
];

export const agenticRagScenario: ScenarioFixture = {
  id: 'agentic-rag',
  title: 'Agentic RAG',
  shortTitle: 'RAG',
  description:
    'A research agent that retrieves documents, runs tools, shows reasoning, cites sources, and returns an action plan.',
  category: 'rag',
  tags: ['rag', 'agent', 'tools', 'sources', 'reasoning'],
  currentUser: users.me,
  assistant: users.ragAssistant,
  members: [users.me, users.ragAssistant],
  variant: 'compact',
  density: 'standard',
  layoutMode: 'split',
  activeConversationId: ragConversationId,
  conversations: [
    {
      id: ragConversationId,
      title: 'Q4 renewal risk brief',
      subtitle: 'Tool calls, reasoning, and citations',
      participants: [users.me, users.ragAssistant],
      readState: 'read',
      unreadCount: 0,
      lastMessageAt: '2026-05-06T09:24:00.000Z',
    },
  ],
  messages: [
    createScenarioMessage({
      id: 'rag-brief-1',
      conversationId: ragConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-06T09:10:00.000Z',
      text: 'Compare Q4 renewal risk across enterprise accounts and explain where the admin dashboard work changes the plan.',
    }),
    createScenarioMessage({
      id: 'rag-brief-2',
      conversationId: ragConversationId,
      role: 'assistant',
      author: users.ragAssistant,
      createdAt: '2026-05-06T09:12:00.000Z',
      parts: [
        {
          type: 'reasoning',
          state: 'done',
          text: 'I need renewal timing, account health, support themes, and whether the admin dashboard roadmap addresses the top risks. I will retrieve account notes, query the renewal workbook, then map findings to the save playbook.',
        },
        createToolPart({
          toolCallId: 'rag-vector-1',
          toolName: 'vector.search',
          title: 'Retrieve renewal notes',
          input: {
            query: 'Q4 enterprise renewal dashboard admin risk permissions invite audit export',
            topK: 5,
          },
          output: {
            hits: [
              { sourceId: 'rag-doc-contoso', score: 0.91 },
              { sourceId: 'rag-doc-northwind', score: 0.87 },
              { sourceId: 'rag-source-playbook', score: 0.82 },
            ],
          },
        }),
        createToolPart({
          toolCallId: 'rag-sql-1',
          toolName: 'warehouse.query',
          title: 'Query renewal workbook',
          input: {
            sql: 'select account, arr, health_score, renewal_date from q4_renewals where segment = enterprise order by health_score asc limit 3',
          },
          output: {
            rows: [
              { account: 'Contoso', arr: '$420k', healthScore: 54, renewalDate: '2026-11-15' },
              { account: 'Northwind', arr: '$310k', healthScore: 61, renewalDate: '2026-12-01' },
              { account: 'Fabrikam', arr: '$275k', healthScore: 68, renewalDate: '2026-10-28' },
            ],
          },
        }),
        createDataPart({
          type: 'data-risk-scorecard',
          id: 'rag-risk-scorecard-q4',
          data: {
            highRiskAccounts: 2,
            arrAtRisk: '$730k',
            topTheme: 'admin visibility',
            recommendedMotion: 'dashboard beta plus success plan',
          },
        }),
        {
          type: 'text',
          text: `**Highest risk:** Contoso and Northwind. Together they represent **$730k ARR at risk** and both cite admin visibility gaps.

**Where the dashboard changes the plan:** prioritize the permissions preview, invite status, and audit export stories for those accounts before renewal meetings. The save motion should pair beta access with a success-manager checklist, not a generic roadmap promise.

**Next action:** give Contoso the preview build first, then use Northwind's ticket themes to validate the invite-status copy before broader beta rollout.`,
        },
        createSourceDocumentPart(renewalRiskDocuments[0]),
        createSourceDocumentPart(renewalRiskDocuments[1]),
        createSourceUrlPart(renewalRiskSources[0]),
        createSourceUrlPart(renewalRiskSources[1]),
        createSourceUrlPart(renewalRiskSources[2]),
      ],
    }),
    createScenarioMessage({
      id: 'rag-brief-3',
      conversationId: ragConversationId,
      role: 'user',
      author: users.me,
      createdAt: '2026-05-06T09:20:00.000Z',
      text: 'What would you do next if I let you act on this?',
    }),
    createScenarioMessage({
      id: 'rag-brief-4',
      conversationId: ragConversationId,
      role: 'assistant',
      author: users.ragAssistant,
      createdAt: '2026-05-06T09:24:00.000Z',
      status: 'sent',
      parts: [
        createToolPart({
          toolCallId: 'rag-crm-approval-1',
          toolName: 'crm.createTasks',
          title: 'Create customer tasks',
          state: 'approval-requested',
          input: {
            tasks: [
              'Schedule Contoso preview walkthrough',
              'Attach Northwind ticket digest to renewal plan',
              'Ask product for audit export ETA',
            ],
          },
        }),
        {
          type: 'text',
          text: 'I would create three CRM tasks, attach the cited support evidence, and draft a customer-specific follow-up for Contoso. I need approval before writing to CRM.',
        },
      ],
    }),
  ],
  suggestions: [
    {
      id: 'rag-suggest-sources',
      label: 'Show sources',
      prompt: 'Show the sources behind the renewal risk answer.',
    },
    {
      id: 'rag-suggest-actions',
      label: 'Plan actions',
      prompt: 'Create the next-step action plan from the cited evidence.',
    },
    {
      id: 'rag-suggest-counterfactual',
      label: 'Compare accounts',
      prompt: 'Compare Contoso and Northwind risk drivers.',
    },
  ],
  composer: {
    placeholder: 'Ask the research agent...',
    helperText:
      'Agentic RAG scenario includes reasoning, tool calls, source documents, URLs, and data parts.',
  },
  insights: [
    { id: 'rag-insight-1', label: 'Sources cited', value: '5', tone: 'info' },
    { id: 'rag-insight-2', label: 'ARR at risk', value: '$730k', tone: 'warning' },
    { id: 'rag-insight-3', label: 'Tool calls', value: '3', tone: 'success' },
  ],
  sources: renewalRiskSources,
  documents: renewalRiskDocuments,
  reply: ({ prompt, scenario }) => ({
    author: scenario.assistant,
    reasoning:
      'I will ground the answer in the renewal workbook, retrieve the related account notes, then cite the documents that support the recommendation.',
    tools: [
      {
        toolCallId: 'rag-live-vector',
        toolName: 'vector.search',
        input: { query: prompt || 'Q4 enterprise renewal risk', topK: 3 },
        output: {
          hits: renewalRiskDocuments.map((document, index) => ({
            sourceId: document.id,
            score: 0.92 - index * 0.05,
          })),
        },
      },
      {
        toolCallId: 'rag-live-workbook',
        toolName: 'warehouse.query',
        input: { workbook: 'q4_renewals', metric: 'arr_at_risk' },
        output: { arrAtRisk: '$730k', highRiskAccounts: ['Contoso', 'Northwind'] },
      },
    ],
    text:
      prompt.length === 0
        ? 'Ask about renewal risk, account differences, or the next actions I should prepare.'
        : 'The grounded answer remains Contoso first, Northwind second. Admin visibility work should be packaged as a beta success plan with a preview walkthrough, invite-status validation, and an audit-export commitment before renewal meetings.',
    sources: renewalRiskSources,
    documents: renewalRiskDocuments,
    dataParts: [
      {
        type: 'data-risk-scorecard',
        id: 'rag-live-scorecard',
        data: {
          highRiskAccounts: 2,
          arrAtRisk: '$730k',
          citedSources: renewalRiskSources.length + renewalRiskDocuments.length,
        },
      },
    ],
  }),
};
