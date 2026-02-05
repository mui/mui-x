import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
// eslint-disable-next-line no-restricted-imports
import { AIProvider } from '@mui/x-scheduler/internals/components/ai-helper';
import { defaultVisibleDate } from '../datasets/personal-agenda';

export default function AiHelperDemo() {
  const [events, setEvents] = React.useState<SchedulerEvent[]>([]);
  const [apiKey, setApiKey] = React.useState('');
  const [provider, setProvider] = React.useState<AIProvider>('anthropic');
  const [geminiNanoAvailable, setGeminiNanoAvailable] = React.useState(false);

  React.useEffect(() => {
    async function checkAvailability() {
      try {
        if (typeof (globalThis as any).LanguageModel !== 'undefined') {
          const availability = await (
            globalThis as any
          ).LanguageModel.availability();
          setGeminiNanoAvailable(availability !== 'unavailable');
        }
      } catch {
        // API not available
      }
    }
    checkAvailability();
  }, []);

  const isGeminiNano = provider === 'gemini-nano';
  const isAiHelperEnabled = isGeminiNano || !!apiKey;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {isGeminiNano
          ? 'Gemini Nano runs locally in your browser — no API key needed. Click the sparkle button in the toolbar to create events using natural language.'
          : 'Enter your API key below, then click the sparkle button in the toolbar to create events using natural language.'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={provider}
            label="Provider"
            onChange={(event) => setProvider(event.target.value as AIProvider)}
          >
            <MenuItem value="anthropic">Anthropic</MenuItem>
            <MenuItem value="openai">OpenAI</MenuItem>
            {geminiNanoAvailable && (
              <MenuItem value="gemini-nano">Gemini Nano</MenuItem>
            )}
          </Select>
        </FormControl>
        {!isGeminiNano && (
          <TextField
            size="small"
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
            sx={{ flex: 1, maxWidth: 400 }}
          />
        )}
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <EventCalendar
          events={events}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          aiHelper={isAiHelperEnabled}
          aiHelperApiKey={apiKey}
          aiHelperProvider={provider}
          aiHelperModel={
            provider === 'anthropic' ? 'claude-3-haiku-20240307' : 'gpt-4o-mini'
          }
          aiHelperDefaultDuration={60}
        />
      </Box>
    </Box>
  );
}
