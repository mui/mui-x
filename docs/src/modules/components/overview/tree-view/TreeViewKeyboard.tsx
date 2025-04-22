import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import KeyboardSvg, { SelectedKey } from '../KeyboardSvg';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [
      { id: 'tree-view-community', label: 'mui/x-tree-view' },
      { id: 'tree-view-pro', label: 'x-tree-view-pro' },
    ],
  },
];

export default function TreeViewKeyboard() {
  const [selectedKey, setSelectedKey] = React.useState<SelectedKey | null>(null);
  const ref = React.useRef(null);

  const brandingTheme = useTheme();
  const theme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const handleKeySelection = (_event: React.SyntheticEvent, key: SelectedKey | null) => {
    let sectionContent: null | HTMLElement = ref.current;
    if (key) {
      if (ref.current) {
        if (!(ref.current as HTMLElement).contains(document.activeElement)) {
          sectionContent = (ref.current as HTMLElement).querySelector('li') as HTMLElement;
        } else {
          sectionContent = (ref.current as HTMLElement).querySelector(
            ' .Mui-focused',
          ) as HTMLElement;
        }
      }

      const keydownEvent = new KeyboardEvent('keydown', {
        ...key,
        bubbles: true,
        cancelable: true,
      });
      keydownEvent.preventDefault();

      if (sectionContent) {
        sectionContent.focus();
        sectionContent.dispatchEvent(keydownEvent);
      }
    }
    setSelectedKey(key);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Divider />
      <Stack spacing={6} py={8} sx={{ width: '100%' }}>
        <Stack spacing={1} sx={{ width: '100%', maxWidth: { xs: '500px', md: '100%' } }}>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body2" color="primary" fontWeight="semiBold">
            Accessibility
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            Inclusive by design
          </Typography>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body1" color="text.secondary">
            The MUI X Tree View feature advanced keyboard support that&apos;s compliant with WCAG
            and WAI-ARIA standards, so users who require assistive technology can navigate your
            interface with ease.
          </Typography>
          <Button
            size="small"
            href="/x/react-tree-view/accessibility/"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: 'fit-content' }}
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            More about accessibility
          </Button>
        </Stack>
        <Paper
          variant="outlined"
          sx={(currentTheme) => ({
            height: '100%',
            width: '100%',
            backgroundImage: `linear-gradient(${currentTheme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${currentTheme.palette.divider} 1px, ${currentTheme.palette.background.paper} 1px)`,
            backgroundSize: '20px 20px',
            p: 2,
          })}
        >
          <Stack
            spacing={2}
            sx={{ width: '100%', maxWidth: { xs: '500px', md: '100%' } }}
            direction={{ lg: 'row', xs: 'column' }}
            justifyContent="space-evenly"
            alignItems={{ xs: 'center', lg: 'flex-start' }}
          >
            <ThemeProvider theme={theme}>
              <Paper
                variant="outlined"
                sx={{ p: 2, minHeight: 150, width: '100%', maxWidth: 350, minWidth: 300 }}
              >
                <RichTreeView
                  multiSelect
                  checkboxSelection
                  items={MUI_X_PRODUCTS}
                  defaultExpandedItems={['tree-view']}
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
                />
              </Paper>
            </ThemeProvider>
            <Box sx={{ height: 'fit-content', width: '100%', maxWidth: 350, minWidth: 300 }}>
              <KeyboardSvg
                handleKeySelection={handleKeySelection}
                selectedKey={selectedKey}
                additionalSelected={['space', 'a', 't', 'm', 'x']}
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </LocalizationProvider>
  );
}
