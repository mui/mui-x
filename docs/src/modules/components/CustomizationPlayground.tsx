import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import { BrandingProvider } from '@mui/docs/branding';
import { styled, Theme, alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import Chip from '@mui/material/Chip';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import pick from 'lodash/pick';
import {
  useCustomizationPlayground,
  UseCustomizationPlaygroundProps,
  DEFAULT_COLORS,
  withStyles,
  ColorKey,
  StyleTokensType,
  CustomizationLabelType,
} from '../utils/useCustomizationPlayground';

const PlaygroundWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  border: '1px solid',
  borderColor: alpha(theme.palette.grey[500], 0.2),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  justifyContent: 'space-between',

  [theme.breakpoints.down('lg')]: { flexWrap: 'wrap-reverse' },
}));

const PlaygroundDemoArea = styled('div')(({ theme }) => ({
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PlaygroundConfigArea = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.light, 0.05),
  border: '1px solid',
  borderColor: alpha(theme.palette.grey[500], 0.2),
  borderRadius: '4px',
  [theme.breakpoints.down('lg')]: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    gap: theme.spacing(3),
  },
}));

const ComponentsSelect = styled(Select)(({ theme }) => ({
  ...theme.typography.caption,
}));

const ConfigSectionWrapper = styled('div')(({ theme }) => ({
  gap: theme.spacing(0.5),
  width: 250,
}));

const ConfigLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(1),
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(14),
  letterSpacing: '.08rem',
  '&:first-of-type': {
    marginTop: theme.spacing(1),
  },
  '&:last-of-type': {
    marginTop: theme.spacing(4),
  },
}));

const ConfigItemLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  letterSpacing: '.08rem',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(12),
  fontweight: 600,
}));

const SlotItemsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

const SlotItem = styled(Button)(({ theme }) => ({
  borderWidth: 1,
  borderRadius: '99px',
  textTransform: 'none',
  padding: theme.spacing(0.1, 1),
}));

const TabsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'end',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(4),
  },
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
  mt: 1,
  mb: '-16px',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: '60%',
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}));

type TabsProps = {
  value: string;
  onChange: (e: React.SyntheticEvent, value: any) => void;
  options: Partial<CustomizationLabelType>;
};

function StylingApproachTabs({ value, onChange, options }: TabsProps) {
  return (
    <div>
      <StyledTabs
        value={value}
        onChange={onChange}
        aria-label="Customization option"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
      >
        {(Object.keys(options) as Array<keyof typeof options>)?.map((option) => (
          <Tab value={option} key={option} label={options[option]} />
        ))}
      </StyledTabs>
    </div>
  );
}

const RECOMMENDATION_MESSAGES: { [k in 'warning' | 'success']: string } = {
  warning:
    'This might not be the best styling approach for the selected component. You can check out the other options for better results.',
  success: 'This is the recommended styling approach for the selected component.',
};

