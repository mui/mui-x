import { users } from '../data';
import { createDataPart, createFilePart, createScenarioMessage, createToolPart } from './helpers';
import type { ScenarioFixture } from './types';

const supportConversationId = 'support-widget-delivery';

export const supportWidgetScenario: ScenarioFixture = {
  id: 'support-widget',
  title: 'Support widget',
  shortTitle: 'Support',
  description:
    'An embedded customer support widget with escalation, order lookup, attachments, and SLA context.',
  category: 'support',
  tags: ['support', 'customer', 'widget', 'escalation'],
  currentUser: users.customerLena,
  assistant: users.supportBot,
  members: [users.customerLena, users.supportBot, users.maya],
  variant: 'default',
  density: 'comfortable',
  layoutMode: 'overlay',
  activeConversationId: supportConversationId,
  conversations: [
    {
      id: supportConversationId,
      title: 'Order #1042',
      subtitle: 'Delivery change and damaged item',
      participants: [users.customerLena, users.supportBot, users.maya],
      readState: 'unread',
      unreadCount: 1,
      lastMessageAt: '2026-05-05T18:29:00.000Z',
    },
  ],
  messages: [
    createScenarioMessage({
      id: 'support-1',
      conversationId: supportConversationId,
      role: 'assistant',
      author: users.supportBot,
      createdAt: '2026-05-05T18:16:00.000Z',
      text: 'Hi Lena, I can help with delivery changes, returns, and order questions. What can I look up for you?',
    }),
    createScenarioMessage({
      id: 'support-2',
      conversationId: supportConversationId,
      role: 'user',
      author: users.customerLena,
      createdAt: '2026-05-05T18:17:00.000Z',
      text: 'My order says delivered, but one item arrived damaged and I need to change the replacement address.',
    }),
    createScenarioMessage({
      id: 'support-3',
      conversationId: supportConversationId,
      role: 'assistant',
      author: users.supportBot,
      createdAt: '2026-05-05T18:18:00.000Z',
      parts: [
        createToolPart({
          toolCallId: 'support-order-lookup',
          toolName: 'orders.lookup',
          title: 'Look up order',
          input: { orderNumber: '1042', customerId: 'customer-lena' },
          output: {
            status: 'delivered',
            deliveredAt: '2026-05-05T17:44:00.000Z',
            items: [
              { sku: 'desk-lamp-graphite', replacementEligible: true },
              { sku: 'cable-tray-white', replacementEligible: false },
            ],
          },
        }),
        {
          type: 'text',
          text: 'I found the order. The desk lamp is eligible for an instant replacement. Please upload a photo of the damage and I can prepare the replacement request.',
        },
      ],
    }),
    createScenarioMessage({
      id: 'support-4',
      conversationId: supportConversationId,
      role: 'user',
      author: users.customerLena,
      createdAt: '2026-05-05T18:20:00.000Z',
      parts: [
        { type: 'text', text: 'Here is the photo and the address I want to use.' },
        createFilePart({
          url: 'https://example.com/support/damaged-lamp.jpg',
          mediaType: 'image/jpeg',
          filename: 'damaged-lamp.jpg',
        }),
      ],
    }),
    createScenarioMessage({
      id: 'support-5',
      conversationId: supportConversationId,
      role: 'assistant',
      author: users.supportBot,
      createdAt: '2026-05-05T18:22:00.000Z',
      parts: [
        createToolPart({
          toolCallId: 'support-address-change',
          toolName: 'orders.updateReplacementAddress',
          title: 'Request address update',
          state: 'approval-requested',
          input: {
            orderNumber: '1042',
            replacementSku: 'desk-lamp-graphite',
            address: '221 Birch Street, Denver, CO',
          },
        }),
        createDataPart({
          type: 'data-support-sla',
          id: 'support-sla-1042',
          data: {
            tier: 'standard',
            firstResponseMins: 2,
            replacementWindowDays: 3,
            escalationAvailable: true,
          },
        }),
        {
          type: 'text',
          text: 'I can update the replacement address to **221 Birch Street, Denver, CO**. Please confirm before I make the change.',
        },
      ],
    }),
    createScenarioMessage({
      id: 'support-6',
      conversationId: supportConversationId,
      role: 'user',
      author: users.customerLena,
      createdAt: '2026-05-05T18:25:00.000Z',
      text: 'Confirmed.',
    }),
    createScenarioMessage({
      id: 'support-7',
      conversationId: supportConversationId,
      role: 'assistant',
      author: users.maya,
      createdAt: '2026-05-05T18:29:00.000Z',
      status: 'sent',
      text: 'I approved the address change and created replacement request REP-8821. You will get tracking as soon as it leaves the warehouse.',
    }),
  ],
  suggestions: [
    {
      id: 'support-suggest-track',
      label: 'Track shipment',
      prompt: 'Track my replacement shipment.',
    },
    {
      id: 'support-suggest-address',
      label: 'Change address',
      prompt: 'Change the delivery address for my replacement.',
    },
    {
      id: 'support-suggest-agent',
      label: 'Human agent',
      prompt: 'Connect me with a support agent.',
    },
  ],
  composer: {
    placeholder: 'Message support...',
    helperText: 'Widget scenario includes an uploaded image, approval state, and support SLA data.',
    attachments: [
      {
        name: 'damaged-lamp.jpg',
        type: 'image/jpeg',
        size: 482130,
        status: 'uploaded',
        previewUrl: 'https://example.com/support/damaged-lamp.jpg',
      },
    ],
  },
  insights: [
    { id: 'support-insight-1', label: 'SLA', value: '2 min', tone: 'success' },
    { id: 'support-insight-2', label: 'Escalation', value: 'Agent joined', tone: 'info' },
    { id: 'support-insight-3', label: 'Replacement', value: 'REP-8821', tone: 'success' },
  ],
  reply: ({ prompt, scenario }) => ({
    author: scenario.assistant,
    tools: [
      {
        toolCallId: 'support-live-lookup',
        toolName: 'orders.lookup',
        input: { prompt, customerId: scenario.currentUser.id },
        output: { orderNumber: '1042', replacementStatus: 'created', tracking: 'pending' },
      },
    ],
    text:
      prompt.length === 0
        ? 'I can look up the replacement, update the delivery address, or connect you with Maya.'
        : 'Replacement request REP-8821 is created. Tracking is not available yet, and the replacement address on file is 221 Birch Street, Denver, CO.',
  }),
};
