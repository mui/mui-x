import * as React from 'react';
import { ChatMessageSource, ChatMessageSources } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { NumberControl, TextControl } from './controls';

const POOL = [
  { href: 'https://mui.com/x/react-chat/', title: 'MUI X Chat overview' },
  { href: 'https://mui.com/material-ui/customization/theming/', title: 'Material UI theming' },
  { href: 'https://mui.com/x/api/x-chat/chat-box/', title: 'ChatBox API' },
  { href: 'https://mui.com/x/react-chat/material/', title: 'Material adapter' },
  { href: 'https://mui.com/system/styled/', title: 'styled() utility' },
];

export function ChatMessageSourcesPlayground() {
  const [count, setCount] = React.useState(3);
  const [label, setLabel] = React.useState('Sources');

  return (
    <PlaygroundCard
      title="ChatMessageSources"
      description="Citation list for an assistant answer (RAG)."
      previewMinHeight={200}
      controls={
        <React.Fragment>
          <NumberControl
            label="source count"
            value={count}
            min={1}
            max={POOL.length}
            onChange={setCount}
          />
          <TextControl label="label" value={label} onChange={setLabel} />
        </React.Fragment>
      }
      preview={
        <ChatMessageSources label={label}>
          {POOL.slice(0, count).map((source, i) => (
            <ChatMessageSource
              key={source.href}
              index={i + 1}
              href={source.href}
              title={source.title}
            />
          ))}
        </ChatMessageSources>
      }
    />
  );
}
