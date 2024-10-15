import * as React from 'react';
import dayjs from 'dayjs';
import { ThemeOptions, ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomLayoutRangePicker from './CustomLayoutRangePicker';
import { getMD3Theme } from './themes/md3';
import { getCustomTheme } from './themes/customTheme';
import ConfigToggleButtons from './ConfigToggleButtons';

const MD3Colors = {
  default: '#6750A4',
  red: '#5d3f3f',
  green: '#3e4a36',
};
const MD2Colors = {
  default: '#1976d2',
  purple: '#9c27b0',
  green: '#fe0265',
};
const customColors = {
  default: 'hsl(240, 83%, 65%)',
  orange: '#E08151',
  green: '#306A5E',
};

const getColorScheme = (selectedTheme: Themes) => {
  if (selectedTheme === 'md3') {
    return MD3Colors;
  }
  if (selectedTheme === 'custom') {
    return customColors;
  }

  return MD2Colors;
};

function ColorSwatch({ color }: { color: string }) {
  return (
    <Box
      sx={(theme) => ({
        width: '50px',
        height: '12px',
        background: color,
        borderRadius: theme.shape.borderRadius,
      })}
    />
  );
}

type Themes = 'default' | 'md3' | 'custom';

type PaletteMode = 'light' | 'dark';

function getDefaultTheme(mode: PaletteMode): ThemeOptions {
  return {
    palette: {
      mode,
    },
  };
}

const getTheme = (mode: PaletteMode, selectedTheme: Themes): ThemeOptions => {
  if (selectedTheme === 'md3') {
    return createTheme(getMD3Theme(mode));
  }

  if (selectedTheme === 'custom') {
    return createTheme(getCustomTheme(mode));
  }

  return createTheme(getDefaultTheme(mode));
};

function CustomTheme({
  selectedTheme,
  mode = 'light',
}: {
  selectedTheme: Themes;
  mode: 'light' | 'dark';
}) {
  console.log(getTheme(mode, selectedTheme));

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
        <Box sx={{ order: { xs: 2, md: 1 } }}>
          <ThemeProvider theme={getTheme(mode, selectedTheme)}>
            {selectedTheme === 'custom' || selectedTheme === 'default' ? (
              <Card elevation={0} sx={{ padding: 0 }}>
                <CustomLayoutRangePicker />
              </Card>
            ) : (
              <Card elevation={0} sx={{ padding: 0 }}>
                <StaticDatePicker defaultValue={dayjs('2022-04-17')} />
              </Card>
            )}
          </ThemeProvider>
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default function Customization() {
  const [selectedTheme, setSelectedTheme] = React.useState<Themes>('custom');
  const [selectedColor, setSelectedColor] = React.useState<string>('default');
  const brandingTheme = useTheme();

  const colorScheme = getColorScheme(selectedTheme);

  const handleChangeTheme = (_event: React.MouseEvent<HTMLElement>, newTheme: Themes) => {
    setSelectedTheme(newTheme);
  };
  const handleChangeColor = (_event: React.MouseEvent<HTMLElement>, newColor: string) => {
    setSelectedColor(newColor);
  };

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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box
              component="div"
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                borderTopLeftRadius: theme.shape.borderRadius,
                borderBottomLeftRadius: theme.shape.borderRadius,
                flexBasis: '70%',
                backgroundImage: `radial-gradient(${theme.palette.divider} 0.8px, ${theme.palette.background.paper} 0.8px)`,
                backgroundSize: '10px 10px',
              })}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomTheme selectedTheme={selectedTheme} mode={brandingTheme.palette.mode} />
              </LocalizationProvider>
            </Box>
            <Box
              component="div"
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                borderLeft: { xs: 0, md: `1px solid ${theme.palette.divider}` },
                borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 0 },
                flexBasis: '30%',
                borderTopRightRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                padding: 2,
                gap: 1.5,
                background: theme.palette.gradients.linearSubtle,
              })}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Select Theme
                </Typography>
                <ConfigToggleButtons
                  selectedValue={selectedTheme}
                  handleValueSwitch={handleChangeTheme}
                  values={[
                    { key: 'custom', label: 'Custom' },
                    { key: 'md3', label: 'MD3' },
                    { key: 'default', label: 'MD2' },
                  ]}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Color
                </Typography>
                <ConfigToggleButtons
                  selectedValue={selectedColor}
                  handleValueSwitch={handleChangeColor}
                  values={Object.keys(colorScheme).map((key) => ({
                    key,
                    icon: <ColorSwatch color={colorScheme[key as keyof typeof colorScheme]} />,
                  }))}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
