import * as React from 'react';
import { Box } from '@mui/material';
import { ChatCodeBlock } from '@mui/x-chat';
import { PlaygroundCard } from './PlaygroundCard';
import { SelectControl, TextControl } from './controls';

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

export function ChatCodeBlockPlayground() {
  const [language, setLanguage] = React.useState<Language>('tsx');
  const [code, setCode] = React.useState(SAMPLES.tsx);

  React.useEffect(() => {
    setCode(SAMPLES[language]);
  }, [language]);

  const codeExample = `import { ChatCodeBlock } from '@mui/x-chat';

<ChatCodeBlock language="tsx">
  {\`import { ChatBox } from '@mui/x-chat';\`}
</ChatCodeBlock>`;

  return (
    <PlaygroundCard
      title="ChatCodeBlock"
      description="Default markdown ``` block — divider border + caption font."
      previewMinHeight={220}
      codeExample={codeExample}
      controls={
        <React.Fragment>
          <SelectControl<Language>
            label="language"
            value={language}
            options={(Object.keys(SAMPLES) as Language[]).map((value) => ({ value }))}
            onChange={setLanguage}
          />
          <TextControl label="code" value={code} onChange={setCode} multiline rows={5} />
        </React.Fragment>
      }
      preview={
        <Box sx={{ width: '100%' }}>
          <ChatCodeBlock language={language}>{code}</ChatCodeBlock>
        </Box>
      }
    />
  );
}
