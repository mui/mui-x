import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { resources } from '../../../data/scheduler/datasets/personal-agenda';

export default function FullScreenAiHelper() {
  const [events, setEvents] = React.useState([]);
  const [apiKey, setApiKey] = React.useState('');
  const [provider, setProvider] = React.useState('anthropic');

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
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Provider</InputLabel>
          <Select
            value={provider}
            label="Provider"
            onChange={(event) => setProvider(event.target.value)}
          >
            <MenuItem value="anthropic">Anthropic</MenuItem>
            <MenuItem value="openai">OpenAI</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="API Key"
          type="password"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
          sx={{ width: 300, '& .MuiInputBase-root': { height: 40 } }}
        />
      </Box>

      <div style={{ flex: 1, minHeight: 0 }}>
        <EventCalendar
          events={events}
          resources={resources}
          onEventsChange={setEvents}
          aiHelper={!!apiKey}
          aiHelperApiKey={apiKey}
          aiHelperProvider={provider}
          aiHelperModel={provider === 'anthropic' ? 'claude-3-haiku-20240307' : 'gpt-4o-mini'}
          aiHelperDefaultDuration={60}
        />
      </div>
    </div>
  );
}
