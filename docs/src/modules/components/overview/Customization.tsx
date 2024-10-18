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
import SvgIcon from '@mui/material/SvgIcon';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import DensityLargeIcon from '@mui/icons-material/DensityLarge';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomLayoutRangePicker from './CustomLayoutRangePicker';
import { getMD3Theme } from './themes/md3';
import { getCustomTheme } from './themes/customTheme';
import ConfigToggleButtons from './ConfigToggleButtons';
import {
  Config,
  Themes,
  TypographyType,
  Corner,
  Layout,
  PaletteMode,
  Density,
} from './themes/themes.types';

function RectangularCornersIcon() {
  return (
    <SvgIcon className="rectangular" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15.6812 4.81884H2V2.5H18V18.5H15.6812V4.81884Z" />
    </SvgIcon>
  );
}
function MediumCornersIcon() {
  return (
    <SvgIcon className="medium" viewBox="0 0 20 20" fill="currentColor">
      <path d="M12.2029 4.31884H2V2H12.2029C15.4045 2 18 4.59545 18 7.7971V18H15.6812V7.7971C15.6812 5.87611 14.1239 4.31884 12.2029 4.31884Z" />
    </SvgIcon>
  );
}
function RoundedCornersIcon() {
  return (
    <SvgIcon className="rounded" viewBox="0 0 20 20" fill="currentColor">
      <path d="M15.6812 18C15.6812 10.4441 9.5559 4.31884 2 4.31884V2C10.8366 2 18 9.16344 18 18H15.6812Z" />
    </SvgIcon>
  );
}

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

function getDefaultTheme(mode: PaletteMode): ThemeOptions {
  return {
    palette: {
      mode,
    },
  };
}

const getTheme = (mode: PaletteMode, config: Config, selectedTheme: Themes): ThemeOptions => {
  if (selectedTheme === 'md3') {
    return createTheme(getMD3Theme(mode));
  }

  if (selectedTheme === 'custom') {
    return createTheme(getCustomTheme(mode, config));
  }

  return createTheme(getDefaultTheme(mode));
};

function CustomTheme({
  selectedTheme,
  mode = 'light',
  config,
}: {
  selectedTheme: Themes;
  mode: 'light' | 'dark';
  config: Config;
}) {
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
          <ThemeProvider theme={getTheme(mode, config, selectedTheme)}>
            {selectedTheme === 'custom' || selectedTheme === 'default' ? (
              <Card elevation={0} sx={{ padding: 0 }}>
                <CustomLayoutRangePicker layout={config.layout} />
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

const initialState: Config = {
  selectedTheme: 'custom',
  color: 'default',
  layout: 'horizontal',
  density: 'medium',
  corner: 'rounded',
  typography: 'default',
};

export default function Customization() {
  const [styleConfig, setStyleConfig] = React.useState<Config>(initialState);

  const brandingTheme = useTheme();

  const colorScheme = getColorScheme(styleConfig.selectedTheme);

  const handleChangeTheme = (_event: React.MouseEvent<HTMLElement>, newTheme: Themes) => {
    setStyleConfig((prev) => ({
      ...prev,
      selectedTheme: newTheme,
      corner: newTheme === 'custom' ? 'medium' : 'rounded',
    }));
  };
  const handleChangeColor = (_event: React.MouseEvent<HTMLElement>, newColor: string) => {
    setStyleConfig((prev) => ({ ...prev, color: newColor }));
  };
  const handleChangeLayout = (_event: React.MouseEvent<HTMLElement>, newLayout: Layout) => {
    setStyleConfig((prev) => ({ ...prev, layout: newLayout }));
  };
  const handleChangeCorner = (_event: React.MouseEvent<HTMLElement>, newCorner: Corner) => {
    setStyleConfig((prev) => ({ ...prev, corner: newCorner }));
  };
  const handleChangeDensity = (_event: React.MouseEvent<HTMLElement>, newDensity: Density) => {
    setStyleConfig((prev) => ({ ...prev, density: newDensity }));
  };

  const handleChangeTypography = (
    _event: React.MouseEvent<HTMLElement>,
    newTypography: TypographyType,
  ) => {
    setStyleConfig((prev) => ({ ...prev, typography: newTypography }));
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
                <CustomTheme
                  selectedTheme={styleConfig.selectedTheme}
                  config={styleConfig}
                  mode={brandingTheme.palette.mode}
                />
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
                  selectedValue={styleConfig.selectedTheme}
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
                  selectedValue={styleConfig.color}
                  handleValueSwitch={handleChangeColor}
                  values={Object.keys(colorScheme).map((key) => ({
                    key,
                    icon: <ColorSwatch color={colorScheme[key as keyof typeof colorScheme]} />,
                  }))}
                />
              </Stack>
              {styleConfig.selectedTheme !== 'md3' && (
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Layout
                  </Typography>
                  <ConfigToggleButtons
                    selectedValue={styleConfig.layout}
                    handleValueSwitch={handleChangeLayout}
                    values={[
                      {
                        key: 'horizontal',
                        icon: <AlignHorizontalLeftIcon />,
                      },
                      {
                        key: 'vertical',
                        icon: <AlignVerticalBottomIcon />,
                      },
                    ]}
                  />
                </Stack>
              )}

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Corners
                </Typography>
                <ConfigToggleButtons
                  selectedValue={styleConfig.corner}
                  handleValueSwitch={handleChangeCorner}
                  values={[
                    {
                      key: 'rectangular',
                      icon: <RectangularCornersIcon />,
                    },
                    {
                      key: 'medium',
                      icon: <MediumCornersIcon />,
                    },
                    {
                      key: 'rounded',
                      icon: <RoundedCornersIcon />,
                    },
                  ]}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Density
                </Typography>
                <ConfigToggleButtons
                  selectedValue={styleConfig.density}
                  handleValueSwitch={handleChangeDensity}
                  values={[
                    {
                      key: 'compact',
                      icon: <DensitySmallIcon />,
                    },
                    {
                      key: 'medium',
                      icon: <DensityMediumIcon />,
                    },
                    {
                      key: 'spacious',
                      icon: <DensityLargeIcon />,
                    },
                  ]}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Typography
                </Typography>
                <ConfigToggleButtons
                  selectedValue={styleConfig.typography}
                  handleValueSwitch={handleChangeTypography}
                  values={[
                    {
                      key: 'default',
                      label: 'Default',
                    },
                    {
                      key: 'Inter',
                      label: 'Inter',
                    },
                    {
                      key: 'Menlo',
                      label: 'Menlo',
                    },
                  ]}
                />
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </React.Fragment>
  );
}
