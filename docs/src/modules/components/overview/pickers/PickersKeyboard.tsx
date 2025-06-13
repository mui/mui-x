import * as React from 'react';
import dayjs from 'dayjs';
import SectionHeadline from 'docs/src/components/typography/SectionHeadline';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { FieldSelectedSections } from '@mui/x-date-pickers/models';
import KeyboardSvg, { SelectedKey } from '../KeyboardSvg';

export default function Keyboard() {
  const [selectedKey, setSelectedKey] = React.useState<SelectedKey | null>(null);
  const ref = React.useRef(null);
  const selectedSection = React.useRef<FieldSelectedSections>(0);

  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const handleKeySelection = (event: React.SyntheticEvent, key: SelectedKey | null) => {
    const sectionContent = (ref.current as any).querySelector(
      `.MuiPickersSectionList-section[data-sectionindex="${selectedSection.current || 0}"] .MuiPickersSectionList-sectionContent`,
    );
    sectionContent.focus();

    if (key) {
      const keydownEvent = new KeyboardEvent('keydown', {
        ...key,
        bubbles: true,
        cancelable: true,
      });

      sectionContent.dispatchEvent(keydownEvent);

      if (key.key === 'Backspace') {
        sectionContent.textContent = '';
        const inputEvent = new InputEvent('input', {
          data: '',
          inputType: 'insertText',
          bubbles: true,
          cancelable: true,
        });

        sectionContent.dispatchEvent(inputEvent);
      } else if (key?.keyCode && key?.keyCode >= 49 && key?.keyCode <= 58) {
        sectionContent.textContent = key.key;
        const inputEvent = new InputEvent('input', {
          data: key.key,
          inputType: 'insertText',
          bubbles: true,
          cancelable: true,
        });
        sectionContent.dispatchEvent(inputEvent);
      }
    }
    setSelectedKey(key);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Divider />
      <Stack direction={{ md: 'row', xs: 'column' }} alignItems={'center'} spacing={6} py={8}>
        <Stack sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          <SectionHeadline
            overline="Accessibility"
            title={
              // eslint-disable-next-line material-ui/no-hardcoded-labels
              <Typography variant="h2" fontSize="1.625rem">
                Assistive technology support
              </Typography>
            }
            description="The MUI X Date Pickers feature advanced keyboard support that's compliant with WCAG and WAI-ARIA standards, so users who require assistive technology can navigate your interface with ease."
          />
          <Button
            size="small"
            href="/x/react-date-pickers/accessibility/"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            More about accessibility
          </Button>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '500px' }}>
          <ThemeProvider theme={theme}>
            <DateField
              defaultValue={dayjs('12/12/2023')}
              ref={ref}
              onKeyDown={(event: React.KeyboardEvent) => {
                setSelectedKey({
                  key: event.key,
                  code: event.code,
                  location: event.location,
                });
              }}
              onKeyUp={() => {
                setSelectedKey(null);
              }}
              onSelectedSectionsChange={(newSelectedSection) => {
                selectedSection.current = newSelectedSection;
              }}
            />
          </ThemeProvider>
          <KeyboardSvg handleKeySelection={handleKeySelection} selectedKey={selectedKey} />
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
}
