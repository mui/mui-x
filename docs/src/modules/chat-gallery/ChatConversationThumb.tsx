import * as React from 'react';
import { Card, Composer, Header, Messages, Msg, Thread, ThumbCanvas } from './primitives';

export function ChatConversationThumb() {
  return (
    <ThumbCanvas>
      <Card>
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
