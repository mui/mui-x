import * as React from 'react';
import { Card, StandaloneHeader, ThumbCanvas } from './primitives';

function HeaderShowcase({
  focus,
}: {
  focus?: 'all' | 'avatar' | 'title' | 'subtitle' | 'info' | 'actions';
}) {
  return (
    <ThumbCanvas>
      <Card>
        <StandaloneHeader focus={focus} h={120} />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatConversationHeaderThumb() {
  return <HeaderShowcase focus="all" />;
}
export function ChatConversationHeaderInfoThumb() {
  return <HeaderShowcase focus="info" />;
}
export function ChatConversationTitleThumb() {
  return <HeaderShowcase focus="title" />;
}
export function ChatConversationSubtitleThumb() {
  return <HeaderShowcase focus="subtitle" />;
}
export function ChatConversationHeaderActionsThumb() {
  return <HeaderShowcase focus="actions" />;
}
