import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  useGridApiContext,
  PromptField,
  PromptFieldRecord,
  PromptFieldControl,
  PromptFieldSend,
  IS_SPEECH_RECOGNITION_SUPPORTED,
  GridShadowScrollArea,
} from '@mui/x-data-grid-premium';
import {
  mockPromptResolver,
  randomBoolean,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomInt,
  randomJobTitle,
  randomPhoneNumber,
  randomTraderName,
  useDemoData,
} from '@mui/x-data-grid-generator';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton, { iconButtonClasses } from '@mui/material/IconButton';
import ReplayIcon from '@mui/icons-material/Replay';
import AssistantIcon from '@mui/icons-material/Assistant';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import { SvgIconProps } from '@mui/material/SvgIcon';
import CircularProgress from '@mui/material/CircularProgress';

const PROMPT_SUGGESTIONS = [
  'Sort by name',
  'Show people from the EU',
  'Sort by company name and employee name',
  'Order companies by amount of people',
];

function createExamples(column: string) {
  switch (column) {
    case 'name':
      return Array.from({ length: 5 }, () => randomTraderName());
    case 'email':
      return Array.from({ length: 5 }, () => randomEmail());
    case 'position':
      return Array.from({ length: 5 }, () => randomJobTitle());
    case 'company':
      return Array.from({ length: 5 }, () => randomCompanyName());
    case 'salary':
      return Array.from({ length: 5 }, () => randomInt(30000, 80000));
    case 'phone':
      return Array.from({ length: 5 }, () => randomPhoneNumber());
    case 'country':
      return Array.from({ length: 5 }, () => randomCountry());
    case 'dateCreated':
      return Array.from({ length: 5 }, () => randomCreatedDate());
    case 'isAdmin':
      return Array.from({ length: 5 }, () => randomBoolean());
    default:
      return [];
  }
}

const VISIBLE_FIELDS = ['name', 'email', 'position', 'company', 'salary'];

