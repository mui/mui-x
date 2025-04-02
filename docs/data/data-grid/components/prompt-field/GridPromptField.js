import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  PromptField,
  PromptFieldRecord,
  PromptFieldControl,
  PromptFieldSend,
  IS_SPEECH_RECOGNITION_SUPPORTED,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';

function CustomToolbar() {
  return (
    <Toolbar>
      <PromptField>
        <PromptFieldControl
          render={({ ref, ...controlProps }, state) => (
            <TextField
              {...controlProps}
              inputRef={ref}
              aria-label="Prompt"
              placeholder={
                state.recording
                  ? 'Listening for prompt…'
                  : 'Type or record a prompt…'
              }
              size="small"
              sx={{ width: 320 }}
              slotProps={{
                input: {
                  startAdornment: IS_SPEECH_RECOGNITION_SUPPORTED ? (
                    <InputAdornment position="start">
                      <Tooltip title={state.recording ? 'Stop recording' : 'Record'}>
                        <PromptFieldRecord
                          render={
                            <IconButton
                              size="small"
                              edge="start"
                              color={state.recording ? 'primary' : 'default'}
                            />
                          }
                        >
                          <MicIcon fontSize="small" />
                        </PromptFieldRecord>
                      </Tooltip>
                    </InputAdornment>
                  ) : (
                    <Tooltip title="Speech recognition is not supported in this browser">
                      <MicOffIcon fontSize="small" />
                    </Tooltip>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Send">
                        <span>
                          <PromptFieldSend
                            render={
                              <IconButton size="small" edge="end" color="primary" />
                            }
                          >
                            <SendIcon fontSize="small" />
                          </PromptFieldSend>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
      </PromptField>
    </Toolbar>
  );
}

export default function GridPromptField() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        enableAiAssistant
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}
