import * as React from 'react';
// @ts-ignore
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
// @ts-ignore
import BrandingProvider from 'docs/src/BrandingProvider';
import { styled, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { blue, grey } from '@mui/material/colors';
import clsx from 'clsx';

interface CustomizationPlaygroundProps {
  children: React.ReactNode;
  examples: {
    [key: string]: {
      [key: string]: string;
    };
  };
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

const Nav = styled(Box)(({ theme }) => ({ minWidth: theme.spacing(20) }));

const NavLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(1.4),
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(11),
  textTransform: 'uppercase',
  letterSpacing: '.08rem',
  color: theme.palette.grey[400],
}));

const NavItem = styled(Typography)(({ theme }) => {
  return {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    padding: `${theme.spacing(0.4)} ${theme.spacing(1.4)}`,
    color: theme.palette.grey[700],
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
    borderRadius: `0 ${theme.spacing(0.5)} ${theme.spacing(0.5)} 0`,
    '&.selected': {
      color: theme.palette.primary.main,
      borderLeftColor: (theme.vars || theme).palette.primary.main,
      background: blue[50],
    },
    '&:hover, &.hovered': {
      color: theme.palette.primary.main,
      borderLeftColor: (theme.vars || theme).palette.primary.main,
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
        onClick={(e) => handleDemoClick(e)}
        onMouseOver={(e) => handleDemoHover(e)}
        onMouseLeave={() => setHoveredDemo(null)}
        selected={selectedDemo}
        hovered={hoveredDemo}
        ref={ref}
      >
        <Nav>
          <NavLabel gutterBottom>Components</NavLabel>
          {Object.keys(examples).map((item) => (
            <NavItem
              onClick={() => selectDemo(item)}
              onMouseOver={() => setHoveredDemo(item)}
              onMouseLeave={() => setHoveredDemo(null)}
              key={item}
              className={clsx(
                `${hoveredDemo === item ? 'hovered' : ''}`,
                `${selectedDemo === item ? 'selected' : ''}`,
              )}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        <Box sx={{ width: 'fit-content' }}> {children}</Box>
      </HighlightedDemo>
      <BrandingProvider>
        {selectedDemo && customizationOptions && (
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
        )}

        {selectedDemo && selectedCustomizationOption && codeExample && (
          <HighlightedCode code={`${codeExample} `} language="js" />
        )}
      </BrandingProvider>
    </Box>
  );
});

export default CustomizationPlayground;
