import * as React from 'react';
import {
  Card,
  CenteredBubble,
  CenteredMessageRow,
  MessageGroup,
  Messages,
  ThumbCanvas,
} from './primitives';

export function ChatMessageGroupThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <Messages y={64} gap={0}>
          <MessageGroup count={3} />
        </Messages>
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CenteredMessageRow side="left" focus="all" />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageContentThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CenteredBubble variant="incoming" text={4} />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageMetaThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CenteredMessageRow side="left" focus="meta" showMeta />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatMessageActionsThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CenteredMessageRow side="left" focus="actions" showActions />
      </Card>
    </ThumbCanvas>
  );
}
