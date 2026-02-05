import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';

import { defaultVisibleDate, resources } from '../datasets/personal-agenda';

const API_KEY = process.env.NEXT_PUBLIC_SCHEDULER_AI_API_KEY ?? '';

export default function AiHelperDemo() {
  const [events, setEvents] = React.useState([]);
  const [provider, setProvider] = React.useState('anthropic');
  const [geminiNanoAvailable, setGeminiNanoAvailable] = React.useState(false);

  React.useEffect(() => {
    async function checkAvailability() {
      try {
        if (typeof globalThis.LanguageModel !== 'undefined') {
          const availability = await globalThis.LanguageModel.availability();
          setGeminiNanoAvailable(availability !== 'unavailable');
        }
      } catch {
        // API not available
      }
    }
    checkAvailability();
  }, []);

  const isGeminiNano = provider === 'gemini-nano';
  const isAiHelperEnabled = isGeminiNano || !!API_KEY;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Provider</InputLabel>
        <Select
          value={provider}
          label="Provider"
          onChange={(event) => setProvider(event.target.value)}
        >
          <MenuItem value="anthropic">Anthropic</MenuItem>
          {geminiNanoAvailable && (
            <MenuItem value="gemini-nano">Gemini Nano</MenuItem>
          )}
        </Select>
        <FormHelperText>
          Click the sparkle button in the toolbar to create events using natural
          language.
        </FormHelperText>
      </FormControl>

      <Box sx={{ height: 600, width: '100%' }}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          aiHelper={isAiHelperEnabled}
          aiHelperApiKey={API_KEY}
          aiHelperProvider={provider}
          aiHelperModel={
            provider === 'anthropic' ? 'claude-3-haiku-20240307' : undefined
          }
          aiHelperDefaultDuration={60}
        />
      </Box>
    </Box>
  );
}
