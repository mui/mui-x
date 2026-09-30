import * as React from 'react';
import { ChatMessageSource, ChatMessageSources } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  DividerLabel,
  NumberControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';

const POOL = [
  { href: 'https://mui.com/x/react-chat/', title: 'MUI X Chat overview' },
  {
    href: 'https://mui.com/material-ui/customization/theming/',
    title: 'Material UI theming',
  },
  { href: 'https://mui.com/x/api/chat/chat-box/', title: 'ChatBox API' },
  { href: 'https://mui.com/x/react-chat/material/', title: 'Material adapter' },
  { href: 'https://mui.com/system/styled/', title: 'styled() utility' },
];

const CLASS_DEFS = [
  { name: 'root', description: 'The sources container.' },
  {
    name: 'label',
    selector: '.MuiChatMessageSources-label',
    description: 'The "Sources" label above the list.',
  },
  {
    name: 'list',
    selector: '.MuiChatMessageSources-list',
    description: 'The ordered list element.',
  },
];

export default function ChatMessageSourcesPlayground() {
  const [count, setCount] = React.useState(3);
  const [label, setLabel] = React.useState('Sources');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  const rootSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatMessageSources"
      description="Citation list for an assistant answer (RAG)."
      previewMinHeight={200}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <TextControl label="label" value={label} onChange={setLabel} />
          <DividerLabel>fixture data</DividerLabel>
          <NumberControl
            label="source count"
            value={count}
            min={1}
            max={POOL.length}
            onChange={setCount}
          />
        </React.Fragment>
      }
      preview={
        <ChatMessageSources label={label} sx={rootSx}>
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
