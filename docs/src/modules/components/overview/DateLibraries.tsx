import * as React from 'react';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const dateLibraries = [
  {
    name: 'Dayjs',
    link: '/static/x/date-libraries/dayjs.png',
    adapter: 'AdapterDayjs',
    value: "dayjs('2024-04-17')",
  },
  {
    name: 'Luxon',
    link: '/static/x/date-libraries/luxon.png',
    adapter: 'AdapterLuxon',
    value: "DateTime.fromISO('2024-04-17')",
  },
  {
    name: 'date-fns',
    link: '/static/x/date-libraries/datefns.png',
    adapter: 'AdapterDateFns',
    value: "new Date('2024-04-17')",
  },
  {
    name: 'Moment.js',
    link: '/static/x/date-libraries/momentjs.png',
    adapter: 'AdapterMoment',
    value: "moment('2024-04-17')",
  },
];

export default function DateLibraries() {
  const [selectedLibrary, setSelectedLibrary] = React.useState(0);

  const handleLibrarySwitch = (_event: React.MouseEvent<HTMLElement>, library: number) => {
    if (library !== null) {
      setSelectedLibrary(library);
    }
  };
  return (
    <React.Fragment>
      <Divider />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 2, md: 6 }}
        py={8}
        alignItems="center"
      >
        <Stack spacing={2} sx={{ minWidth: '300px', maxWidth: { xs: '500px', md: '400px' } }}>
          <SectionHeadline
            overline="Date libraries"
            title={
              <Typography variant="h2" fontSize="1.625rem">
                Use your favorite date library
              </Typography>
            }
            description="MUI X Date Pickers integrate smoothly with the most popular date libraries available."
          />
        </Stack>
        <Stack
          alignItems={{ xs: 'flex-start', sm: 'center', md: 'flex-start' }}
          sx={{
            width: { xs: '100%' },
          }}
        >
          <Stack direction="row" spacing={2} flexGrow={1}>
            <ToggleButtonGroup
              value={selectedLibrary}
              onChange={handleLibrarySwitch}
              size="small"
              aria-label="Select language"
              exclusive
            >
              {dateLibraries.map((library, index) => (
                <ToggleButton key={index} value={index} sx={{ gap: 1 }} title={library.name}>
                  <img src={library.link} width={16} height={16} alt={library.name} />
                  <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>{library.name}</Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Divider orientation="vertical" flexItem />
            <Button
              size="small"
              href="/x/react-date-pickers/base-concepts/#date-library"
              endIcon={<ArrowForwardIcon />}
            >
              More info
            </Button>
          </Stack>
          <HighlightedCode
            sx={{ width: '100%', maxWidth: '600px' }}
            code={[
              `<LocalizationProvider adapter={${dateLibraries[selectedLibrary].adapter}}>`,
              `  <DatePicker defaultValue={${dateLibraries[selectedLibrary].value}} />`,
              `</LocalizationProvider>`,
            ].join('\n')}
            language="jsx"
            copyButtonHidden
          />
        </Stack>
      </Stack>
      <Divider />
    </React.Fragment>
  );
}
