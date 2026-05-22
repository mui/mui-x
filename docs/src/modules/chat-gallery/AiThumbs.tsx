import * as React from 'react';
import { Card, CodeBlock, ConfirmationCard, SourceList, ThumbCanvas } from './primitives';

export function ChatMessageSourcesThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <SourceList />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatCodeBlockThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <CodeBlock />
      </Card>
    </ThumbCanvas>
  );
}

export function ChatConfirmationThumb() {
  return (
    <ThumbCanvas>
      <Card>
        <ConfirmationCard />
      </Card>
    </ThumbCanvas>
  );
}
