'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import { demoUsers } from 'docs/data/chat/core/examples/shared/demoData';
import { createChunkStream } from 'docs/data/chat/core/examples/shared/demoUtils';

const CONVERSATION_ID = 'tool-approval';

function createToolApprovalAdapter() {
  let onEventRef = null;
  let pendingMessage = null;

  return {
    async sendMessage() {
      const messageId = 'assistant-approval';
      const textId = 'assistant-approval-text';
      const toolCallId = 'cleanup-1';

      pendingMessage = {
        id: messageId,
        conversationId: CONVERSATION_ID,
        role: 'assistant',
        author: demoUsers.agent,
        status: 'sent',
        parts: [
          {
            type: 'text',
            text: 'I need approval before deleting these files.',
          },
          {
            type: 'dynamic-tool',
            toolInvocation: {
              toolCallId,
              toolName: 'delete_files',
              state: 'approval-requested',
              input: { path: '/tmp/cache', recursive: true },
              approvalId: 'approval-1',
            },
          },
        ],
      };

      return createChunkStream(
        [
          { type: 'start', messageId, author: demoUsers.agent },
          { type: 'text-start', id: textId },
          {
            type: 'text-delta',
            id: textId,
            delta: 'I need approval before deleting these files.',
          },
          { type: 'text-end', id: textId },
          {
            type: 'tool-approval-request',
            toolCallId,
            toolName: 'delete_files',
            input: { path: '/tmp/cache', recursive: true },
            // The optional approval id is round-tripped: the built-in widget
            // responds with it, and the controller matches the invocation by it.
            approvalId: 'approval-1',
            dynamic: true,
          },
          { type: 'finish', messageId, finishReason: 'tool-call' },
        ],
        { delayMs: 240 },
      );
    },
    subscribe({ onEvent }) {
      onEventRef = onEvent;
      return () => {
        onEventRef = null;
      };
    },
    async addToolApprovalResponse({ approved, reason }) {
      if (!pendingMessage) {
        return;
      }

      // 1. Move the tool invocation to its terminal state.
      onEventRef?.({
        type: 'message-updated',
        message: {
          ...pendingMessage,
          parts: [
            pendingMessage.parts[0],
            {
              type: 'dynamic-tool',
              toolInvocation: {
                toolCallId: 'cleanup-1',
                toolName: 'delete_files',
                state: approved ? 'output-available' : 'output-denied',
                input: { path: '/tmp/cache', recursive: true },
                approvalId: 'approval-1',
                approval: { approved, reason },
                output: approved ? { deleted: 3 } : undefined,
              },
            },
          ],
        },
      });

      // 2. Emit a follow-up assistant message after a short delay.
      setTimeout(() => {
        onEventRef?.({
          type: 'message-added',
          message: {
            id: 'assistant-followup',
            conversationId: CONVERSATION_ID,
            role: 'assistant',
            author: demoUsers.agent,
            status: 'sent',
            parts: [
              {
                type: 'text',
                text: approved
                  ? 'Deleted 3 files.'
                  : "Okay, I won't delete anything.",
              },
            ],
          },
        });
      }, 400);
    },
  };
}

export default function ToolApprovalFlow() {
  const adapter = React.useMemo(() => createToolApprovalAdapter(), []);

  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      suggestions={['Clean up /tmp/cache']}
      suggestionsAutoSubmit
      sx={{
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