function StylingRecommendation({
  type = 'warning',
  message = '',
}: {
  type?: 'warning' | 'success' | 'info';
  message?: string;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const displayedMessage = type === 'info' ? message : RECOMMENDATION_MESSAGES[type];

  if (isMobile) {
    return (
      <Alert severity={type} sx={{ p: 1 }}>
        {displayedMessage}
      </Alert>
    );
  }
  const labels = { warning: 'Warning', success: 'Recommended', info: 'Info' };

  return (
    <Tooltip title={displayedMessage}>
      <Chip size="small" color={type} label={labels[type]} />
    </Tooltip>
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'transparent',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

interface Props extends ToggleButtonProps {
  selectedColor: ColorKey;
}

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'selectedColor',
})(({ theme, selectedColor = 'blue' }: Props & { theme: Theme }) => ({
  height: theme.spacing(3),
  minWidth: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  background: DEFAULT_COLORS[selectedColor][500],
  '&:hover': {
    background: DEFAULT_COLORS[selectedColor][600],
  },
  '&.Mui-selected': {
    borderColor: 'transparent!important',
    background: DEFAULT_COLORS[selectedColor][500],
    color: theme.palette.primary.contrastText,
    '&:hover': {
      borderColor: 'transparent!important',
      background: DEFAULT_COLORS[selectedColor][600],
    },
  },
}));

function ColorSwitcher({
  handleTokenChange,
  selectedColor,
}: {
  handleTokenChange: (token: 'color', value: keyof typeof DEFAULT_COLORS) => void;
  selectedColor: ColorKey;
}) {
  return (
    <React.Fragment>
      <ConfigItemLabel>Color</ConfigItemLabel>
      <StyledToggleButtonGroup
        size="small"
        value={selectedColor}
        exclusive
        onChange={(_, value) => {
          if (value !== null) {
            handleTokenChange('color', value);
          }
        }}
        aria-label="color palette"
      >
        {(Object.keys(DEFAULT_COLORS) as Array<ColorKey>).map((color) => (
          <StyledToggleButton
            selectedColor={color}
            value={color}
            aria-label={`${color} button`}
            key={color}
          >
            {color === selectedColor ? <CheckIcon sx={{ fontSize: 12 }} /> : ''}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </React.Fragment>
  );
}

function NumericTokensSlider({
  handleTokenChange,
  tokens,
}: {
  handleTokenChange: (token: keyof StyleTokensType, value: number) => void;
  tokens: Record<keyof Omit<StyleTokensType, 'color'>, number>;
}) {
  return (
    <React.Fragment>
      {(Object.keys(tokens) as Array<keyof typeof tokens>).map((token) => (
        <React.Fragment key={token}>
          <ConfigItemLabel>{token}</ConfigItemLabel>
          <Slider
            size="small"
            value={tokens[token]}
            onChange={(_, value) => handleTokenChange(token, value as number)}
            aria-label={`${token} slider`}
            key={token}
            min={0}
            max={20}
            marks
            step={1}
            valueLabelDisplay="auto"
          />
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

const CustomizationPlayground = function CustomizationPlayground({
  children,
  examples,
  componentName,
}: UseCustomizationPlaygroundProps) {
  const {
    selectedDemo,
    customizationOptions,
    selectedCustomizationOption,
    selectDemo,
    setSelectedCustomizationOption,
    selectedSlot,
    setSelectedSlot,
    codeExample,
    availableSlots,
    handleTokenChange,
    selectedTokens,
    selectedExample,
    moreInformation,
  } = useCustomizationPlayground({ examples, componentName });

  const StyledChild = withStyles(
    Box,
    selectedTokens,
    selectedCustomizationOption,
    selectedDemo,
    selectedSlot,
  );

  const shouldBeInteractive = selectedDemo && selectedCustomizationOption && codeExample;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <PlaygroundWrapper>
        <PlaygroundDemoArea>
          <StyledChild sx={{ width: 'fit-content', minHeight: '390px' }}>
            {React.Children.map(
              children,
              (child) =>
                React.isValidElement(child) &&
                React.cloneElement(
                  child,
                  selectedDemo && selectedCustomizationOption
                    ? {
                        ...examples[selectedDemo]?.examples[selectedCustomizationOption]
                          ?.componentProps,
                      }
                    : {},
                ),
            )}
          </StyledChild>
          {moreInformation}
        </PlaygroundDemoArea>
        {shouldBeInteractive && (
          <BrandingProvider>
            <PlaygroundConfigArea>
              <ConfigSectionWrapper>
                <ConfigLabel gutterBottom>Components</ConfigLabel>
                <FormControl size="small" sx={{ backgroundColor: 'transparent', flexGrow: 1 }}>
                  <ComponentsSelect
                    id="select-component"
                    label=""
                    value={selectedDemo}
                    onChange={(event) => selectDemo(event.target.value as string)}
                  >
                    {Object.keys(examples || {}).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </ComponentsSelect>
                </FormControl>
                {availableSlots && (
                  <React.Fragment>
                    <ConfigLabel gutterBottom>Slots</ConfigLabel>
                    <SlotItemsWrapper>
                      {(availableSlots as string[]).map((slot: string) => (
                        <SlotItem
                          size="small"
                          onClick={() => setSelectedSlot(slot)}
                          key={slot}
                          variant={selectedSlot === slot ? 'contained' : 'outlined'}
                        >
                          {slot}
                        </SlotItem>
                      ))}
                    </SlotItemsWrapper>
                  </React.Fragment>
                )}
              </ConfigSectionWrapper>
              <ConfigSectionWrapper>
                <ConfigLabel gutterBottom>Playground</ConfigLabel>
                <Stack sx={{ gap: 0.5 }}>
                  <ColorSwitcher {...{ handleTokenChange, selectedColor: selectedTokens.color }} />
                  <NumericTokensSlider
                    {...{
                      handleTokenChange,
                      tokens: pick(selectedTokens, ['borderRadius', 'borderWidth']),
                    }}
                  />
                </Stack>
              </ConfigSectionWrapper>
            </PlaygroundConfigArea>
          </BrandingProvider>
        )}
      </PlaygroundWrapper>
      {selectedDemo && customizationOptions && selectedCustomizationOption && (
        <BrandingProvider>
          <TabsWrapper>
            <StylingApproachTabs
              onChange={(_e, newValue) => {
                setSelectedCustomizationOption(newValue);
              }}
              value={selectedCustomizationOption}
              options={customizationOptions}
            />
            {selectedExample && (
              <StylingRecommendation
                type={selectedExample.type}
                message={selectedExample?.comments}
              />
            )}
          </TabsWrapper>
        </BrandingProvider>
      )}
      {shouldBeInteractive && (
        <HighlightedCode code={codeExample} language="js" sx={{ overflowX: 'hidden' }} />
      )}
    </Box>
  );
};

export default CustomizationPlayground;
