import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { defaultVisibleDate, resources } from '../../../data/scheduler/datasets/personal-agenda';

const API_KEY = process.env.NEXT_PUBLIC_SCHEDULER_AI_API_KEY ?? '';

export default function FullScreenAiHelper() {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={provider}
            label="Provider"
            onChange={(event) => setProvider(event.target.value)}
          >
            <MenuItem value="anthropic">Anthropic</MenuItem>
            {geminiNanoAvailable && <MenuItem value="gemini-nano">Gemini Nano</MenuItem>}
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          {isGeminiNano
            ? 'Gemini Nano runs locally in your browser — no API key needed. Click the sparkle button in the toolbar to create events using natural language.'
            : 'Click the sparkle button in the toolbar to create events using natural language.'}
        </Typography>
      </Box>

      <div style={{ flex: 1, minHeight: 0 }}>
        <EventCalendar
          events={events}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          onEventsChange={setEvents}
          aiHelper={isAiHelperEnabled}
          aiHelperApiKey={API_KEY}
          aiHelperProvider={provider}
          aiHelperModel={provider === 'anthropic' ? 'claude-3-haiku-20240307' : undefined}
          aiHelperDefaultDuration={60}
        />
      </div>
    </div>
  );
}
