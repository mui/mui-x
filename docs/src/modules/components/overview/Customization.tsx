import * as React from 'react';
import dayjs from 'dayjs';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stack from '@mui/material/Stack';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomLayoutRangePicker from './CustomLayoutRangePicker';
import { getMD3Theme } from './themes/md3';
import { getCustomTheme } from './themes/customTheme';

type Theme = 'default' | 'md3' | 'custom';

interface ToggleCustomThemeProps {
  selectedTheme: Theme;
  changeTheme: (newTheme: Theme) => void;
  isMd: boolean;
}

function ToggleCustomTheme({ selectedTheme, changeTheme, isMd }: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        order: { xs: 1, md: 2 },
      }}
    >
      <ToggleButtonGroup
        color="primary"
        orientation={isMd ? 'vertical' : 'horizontal'}
        exclusive
        value={selectedTheme}
        onChange={(e, newTheme) => changeTheme(newTheme)}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',

          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
        size="small"
      >
        <ToggleButton value="custom">
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom
        </ToggleButton>
        <ToggleButton value="md3">
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Material Design 3
        </ToggleButton>
        <ToggleButton value="default">Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

function CustomTheme() {
  const [selectedTheme, setSelectedTheme] = React.useState<'default' | 'md3' | 'custom'>('default');

  const brandingTheme = useTheme();
  const theme = createTheme(getCustomTheme(brandingTheme.palette.mode));

  const md3Theme = createTheme(getMD3Theme(brandingTheme.palette.mode));
  const defaultTheme = createTheme({ palette: { mode: brandingTheme.palette.mode } });

  const changeTheme = (newTheme: Theme) => {
    setSelectedTheme(newTheme);
  };
  const isMd = useMediaQuery(brandingTheme.breakpoints.up('md'));

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { xs: 'flex-start', md: 'center' },
          alignItems: 'center',
          gap: 4,
          minHeight: '560px',
        }}
      >
        <ToggleCustomTheme selectedTheme={selectedTheme} changeTheme={changeTheme} isMd={isMd} />

        <Box sx={{ order: { xs: 2, md: 1 } }}>
          <ThemeProvider
            theme={
              selectedTheme === 'custom' ? theme : selectedTheme === 'md3' ? md3Theme : defaultTheme
            }
          >
            {selectedTheme === 'custom' ? (
              <Card elevation={0} sx={{ padding: 0 }}>
                <CustomLayoutRangePicker />
              </Card>
            ) : (
              <Card elevation={0} variant="outlined">
                <StaticDatePicker
                  defaultValue={dayjs('2024-04-17')}
                  views={['year', 'month', 'day']}
                />
              </Card>
            )}
          </ThemeProvider>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default function Customization() {
  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ maxWidth: { xs: '500px', md: '100%' } }}>
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Customization
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
          >
            Highly customizable components
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Easily adaptable to any style, our components leverage Material Design for
            out-of-the-box elegance and support extensive customization to perfectly align with your
            branding.
          </Typography>
          <Box
            component="div"
            sx={(brandingTheme) => ({
              display: 'flex',

              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              flexGrow: 1,
              width: '100%',
              padding: 2,
              background: (brandingTheme.vars || brandingTheme).palette.gradients.linearSubtle,
            })}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <CustomTheme />
            </LocalizationProvider>
          </Box>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
