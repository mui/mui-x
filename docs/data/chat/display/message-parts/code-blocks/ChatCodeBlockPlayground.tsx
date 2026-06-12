import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatCodeBlock } from '@mui/x-chat';
import { PlaygroundCard } from 'docs/src/modules/components/chat-playground/PlaygroundCard';
import {
  DividerLabel,
  SelectControl,
  TextControl,
} from 'docs/src/modules/components/chat-playground/controls';
import {
  useCustomizations,
  type CustomizationDef,
} from 'docs/src/modules/components/chat-playground/useCustomizations';

const SAMPLES: Record<string, string> = {
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

type Language = keyof typeof SAMPLES;

type HighlighterChoice = 'none' | 'tokens' | 'rainbow';

// Simple demo "highlighter" — splits on whitespace and shades the tokens.
function tokensHighlighter(code: string): React.ReactNode {
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

const RAINBOW_PALETTE = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#34d399',
  '#60a5fa',
  '#a78bfa',
];

function rainbowHighlighter(code: string): React.ReactNode {
  return code.split('').map((char, i) => (
    <span key={i} style={{ color: RAINBOW_PALETTE[i % RAINBOW_PALETTE.length] }}>
      {char}
    </span>
  ));
}

const HIGHLIGHTERS: Record<
  HighlighterChoice,
  ((code: string, language: string) => React.ReactNode) | undefined
> = {
  none: undefined,
  tokens: tokensHighlighter,
  rainbow: rainbowHighlighter,
};

type ClassKey = 'root' | 'header' | 'languageLabel' | 'copyButton' | 'pre' | 'code';

const CLASS_DEFS: ReadonlyArray<CustomizationDef<ClassKey>> = [
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
  const [language, setLanguage] = React.useState<Language>('tsx');
  const [code, setCode] = React.useState(SAMPLES.tsx);
  const [highlighter, setHighlighter] = React.useState<HighlighterChoice>('none');
  const classesCustomizations = useCustomizations<ClassKey>(CLASS_DEFS);

  React.useEffect(() => {
    setCode(SAMPLES[language]);
  }, [language]);

  const blockSx = classesCustomizations.toClassesSx();

  return (
    <PlaygroundCard
      title="ChatCodeBlock"
      description="Default markdown ``` block — divider border + caption font."
      previewMinHeight={260}
      classCustomizations={classesCustomizations.customizations}
      onClassesReset={classesCustomizations.reset}
      controls={
        <React.Fragment>
          <DividerLabel>props</DividerLabel>
          <SelectControl<Language>
            label="language"
            value={language}
            options={(Object.keys(SAMPLES) as Language[]).map((value) => ({
              value,
            }))}
            onChange={setLanguage}
          />
          <SelectControl<HighlighterChoice>
            label="highlighter"
            value={highlighter}
            options={[
              { value: 'none', label: 'none (raw)' },
              { value: 'tokens', label: 'tokens (keywords/strings)' },
              { value: 'rainbow', label: 'rainbow (demo only)' },
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
            sx={blockSx as any}
          >
            {code}
          </ChatCodeBlock>
        </Box>
      }
    />
  );
}
