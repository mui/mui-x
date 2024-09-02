import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ro';
import 'dayjs/locale/zh-cn';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { styled, createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import MuiToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimeValidationError } from '@mui/x-date-pickers/models';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { roRO, enUS, zhCN } from '@mui/x-date-pickers-pro/locales';
import InfoCard from './InfoCard';
import WorldMapSvg, { ContinentClickHandler } from './WorldMapSvg';

dayjs.extend(utc);
dayjs.extend(timezone);

const internationalizationFeatures = [
  {
    title: 'Support for multiple timezones',
    description: 'Accommodate global users and events in any geographical location.',
  },
  {
    title: 'Support for multiple languages',
    description:
      "Meet users where they're at with support for common date formats and languages used around the world.",
  },
  {
    title: 'Validation and error handling',
    description: 'We have all use cases covered for you and your end users.',
  },
];

function DemoWrapper({
  children,
  controls: ToolbarControls,
  link,
}: {
  children: React.ReactNode;
  controls?: React.ReactNode;
  link: string;
}) {
  return (
    <Box
      component="div"
      sx={(brandingTheme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        flexGrow: 1,
        width: '100%',
        justifyContent: 'space-between',
        background: (brandingTheme.vars || brandingTheme).palette.gradients.linearSubtle,
      })}
    >
      {children}

      <Paper
        component="div"
        elevation={0}
        sx={(brandingTheme) => ({
          width: '100%',
          border: '1px solid transparent',
          borderTopColor: 'divider',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          display: 'flex',
          padding: brandingTheme.spacing(1),
          justifyContent: 'flex-end',
          alignItems: { md: 'center' },
          gap: 2,
        })}
      >
        {ToolbarControls}
        <Button size="small" href={link} endIcon={<ArrowForwardIcon />}>
          More info
        </Button>
      </Paper>
    </Box>
  );
}

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoWrapper link="/x/react-date-pickers/timezone/">
        <Stack
          spacing={2}
          flexGrow={1}
          justifyContent="center"
          sx={{ maxWidth: '320px', width: '100%' }}
          py={2}
        >
          <Typography fontWeight="semiBold">
            {selectedTimezone ? `Selected timezone: ${selectedTimezone}` : 'Select timezone'}
          </Typography>

          <ThemeProvider theme={theme}>
            <DateTimeField
              timezone={selectedTimezone || 'UTC'}
              value={dayjs.utc('2024-06-25T15:30')}
            />
          </ThemeProvider>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            borderRadius: 0,
            borderTop: '1px solid',
            borderTopColor: 'divider',
            p: 3,
          }}
        >
          <WorldMapSvg
            onClickContinent={handleContinentClick}
            selectedTimezone={selectedTimezone}
          />
        </Paper>
      </DemoWrapper>
    </LocalizationProvider>
  );
}

type Languages = 'en' | 'ro' | 'zh-cn';
const locales = {
  ro: roRO,
  en: enUS,
  'zh-cn': zhCN,
};

const ToggleButton = styled(MuiToggleButton)({
  borderColor: 'transparent',
  padding: '5px 8px',
});
const ToggleButtonGroup = styled(MuiToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(1),
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.lastButton},& .${toggleButtonGroupClasses.middleButton} `]:
    {
      borderRadius: theme.shape.borderRadius,
    },
}));

function Controls({
  selectedLanguage,
  handleLanguageSwitch,
}: {
  selectedLanguage: Languages;
  handleLanguageSwitch: (event: React.MouseEvent<HTMLElement>, newLanguage: Languages) => void;
}) {
  return (
    <Box sx={{ flexGrow: 1 }}>
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
    </Box>
  );
}

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
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={selectedLanguage}
      localeText={
        locales[selectedLanguage].components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DemoWrapper
        controls={
          <Controls
            handleLanguageSwitch={handleLanguageSwitch}
            selectedLanguage={selectedLanguage}
          />
        }
        link="/x/react-date-pickers/localization/"
      >
        <ThemeProvider theme={theme}>
          <Stack
            spacing={2}
            flexGrow={1}
            sx={{ maxWidth: '320px', justifyContent: 'center' }}
            py={2}
          >
            <DatePicker
              defaultValue={dayjs('2024-02-17')}
              slotProps={{ textField: { fullWidth: true } }}
              views={['month']}
            />

            <Paper
              variant="outlined"
              elevation={0}
              sx={{ width: 'fit-content', height: 'fit-content' }}
            >
              <DateCalendar defaultValue={dayjs('2024-04-17')} />
            </Paper>
          </Stack>
        </ThemeProvider>
      </DemoWrapper>
    </LocalizationProvider>
  );
}

const startOfQ12022 = dayjs('2024-01-01T00:00:00.000');
const endOfQ12022 = dayjs('2024-03-31T23:59:59.999');
const fiveAM = dayjs().set('hour', 5).startOf('hour');
const nineAM = dayjs().set('hour', 9).startOf('hour');

const getError = (error: DateTimeValidationError | null) => {
  switch (error) {
    case 'maxDate':
    case 'minDate': {
      return 'Please select a date in the first quarter of 2024';
    }

    case 'invalidDate': {
      return 'Your date is not valid';
    }

    default: {
      return '';
    }
  }
};

function ValidationDemo() {
  const brandingTheme = useTheme();
  const [fieldError, setFieldError] = React.useState<DateTimeValidationError | null>(null);
  const [pickerError, setPickerError] = React.useState<DateTimeValidationError | null>(null);

  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoWrapper link="/x/react-date-pickers/validation/">
        <ThemeProvider theme={theme}>
          <Stack
            spacing={2}
            justifyContent="center"
            flexGrow={1}
            sx={{ width: '100%', maxWidth: '400px' }}
            py={2}
          >
            <DateTimeField
              defaultValue={dayjs('')}
              onError={(newError) => setFieldError(newError)}
              slotProps={{
                textField: {
                  helperText: getError(fieldError),
                  fullWidth: true,
                },
              }}
              minDate={startOfQ12022}
              maxDate={endOfQ12022}
            />
            <DatePicker
              defaultValue={dayjs('2024-07-17')}
              views={['month', 'day']}
              onError={(newError) => setPickerError(newError)}
              slotProps={{
                textField: {
                  helperText: getError(pickerError),
                  fullWidth: true,
                },
              }}
              minDate={startOfQ12022}
              maxDate={endOfQ12022}
            />
            <DateTimeRangePicker defaultValue={[fiveAM, nineAM]} maxTime={fiveAM} />
          </Stack>
        </ThemeProvider>
      </DemoWrapper>
    </LocalizationProvider>
  );
}

export default function Internationalization() {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <React.Fragment>
      <Divider />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} py={8} alignItems="center">
        <Stack
          spacing={2}
          sx={{
            minWidth: '260px',
            maxWidth: { xs: '500px', md: '400px' },
          }}
        >
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
              backgroundColor="subtle"
            />
          ))}
        </Stack>
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: { xs: '100%' },
            maxWidth: { xs: '500px', md: '100%' },
            minHeight: { xs: 0, md: '526px' },
          }}
        >
          {activeItem === 0 && <TimezonesDemo />}
          {activeItem === 1 && <LanguagesDemo />}
          {activeItem === 2 && <ValidationDemo />}
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
