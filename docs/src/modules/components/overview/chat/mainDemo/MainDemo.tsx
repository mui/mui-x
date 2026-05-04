import * as React from 'react';
import HighlightedCodeWithTabs from '@mui/internal-core-docs/HighlightedCodeWithTabs';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { getSoftEdgesTheme } from '../theme/softEdgesTheme';
import { getNeutralVibesTheme } from '../theme/neutralVibesTheme';
import { darkGrey } from '../theme/colors';
import ViewToggleGroup, { ChatView } from './ViewToggleGroup';
import { chatOverviewDemos, getChatOverviewDemoSourceUrl } from './demoConfigs';
import MessengerDemo from './MessengerDemo';
import AgentDemo from './AgentDemo';
import CaptionsDemo from './CaptionsDemo';
import WidgetDemo from './WidgetDemo';

type CustomThemeName = 'default' | 'softEdges' | 'neutralVibes';

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

export default function MainDemo() {
  const brandingTheme = useTheme();
  const [selectedView, setSelectedView] = React.useState<ChatView>('messenger');
  const [selectedTheme, setSelectedTheme] = React.useState<CustomThemeName>('default');
  const selectedDemo = chatOverviewDemos[selectedView];
  const selectedDemoSourceUrl = getChatOverviewDemoSourceUrl(selectedView);

  const handleThemeChange = (event: SelectChangeEvent) => {
    setSelectedTheme(event.target.value as CustomThemeName);
  };

  const mode = selectedView === 'captions' ? 'dark' : brandingTheme.palette.mode;
  const baseTheme = createTheme(darkThemeManagement, { palette: { mode } });
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
        return createTheme(darkThemeManagement, {
          palette: {
            mode: 'dark',
            grey: darkGrey,
            text: { primary: darkGrey[900], secondary: darkGrey[700] },
            background: { default: darkGrey[50], paper: '#121113' },
          },
        });
    }
  };

  let demoContent: React.ReactNode;

  if (selectedView === 'messenger') {
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
  } else {
    demoContent = (
      <ThemeProvider theme={getDarkThemeByName(selectedTheme)}>
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
      <ThemeProvider theme={getThemeByName(selectedTheme)}>{demoContent}</ThemeProvider>
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
