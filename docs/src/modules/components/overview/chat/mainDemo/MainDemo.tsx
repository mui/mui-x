import * as React from 'react';
import HighlightedCodeWithTabs from '@mui/internal-core-docs/HighlightedCodeWithTabs';
import { ThemeOptionsContext } from '@mui/internal-core-docs/ThemeContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ChatBoxPlayground from 'docs/data/chat/basics/chatbox/ChatBoxPlayground';
import { getSoftEdgesTheme } from '../theme/softEdgesTheme';
import { getNeutralVibesTheme } from '../theme/neutralVibesTheme';
import { darkGrey } from '../theme/colors';
import ViewToggleGroup, { ChatView } from './ViewToggleGroup';
import { chatOverviewDemos, getChatOverviewDemoSourceUrl } from './demoConfigs';
import MessengerDemo from './MessengerDemo';
import AgentDemo from './AgentDemo';
import CaptionsDemo from './CaptionsDemo';
import CopilotDemo from './CopilotDemo';
import WidgetDemo from './WidgetDemo';

type CustomThemeName = 'default' | 'softEdges' | 'neutralVibes';

const BASIC_PLAYGROUND_DEFAULTS = {
  conversationList: false,
  conversationHeader: false,
  suggestions: false,
} as const;

// Use CSS variables to avoid first load light/dark blink.
const darkThemeManagement = {
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
};

const themeOptions: { value: CustomThemeName; label: string }[] = [
  { value: 'default', label: 'Default theme' },
  { value: 'softEdges', label: 'Soft edges' },
  { value: 'neutralVibes', label: 'Neutral vibes' },
];

// Keep mode-based sx callbacks aligned with the active CSS variables scheme.
function createDefaultTheme(mode: 'light' | 'dark') {
  const theme = createTheme(darkThemeManagement);
  Object.assign(theme, theme.colorSchemes[mode]);
  return theme;
}

function createDarkDefaultTheme() {
  const theme = createTheme({
    ...darkThemeManagement,
    colorSchemes: {
      light: true,
      dark: {
        palette: {
          grey: darkGrey,
          text: { primary: darkGrey[900], secondary: darkGrey[700] },
          background: { default: darkGrey[50], paper: '#121113' },
        },
      },
    },
  });
  Object.assign(theme, theme.colorSchemes.dark);
  return theme;
}

export default function MainDemo() {
  const { paletteMode } = React.useContext(ThemeOptionsContext);
  const [selectedView, setSelectedView] = React.useState<ChatView>('basic');
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const selectedDemo = chatOverviewDemos[selectedView];
  const selectedDemoSourceUrl = getChatOverviewDemoSourceUrl(selectedView);

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value as CustomThemeName);
  };

  const mode = selectedView === 'captions' ? 'dark' : paletteMode;
  const baseTheme = createDefaultTheme(mode);
  const softEdgesTheme = getSoftEdgesTheme(mode);
  const neutralVibesTheme = getNeutralVibesTheme(mode);

  const getThemeByName = (name: CustomThemeName) => {
    switch (name) {
      case 'softEdges':
        return softEdgesTheme;
      case 'neutralVibes':
        return neutralVibesTheme;
      default:
        return baseTheme;
    }
  };

  // CaptionsDemo always uses dark mode to match Google Meet style,
  // but still respects the selected custom theme (softEdges, neutralVibes, etc.)
  const getDarkThemeByName = (name: CustomThemeName) => {
    switch (name) {
      case 'softEdges':
        return getSoftEdgesTheme('dark');
      case 'neutralVibes':
        return getNeutralVibesTheme('dark');
      default:
        return createDarkDefaultTheme();
    }
  };

  let demoContent: React.ReactNode;

  if (selectedView === 'basic') {
    demoContent = (
      <ChatBoxPlayground hideHeader defaultControlsCollapsed defaults={BASIC_PLAYGROUND_DEFAULTS} />
    );
  } else if (selectedView === 'messenger') {
    demoContent = (
      <Paper variant="outlined" elevation={0} sx={{ height: 600, width: '100%' }}>
        <MessengerDemo />
      </Paper>
    );
  } else if (selectedView === 'agent') {
    demoContent = (
      <Paper variant="outlined" elevation={0} sx={{ height: 600, width: '100%' }}>
        <AgentDemo />
      </Paper>
    );
  } else if (selectedView === 'widget') {
    demoContent = (
      <Paper
        variant="outlined"
        elevation={0}
        sx={{ height: 760, width: '100%', position: 'relative', overflow: 'hidden' }}
      >
        <WidgetDemo />
      </Paper>
    );
  } else if (selectedView === 'copilot') {
    demoContent = (
      <Paper
        variant="outlined"
        elevation={0}
        sx={{ height: 600, width: '100%', overflow: 'hidden' }}
      >
        <CopilotDemo />
      </Paper>
    );
  } else {
    demoContent = (
      <ThemeProvider theme={() => getDarkThemeByName(selectedTheme)}>
        <Paper
          variant="outlined"
          elevation={0}
          sx={{ height: 600, width: '100%', overflow: 'hidden' }}
        >
          <CaptionsDemo />
        </Paper>
      </ThemeProvider>
    );
  }

  return (
    <Stack spacing={1} sx={{ p: 1, width: '100%', mb: 6 }}>
      {/* Toolbar: view toggle + theme selector */}
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}
      >
        <ViewToggleGroup selected={selectedView} onToggleChange={setSelectedView} />
        <Select
          value={selectedTheme}
          defaultValue="default"
          onChange={handleThemeChange}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {themeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <ThemeProvider theme={() => getThemeByName(selectedTheme)}>{demoContent}</ThemeProvider>
      <Paper variant="outlined" elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            px: 2,
            py: 1.5,
            alignItems: { sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <div>
            <Typography variant="overline" color="text.secondary">
              Example code
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {selectedDemo.title}
            </Typography>
          </div>
          <Button
            size="small"
            href={selectedDemoSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<ArrowForwardIcon />}
          >
            More info
          </Button>
        </Stack>
        <Box
          sx={{
            '& pre': {
              margin: 0,
              borderRadius: 0,
              maxWidth: 'none',
            },
            '& .MuiCode-root': {
              maxHeight: 360,
              overflow: 'auto',
            },
          }}
        >
          <HighlightedCodeWithTabs tabs={selectedDemo.tabs} />
        </Box>
      </Paper>
    </Stack>
  );
}