function AssistantPanel({
  open,
  onClose,
  anchorEl,
}: {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}) {
  const apiRef = useGridApiContext();
  const [promptHistory, setPromptHistory] = React.useState<
    {
      value: string;
      time: Date;
      status: 'success' | 'error' | 'pending';
    }[]
  >([]);
  const [suggestionsExpanded, setSuggestionsExpanded] = React.useState(false);
  const promptHistoryScrollAreaRef = React.useRef<HTMLDivElement>(null);

  const context = React.useMemo(
    () => apiRef.current.unstable_getPromptContext(),
    [apiRef],
  );

  const suggestions = React.useMemo(() => {
    return suggestionsExpanded ? PROMPT_SUGGESTIONS : PROMPT_SUGGESTIONS.slice(0, 2);
  }, [suggestionsExpanded]);

  const handlePrompt = React.useCallback(
    async (prompt: string, promptContext = context) => {
      const promptId = Date.now();
      apiRef.current.setLoading(true);

      setPromptHistory((prev) => [
        ...prev,
        {
          value: prompt,
          time: new Date(promptId),
          status: 'pending',
        },
      ]);

      try {
        const result = await mockPromptResolver(prompt, promptContext);
        apiRef.current.unstable_applyPromptResult(result);
        setPromptHistory((prev) =>
          prev.map((item) =>
            item.time.getTime() === promptId ? { ...item, status: 'success' } : item,
          ),
        );
        return result;
      } catch (error) {
        console.error(error);
        setPromptHistory((prev) =>
          prev.map((item) =>
            item.time.getTime() === promptId ? { ...item, status: 'error' } : item,
          ),
        );
        return undefined;
      } finally {
        apiRef.current.setLoading(false);
      }
    },
    [apiRef, context],
  );

  // Scroll to the bottom of the prompt history when the panel opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        promptHistoryScrollAreaRef.current?.scrollTo({
          top: promptHistoryScrollAreaRef.current?.scrollHeight,
          behavior: 'instant',
        });
      }, 0);
    }
  }, [open]);

  // Scroll to the bottom of the prompt history when the prompt history changes
  React.useEffect(() => {
    if (promptHistoryScrollAreaRef.current) {
      promptHistoryScrollAreaRef.current.scrollTo({
        top: promptHistoryScrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [promptHistory]);

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            width: 400,
          },
        },
      }}
      disableEnforceFocus
      disableRestoreFocus
    >
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            pl: 2,
            pr: 1.5,
            py: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            AI Assistant
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 220,
          }}
        >
          {promptHistory.length > 0 ? (
            <GridShadowScrollArea
              ref={promptHistoryScrollAreaRef}
              style={{ flexShrink: 0, height: '100%' }}
            >
              <List dense sx={{ py: 0 }}>
                {promptHistory.map((prompt, index) => {
                  const isMostRecent = index === promptHistory.length - 1;
                  const time = prompt.time.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  let iconColor: SvgIconProps['color'] = isMostRecent
                    ? 'primary'
                    : 'action';

                  if (prompt.status === 'error') {
                    iconColor = 'error';
                  }

                  return (
                    <Fade
                      in
                      timeout={200}
                      easing="ease-in-out"
                      key={`${prompt.value}-${index}`}
                    >
                      <ListItem
                        secondaryAction={
                          <Tooltip title="Run again">
                            <IconButton
                              size="small"
                              onClick={() => handlePrompt(prompt.value)}
                            >
                              <ReplayIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        sx={(theme) => ({
                          opacity: prompt.status === 'pending' ? 0.5 : 1,
                          [`& .${iconButtonClasses.root}`]: {
                            transition: theme.transitions.create(['opacity'], {
                              duration: 200,
                              easing: 'ease-in-out',
                            }),
                          },
                          [`&:not(:hover) .${iconButtonClasses.root}`]: {
                            opacity: 0,
                          },
                        })}
                      >
                        <ListItemIcon
                          sx={{ pt: 2, minWidth: 36, alignSelf: 'flex-start' }}
                        >
                          {prompt.status === 'pending' ? (
                            <CircularProgress size={20} thickness={6} />
                          ) : (
                            <AutoAwesomeIcon fontSize="small" color={iconColor} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={prompt.value}
                          secondary={
                            <Stack component="span" direction="column">
                              {time}
                              <Typography variant="caption" color="error">
                                {prompt.status === 'error'
                                  ? 'Failed to process prompt'
                                  : ''}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    </Fade>
                  );
                })}
              </List>
            </GridShadowScrollArea>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              No prompt history
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <PromptField onPrompt={handlePrompt} onError={console.error}>
            <PromptFieldControl
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  // Prevents the `multiline` TextField from adding a new line
                  event.preventDefault();
                }
              }}
              render={({ ref, ...controlProps }, state) => (
                <TextField
                  {...controlProps}
                  fullWidth
                  inputRef={ref}
                  aria-label="Prompt"
                  placeholder={
                    state.recording
                      ? 'Listening for prompt…'
                      : 'Type or record a prompt…'
                  }
                  size="small"
                  multiline
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          {IS_SPEECH_RECOGNITION_SUPPORTED ? (
                            <Tooltip
                              title={state.recording ? 'Stop recording' : 'Record'}
                            >
                              <PromptFieldRecord
                                size="small"
                                edge="start"
                                color={state.recording ? 'primary' : 'default'}
                              >
                                <MicIcon fontSize="small" />
                              </PromptFieldRecord>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Speech recognition is not supported in this browser">
                              <MicOffIcon fontSize="small" />
                            </Tooltip>
                          )}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Send">
                            <span>
                              <PromptFieldSend
                                size="small"
                                edge="end"
                                color="primary"
                              >
                                <SendIcon fontSize="small" />
                              </PromptFieldSend>
                            </span>
                          </Tooltip>
                        </InputAdornment>
                      ),
                      ...controlProps.slotProps?.input,
                    },
                    ...controlProps.slotProps,
                  }}
                />
              )}
            />
          </PromptField>
        </Box>

        <Stack
          direction="column"
          sx={{
            p: 1,
            pb: 1.25,
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: 0.75,
          }}
        >
          <Typography variant="caption">Suggestions for you</Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {suggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                variant="outlined"
                label={suggestion}
                icon={<AutoAwesomeIcon style={{ fontSize: '1rem' }} />}
                onClick={() => handlePrompt(suggestion)}
              />
            ))}
            {!suggestionsExpanded && (
              <Chip
                variant="outlined"
                onClick={() => setSuggestionsExpanded(true)}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>More</span>
                    <ExpandMoreIcon sx={{ fontSize: '1rem', ml: 0.25, mr: -0.5 }} />
                  </Box>
                }
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Popover>
  );
}

function ToolbarWithPromptInput() {
  const [assistantPanelOpen, setAssistantPanelOpen] = React.useState(false);
  const assistantAnchorRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Toolbar aria-labelledby="grid-label">
      <Typography id="grid-label" fontWeight="medium" sx={{ ml: 0.75, mr: 'auto' }}>
        Data Grid with AI Assistant
      </Typography>

      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="AI Assistant">
        <ToolbarButton
          ref={assistantAnchorRef}
          onClick={() => setAssistantPanelOpen(true)}
        >
          <AssistantIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

      <AssistantPanel
        open={assistantPanelOpen}
        onClose={() => setAssistantPanelOpen(false)}
        anchorEl={assistantAnchorRef.current}
      />
    </Toolbar>
  );
}

export default function PromptWithExamples() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => ({
        ...column,
        unstable_examples: createExamples(column.field),
      })),
    [data.columns],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        columns={columns}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
        showToolbar
      />
    </div>
  );
}
