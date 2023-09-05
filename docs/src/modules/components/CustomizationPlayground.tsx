import * as React from 'react';
// @ts-ignore
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
// @ts-ignore
import BrandingProvider from 'docs/src/BrandingProvider';
import { styled, Theme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
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
import { grey } from '@mui/material/colors';
import pick from 'lodash/pick';
import {
  useCustomizationPlayground,
  UseCustomizationPlaygroundProps,
  DEFAULT_COLORS,
  withStyles,
  ColorKey,
  StyleTokensType,
} from '../utils/useCustomizationPlayground';

const PlaygroundWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${grey[200]}`,
}));

const PlaygroundDemoArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const PlaygroundConfigArea = styled(Stack)(({ theme }) => ({
  gap: 0.5,
  width: '250px',
  padding: theme.spacing(2),
}));

const NavItemsWrapper = styled(Box)(() => ({
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
}));

const NavLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(12),
  textTransform: 'uppercase',
  letterSpacing: '.08rem',
}));

const NavItemLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  letterSpacing: '.08rem',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(11),
  fontweight: 600,
}));

const NavItem = styled(Button)(({ theme }) => {
  return {
    width: 'fit-content',
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    '&:hover, &.hovered': {
      color: theme.palette.primary.main,
    },
  };
});

const RECOMMENDATION_MESSAGES: { [k in 'warning' | 'success']: string } = {
  warning:
    'This might not be the best styling approach for the selected component. You can check out the other options for better results.',
  success: 'This is the recommended styling approach for the selected component.',
};

function StylingRecommendation({ type = 'success' }: { type?: 'warning' | 'success' }) {
  return (
    <Tooltip title={RECOMMENDATION_MESSAGES[type]}>
      {type === 'warning' ? (
        <Chip color="warning" label="Warning" />
      ) : (
        <Chip color="success" label="Recommended" />
      )}
    </Tooltip>
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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
})(({ theme, selectedColor = 'deepPurple' }: Props & { theme: Theme }) => ({
  height: theme.spacing(3),
  minWidth: theme.spacing(3),
  color: theme.palette.primary.contrastText,
  background: DEFAULT_COLORS[selectedColor][500],
  '&:hover': {
    background: DEFAULT_COLORS[selectedColor][600],
  },
  '&.Mui-selected': {
    background: DEFAULT_COLORS[selectedColor][500],
    color: theme.palette.primary.contrastText,
    '&:hover': {
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
      <NavItemLabel>Color</NavItemLabel>
      <StyledToggleButtonGroup
        size="small"
        value={selectedColor}
        exclusive
        onChange={(_e, v) => handleTokenChange('color', v)}
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
          <NavItemLabel>{token}</NavItemLabel>
          <Slider
            size="small"
            value={tokens[token]}
            onChange={(_e, v) => handleTokenChange(token, v as number)}
            aria-label={`${token} slider`}
            key={token}
            min={0}
            max={20}
            marks
            step={1}
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
      <BrandingProvider>
        {selectedDemo && customizationOptions && selectedCustomizationOption && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 1,
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={selectedCustomizationOption}
                onChange={(_e, newValue) => {
                  setSelectedCustomizationOption(newValue);
                }}
                aria-label="Customization option"
              >
                {(
                  Object.keys(customizationOptions) as Array<keyof typeof customizationOptions>
                )?.map((option) => (
                  <Tab value={option} key={option} label={customizationOptions[option]} />
                ))}
              </Tabs>
            </Box>
            {selectedExample && <StylingRecommendation type={selectedExample.type} />}
          </Box>
        )}
      </BrandingProvider>
      <PlaygroundWrapper>
        <PlaygroundDemoArea>
          <StyledChild sx={{ width: 'fit-content' }}>
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
        </PlaygroundDemoArea>
        <Divider flexItem orientation="vertical" sx={{ borderColor: grey[200] }} />
        <PlaygroundConfigArea>
          <NavLabel gutterBottom>Components</NavLabel>
          <NavItemsWrapper>
            {Object.keys(examples || {}).map((item) => (
              <NavItem
                size="small"
                onClick={() => selectDemo(item)}
                key={item}
                variant={selectedDemo === item ? 'outlined' : 'text'}
              >
                {item}
              </NavItem>
            ))}
          </NavItemsWrapper>
          {shouldBeInteractive && (
            <React.Fragment>
              <NavLabel gutterBottom>Slots</NavLabel>
              {availableSlots && (
                <NavItemsWrapper>
                  {(availableSlots as string[]).map((slot: string) => (
                    <NavItem
                      size="small"
                      onClick={() => setSelectedSlot(slot)}
                      key={slot}
                      variant={selectedSlot === slot ? 'outlined' : 'text'}
                    >
                      {slot}
                    </NavItem>
                  ))}
                </NavItemsWrapper>
              )}
              <NavLabel gutterBottom>Playground</NavLabel>
              <Stack sx={{ gap: 1 }}>
                <ColorSwitcher {...{ handleTokenChange, selectedColor: selectedTokens.color }} />
                <NumericTokensSlider
                  {...{
                    handleTokenChange,
                    tokens: pick(selectedTokens, ['padding', 'borderRadius', 'borderWidth']),
                  }}
                />
              </Stack>
            </React.Fragment>
          )}
        </PlaygroundConfigArea>
      </PlaygroundWrapper>

      {shouldBeInteractive && (
        <HighlightedCode code={codeExample} language="js" sx={{ overflowX: 'hidden' }} />
      )}
    </Box>
  );
};

export default CustomizationPlayground;
