import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ro';
import 'dayjs/locale/zh-cn';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
// @ts-ignore
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { roRO, enUS, zhCN } from '@mui/x-date-pickers/locales';
import InfoCard from './InfoCard';
import WorldMapSvg, { ContinentClickHandler } from './WorldMapSvg';

dayjs.extend(utc);
dayjs.extend(timezone);

const StyledDemoContainer = styled(Paper)({
  flexGrow: 1,
  height: '100%',
});

const internationalizationFeatures = [
  {
    title: 'Support for multiple timezones',
    description: 'Handle global users and events in various geographical locations with ease.',
  },
  {
    title: 'Support for multiple languages',
    description:
      "Support for multiple languages and date formats, adapting to the user's locale for a personalized experience.",
  },
  {
    title: 'Validation and error handling',
    description: 'Advanced validation and error handling out-of-the-box',
  },
];

function TimezonesDemo() {
  const [selectedTimezone, setSelectedTimezone] = React.useState<null | string>(null);
  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const handleContinentClick: ContinentClickHandler = (e, newTimezone) => {
    if (selectedTimezone === newTimezone) {
      setSelectedTimezone(null);
    } else {
      setSelectedTimezone(newTimezone);
    }
  };

  return (
    <Stack>
      <Stack
        p={3}
        spacing={2}
        flexGrow={1}
        sx={{
          background: `${(brandingTheme.vars || brandingTheme).palette.gradients.linearSubtle}`,
        }}
      >
        <Typography fontWeight="semiBold">
          {selectedTimezone ? `Selected timezone: ${selectedTimezone}` : 'Select timezone'}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <DateTimeField
              timezone={selectedTimezone || 'UTC'}
              value={dayjs.utc('2024-06-25T15:30')}
            />
          </ThemeProvider>
        </LocalizationProvider>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>
        <WorldMapSvg onClickContinent={handleContinentClick} selectedTimezone={selectedTimezone} />
      </Box>
    </Stack>
  );
}

type Languages = 'en' | 'ro' | 'zh-cn';
const locales = {
  ro: roRO,
  en: enUS,
  'zh-cn': zhCN,
};

function LanguagesDemo() {
  const brandingTheme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = React.useState<Languages>('zh-cn');

  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const handleLanguageSwitch = (_event: React.MouseEvent<HTMLElement>, newLanguage: Languages) => {
    if (newLanguage !== null) {
      setSelectedLanguage(newLanguage);
    }
  };

  return (
    <Stack spacing={2} alignItems="center" flexGrow={1} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1}>
        <ToggleButtonGroup
          size="small"
          aria-label="Select language"
          value={selectedLanguage}
          exclusive
          onChange={handleLanguageSwitch}
        >
          <ToggleButton value="ro" key="ro">
            Română
          </ToggleButton>
          <ToggleButton value="en" key="en">
            English
          </ToggleButton>
          <ToggleButton value="zh-cn" key="zh-cn">
            日本語
          </ToggleButton>
        </ToggleButtonGroup>
        <Divider orientation="vertical" flexItem />
        <Button
          size="small"
          href="/x/react-date-pickers/localization/"
          endIcon={<ArrowForwardIcon />}
        >
          View all
        </Button>
      </Stack>
      <Paper
        component="div"
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: brandingTheme.spacing(3),
          flexGrow: 1,
          width: '100%',
          background: `${(brandingTheme.vars || brandingTheme).palette.gradients.linearSubtle}`,
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={selectedLanguage}
          localeText={
            locales[selectedLanguage].components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <ThemeProvider theme={theme}>
            <Box sx={{ width: 'fit-content', height: 'fit-content' }}>
              <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
            </Box>
          </ThemeProvider>
        </LocalizationProvider>
      </Paper>
    </Stack>
  );
}

export default function Internationalization() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <React.Fragment>
      <Divider />
      <Stack direction="row" spacing={6} py={4} alignItems="center">
        <Stack spacing={2} sx={{ maxWidth: '450px' }}>
          <SectionHeadline
            overline="Internationalization"
            title={
              <Typography variant="h2" fontSize="1.625rem">
                {internationalizationFeatures[activeItem].title}
              </Typography>
            }
          />
          {internationalizationFeatures.map(({ title, description }, index) => (
            <InfoCard
              title={title}
              description={description}
              key={index}
              active={activeItem === index}
              onClick={() => setActiveItem(index)}
            />
          ))}
        </Stack>
        <Box sx={{ minWidth: '560px' }}>
          {activeItem === 0 && (
            <StyledDemoContainer variant="outlined">
              <TimezonesDemo />
            </StyledDemoContainer>
          )}
          {activeItem === 1 && <LanguagesDemo />}
        </Box>
      </Stack>
    </React.Fragment>
  );
}
