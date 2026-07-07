import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatCodeBlock } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  DividerLabel,
  SelectControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import { useCustomizations } from 'docs/src/modules/components/chat-playground/useCustomizations';

const SAMPLES = {
  tsx: `import { ChatBox } from '@mui/x-chat';

export function MyChat() {
  return <ChatBox adapter={adapter} />;
}`,
  bash: `pnpm add @mui/x-chat
pnpm add @mui/material @emotion/react`,
  json: `{
  "name": "@mui/x-chat",
  "version": "8.0.0",
  "main": "./dist/index.js"
}`,
  css: `.MuiChatComposer-root {
  border-radius: 16px;
  box-shadow: var(--mui-shadows-1);
}`,
};

// Simple demo "highlighter" — splits on whitespace and shades the tokens.
function tokensHighlighter(code) {
  return code.split(/(\s+)/).map((part, i) => {
    if (/^\s+$/.test(part)) {
      return part;
    }
    if (
      /^(import|export|function|return|const|let|var|from|class|interface)$/.test(
        part,
      )
    ) {
      return (
        <span key={i} style={{ color: '#c084fc' }}>
          {part}
        </span>
      );
    }
    if (/^["'`].*/.test(part)) {
      return (
        <span key={i} style={{ color: '#fda4af' }}>
          {part}
        </span>
      );
    }
    if (/^\d+$/.test(part)) {
      return (
        <span key={i} style={{ color: '#fbbf24' }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

const HIGHLIGHTERS = {
  none: undefined,
  tokens: tokensHighlighter,
};

const CLASS_DEFS = [
  { name: 'root', description: 'The outer code block container.' },
  {
    name: 'header',
    selector: '.MuiChatCodeBlock-header',
    description: 'The header row (language label + copy).',
  },
  {
    name: 'languageLabel',
    selector: '.MuiChatCodeBlock-languageLabel',
    description: 'The language identifier label.',
  },
  {
    name: 'copyButton',
    selector: '.MuiChatCodeBlock-copyButton',
    description: 'The copy button.',
  },
  {
    name: 'pre',
    selector: '.MuiChatCodeBlock-pre',
    description: 'The <pre> wrapper.',
  },
  {
    name: 'code',
    selector: '.MuiChatCodeBlock-code',
    description: 'The <code> element.',
  },
];

export default function ChatCodeBlockPlayground() {
  const [language, setLanguage] = React.useState('tsx');
  const [code, setCode] = React.useState(SAMPLES.tsx);
  const [highlighter, setHighlighter] = React.useState('none');
  const classesCustomizations = useCustomizations(CLASS_DEFS);

  React.useEffect(() => {
    setCode(SAMPLES[language]);
  }, [language]);

  const blockSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatCodeBlock"
      description="Standalone ChatCodeBlock — switch the language and plug in a syntax highlighter."
      previewMinHeight={260}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SelectControl
            label="language"
            value={language}
            options={Object.keys(SAMPLES).map((value) => ({
              value,
            }))}
            onChange={setLanguage}
          />
          <SelectControl
            label="highlighter"
            value={highlighter}
            options={[
              { value: 'none', label: 'none (raw)' },
              { value: 'tokens', label: 'tokens (realistic reference)' },
            ]}
            onChange={setHighlighter}
            helperText="Hook to plug in Shiki/Prism/Highlight.js."
          />
          <TextControl
            label="children (code)"
            value={code}
            onChange={setCode}
            multiline
            rows={5}
          />
        </React.Fragment>
      }
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatCodeBlock
            language={language}
            highlighter={HIGHLIGHTERS[highlighter]}
            sx={blockSx}
          >
            {code}
          </ChatCodeBlock>
        </Box>
      }
    />
  );
}
