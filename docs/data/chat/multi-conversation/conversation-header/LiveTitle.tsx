import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationHeaderInfo,
  ChatConversationTitle,
} from '@mui/x-chat';
import type {
  ChatConversation as ChatConversationType,
  ConversationTitleOwnerState,
} from '@mui/x-chat/headless';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';

declare module '@mui/x-chat-headless/types' {
  interface ChatConversationMetadata {
    memberCount?: number;
  }
}

const conversations: ChatConversationType[] = [
  {
    id: 'crit',
    title: 'Design crit',
    metadata: {
      memberCount: 4,
      channel: 'support',
      slaMinutes: 45,
      escalated: false,
    },
  },
];

const LiveTitleSlot = React.forwardRef(function LiveTitleSlot(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: ConversationTitleOwnerState;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, children, ...other } = props;
  const memberCount = ownerState?.conversation?.metadata?.memberCount;
  return (
    <div ref={ref} {...other}>
      {ownerState?.conversation?.title ?? 'No conversation selected'}
      {memberCount != null && (
        <span style={{ fontWeight: 400, marginLeft: 8 }}>{memberCount} members</span>
      )}
    </div>
  );
});

function CustomConversationTitle(
  props: React.ComponentProps<typeof ChatConversationTitle>,
) {
  return <ChatConversationTitle {...props} slots={{ title: LiveTitleSlot }} />;
}

export default function LiveTitle() {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <ScopedChat conversations={conversations} activeConversationId="crit">
        <ChatConversation>
          <ChatConversationHeader>
            <ChatConversationHeaderInfo>
              <CustomConversationTitle />
            </ChatConversationHeaderInfo>
          </ChatConversationHeader>
        </ChatConversation>
      </ScopedChat>
    </Box>
  );
}
