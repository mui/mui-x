import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  PromptField,
  PromptFieldRecord,
  PromptFieldControl,
  PromptFieldSend,
  IS_SPEECH_RECOGNITION_SUPPORTED,
  useGridApiContext,
} from '@mui/x-data-grid-premium';
import { styled } from '@mui/material/styles';
import { mockPromptResolver, useDemoData } from '@mui/x-data-grid-generator';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const StyledToolbar = styled(Toolbar)({
  minHeight: 'auto',
  justifyContent: 'center',
});

const SUCCESS_STATUS_TEXT = 'Prompt applied';

function CustomToolbar() {
  const apiRef = useGridApiContext();
  const [statusText, setStatusText] = React.useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const placeholder = IS_SPEECH_RECOGNITION_SUPPORTED
    ? 'Type or record a prompt…'
    : 'Type a prompt…';

  const handlePromptSubmit = async (prompt: string) => {
    setStatusText(null);
    const response = await apiRef.current.aiAssistant.processPrompt(prompt);
    if (response instanceof Error) {
      setStatusText(response.message);
      setSnackbarOpen(true);
    } else {
      setStatusText(SUCCESS_STATUS_TEXT);
      setSnackbarOpen(true);
    }
  };

  return (
    <StyledToolbar>
      <PromptField onSubmit={handlePromptSubmit}>
        <PromptFieldControl
          render={({ ref, ...controlProps }, state) => (
            <TextField
              {...controlProps}
              inputRef={ref}
              aria-label="Prompt"
              placeholder={state.recording ? 'Listening for prompt…' : placeholder}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={statusText === SUCCESS_STATUS_TEXT ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {statusText}
        </Alert>
      </Snackbar>
    </StyledToolbar>
  );
}

export default function GridPromptField() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        aiAssistant
        onPrompt={mockPromptResolver}
        showToolbar
      />
    </div>
  );
}
