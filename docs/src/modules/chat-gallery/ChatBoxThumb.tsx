import * as React from 'react';
import {
  Card,
  Composer,
  Conversation,
  ConversationList,
  Header,
  Messages,
  Msg,
  SearchField,
  Sidebar,
  Thread,
  ThumbCanvas,
} from './primitives';

export function ChatBoxThumb() {
  return (
    <ThumbCanvas>
      <Card sidebarW={220}>
        <Sidebar>
          <SearchField />
          <ConversationList>
            <Conversation active unread />
            <Conversation />
            <Conversation />
            <Conversation />
          </ConversationList>
        </Sidebar>
        <Thread>
          <Header />
          <Messages>
            <Msg side="left" />
            <Msg side="right" />
            <Msg side="left" />
          </Messages>
          <Composer />
        </Thread>
      </Card>
    </ThumbCanvas>
  );
}
