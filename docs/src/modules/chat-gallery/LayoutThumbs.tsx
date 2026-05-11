import * as React from 'react';
import {
  Card,
  Conversation,
  ConversationList,
  Messages,
  Msg,
  SearchField,
  ThumbCanvas,
} from './primitives';

export function ChatConversationListThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <SearchField />
        <ConversationList y={80} gap={12} rowH={56}>
          <Conversation active unread />
          <Conversation />
          <Conversation unread />
          <Conversation />
          <Conversation />
        </ConversationList>
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageListThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <Messages y={48} gap={20}>
          <Msg side="left" h={44} />
          <Msg side="right" h={56} />
          <Msg side="right" h={44} />
          <Msg side="left" h={48} />
          <Msg side="left" h={56} />
        </Messages>
      </Card>
    </ThumbCanvas>
  );
}
