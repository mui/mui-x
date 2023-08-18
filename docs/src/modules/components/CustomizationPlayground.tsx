import * as React from 'react';
// @ts-ignore
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
// @ts-ignore
import BrandingProvider from 'docs/src/BrandingProvider';
import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { blue, grey } from '@mui/material/colors';
import clsx from 'clsx';

const customizationLabels: { [k: string]: string } = {
  customTheme: 'Custom Theme',
  styledComponents: 'Styled Components',
  sxProp: 'SX Prop',
};

type CustomizationItemsType = Partial<{
  [k in keyof typeof customizationLabels]: { code: string; type?: 'warning' | 'success' };
}>;
interface CustomizationPlaygroundProps {
  children: React.ReactNode;
  examples: { [k: string]: CustomizationItemsType };
  selectedDemo: string | null;
  hoveredDemo: string | null;
  customizationOptions: { [key: string]: string };
  selectedCustomizationOption: string;
  handleDemoClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleDemoHover: (e: React.MouseEvent<HTMLDivElement>) => void;
  selectDemo: (interactionTarget: string) => void;
  setHoveredDemo: (interactionTarget: string | null) => void;
  setSelectedCustomizationOption: (interactionTarget: string) => void;
  codeExample: string;
}

const Nav = styled(Box)(({ theme }) => ({
  minWidth: theme.spacing(24),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

const NavLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(11),
  textTransform: 'uppercase',
  letterSpacing: '.08rem',
  color: theme.palette.grey[400],
}));

const NavItem = styled(Button)(({ theme }) => {
  return {
    color: theme.palette.grey[700],
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    '&:hover, &.hovered': {
      color: theme.palette.primary.main,
    },
  };
});

const HighlightedDemo = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'subComponents' && prop !== 'selected' && prop !== 'hovered',
})(
  ({
    theme,
    subComponents = [],
    selected,
    hovered,
  }: {
    subComponents: string[];
    theme?: Theme;
    selected?: string | null;
    hovered?: string | null;
  }) => {
    return subComponents.reduce(
      (prev: {}, current: {}) => {
        return {
          ...prev,
          [`& .Mui${current}-root`]: {
            [`${current === hovered ? '&' : ''} ${current === selected ? ', &' : ''}`]: {
              [`& > *`]: { zIndex: 1 },
              position: `relative`,
              cursor: 'pointer',

              [`&::before`]: {
                borderRadius: theme!.spacing(0.5),
                content: `''`,
                position: 'absolute',
                inset: 0,
                border: `1px solid ${theme!.palette.primary.light}`,
                backgroundColor: blue[50],
                ...(current === selected ? {} : { opacity: 0.5 }),
              },

              [`&::after`]: {
                content: `'${current}'`,

                ...(current === selected
                  ? { backgroundColor: theme!.palette.primary.main }
                  : { backgroundColor: blue[500] }),

                ...theme!.typography.caption,
                color: theme!.palette.primary.contrastText,
                padding: `${theme!.spacing(0.2)} ${theme!.spacing(1)}`,
                borderRadius: `0 0 0 ${theme!.spacing(0.5)} `,
                position: 'absolute',
                top: 0,
                right: 0,
              },
            },
          },
        };
      },
      {
        '&': {
          minHeight: theme!.spacing(54),
          display: 'flex',
          justifyContent: 'flex-start',
          gap: theme!.spacing(2),
          border: `1px solid ${grey[200]}`,
          padding: theme!.spacing(2),
          marginBottom: theme!.spacing(3),
          [theme!.breakpoints.down('md')]: {
            display: 'block',
          },
        },
      },
    );
  },
);

const RECOMMENDATION_MESSAGES: { [k in 'warning' | 'success']: string } = {
  warning:
    'This might not be the best styling approach for the selected component. You can check out the other options for better results.',
  success: 'This is the recommended styling approach for the selected component.',
};

function StylingRecomendation({ type = 'success' }: { type?: 'warning' | 'success' }) {
  return (
    <Tooltip title={RECOMMENDATION_MESSAGES[type]}>
      {type === 'warning' ? <WarningIcon color="warning" /> : <CheckBoxIcon color="success" />}
    </Tooltip>
  );
}

const CustomizationPlayground = React.forwardRef(function CustomizationPlayground(
  {
    children,
    examples,
    selectedDemo,
    hoveredDemo,
    customizationOptions,
    selectedCustomizationOption,
    handleDemoClick,
    handleDemoHover,
    selectDemo,
    setHoveredDemo,
    setSelectedCustomizationOption,
    codeExample = '',
  }: CustomizationPlaygroundProps,
  ref,
) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <HighlightedDemo
        subComponents={Object.keys(examples)}
        selected={selectedDemo}
        hovered={hoveredDemo}
        ref={ref}
      >
        <Nav>
          <NavLabel gutterBottom>Components</NavLabel>
          {Object.keys(examples).map((item) => (
            <NavItem
              size="small"
              onClick={() => selectDemo(item)}
              onMouseOver={() => setHoveredDemo(item)}
              onMouseLeave={() => {
                setHoveredDemo(null);
              }}
              key={item}
              variant={selectedDemo === item ? 'outlined' : 'text'}
              className={clsx(`${hoveredDemo === item ? 'hovered' : ''}`)}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        <Box
          sx={{ width: 'fit-content' }}
          onClick={(e) => handleDemoClick(e)}
          onMouseOver={(e) => handleDemoHover(e)}
          onMouseLeave={() => setHoveredDemo(null)}
        >
          {children}
        </Box>
      </HighlightedDemo>
      <BrandingProvider>
        {selectedDemo && customizationOptions && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              size="small"
              label="Customization options"
              value={selectedCustomizationOption}
              onChange={(e) => {
                setSelectedCustomizationOption(e.target.value as string);
              }}
              select
            >
              {Object.keys(customizationOptions)?.map((option) => (
                <MenuItem value={option} key={option}>
                  {customizationOptions[option as string]}
                </MenuItem>
              ))}
            </TextField>
            <StylingRecomendation
              type={examples[selectedDemo][selectedCustomizationOption]?.type}
            />
          </Box>
        )}

        {selectedDemo && selectedCustomizationOption && codeExample && (
          <HighlightedCode code={`${codeExample} `} language="js" />
        )}
      </BrandingProvider>
    </Box>
  );
});

export default CustomizationPlayground;
