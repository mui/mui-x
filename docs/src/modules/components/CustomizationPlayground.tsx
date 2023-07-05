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
import pick from 'lodash/pick';
import clsx from 'clsx';

type CustomizationLabelNames = 'customTheme' | 'styledComponents';
type CustomizationLabels = 'Custom Theme' | 'Styled Components';
type CustomizationOptions = { [K in CustomizationLabelNames]?: CustomizationLabels };

interface CustomizationPlaygroundProps {
  children: React.ReactNode;
  config: {
    customizationLabels: CustomizationOptions;
    examples: {
      [key: string]: {
        [K in CustomizationLabelNames]: { code: string; name: string; path: string };
      };
    };
  };
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

const HighlightedDemo = styled(Box)(
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
            [`&:hover  ${current === hovered ? ', &' : ''} ${current === selected ? ', &' : ''}`]: {
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

const getInteractionTarget = (
  target: HTMLElement,
  demoRef: React.MutableRefObject<null>,
  examples: CustomizationPlaygroundProps['config']['examples'],
): string | null => {
  const checkSubComponent = (element: HTMLElement) => {
    return Object.keys(examples).find((className) =>
      element.classList.contains(`Mui${className}-root`),
    );
  };
  let interactionTarget = null;

  while (target !== demoRef.current) {
    if (target.classList) {
      const match = checkSubComponent(target);
      if (match) {
        interactionTarget = match;
        break;
      }
    }
    target = target.parentNode as HTMLElement;
  }

  return interactionTarget;
};

export default function CustomizationPlayground({
  children,
  config,
}: CustomizationPlaygroundProps) {
  const demoRef = React.useRef(null);
  const [selectedDemo, setSelectedDemo] = React.useState<string | null>(null);
  const [hoveredDemo, setHoveredDemo] = React.useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] =
    React.useState<CustomizationOptions | null>(null);
  const [selectedCustomizationOption, setSelectedCustomizationOption] =
    React.useState<CustomizationLabelNames | null>(null);

  const selectDemo = (interactionTarget: string) => {
    // set the selected subcomponent name
    setSelectedDemo(interactionTarget);
    // set the array of customization options to the available options for the selected subcomponent
    setCustomizationOptions(
      pick(config.customizationLabels, Object.keys(config.examples[interactionTarget])),
    );
    // set the selected customization option to the first available option for the selected subcomponent
    setSelectedCustomizationOption(
      Object.keys(config.examples[interactionTarget])[0] as CustomizationLabelNames,
    );
  };

  const handleDemoClick = (event: React.MouseEvent<HTMLElement>) => {
    const interactionTarget = getInteractionTarget(
      event.target as HTMLElement,
      demoRef,
      config.examples,
    );
    if (interactionTarget) {
      selectDemo(interactionTarget);
    }
  };

  const handleDemoHover = (event: React.MouseEvent<HTMLElement>) => {
    const interactionTarget = getInteractionTarget(
      event.target as HTMLElement,
      demoRef,
      config.examples,
    );

    if (interactionTarget) {
      // set the selected subcomponent name
      setHoveredDemo(interactionTarget);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HighlightedDemo
        subComponents={Object.keys(config.examples)}
        onClick={(e) => handleDemoClick(e)}
        onMouseOver={(e) => handleDemoHover(e)}
        onMouseLeave={() => setHoveredDemo(null)}
        selected={selectedDemo}
        hovered={hoveredDemo}
        ref={demoRef}
      >
        <Nav>
          <NavLabel gutterBottom>Components</NavLabel>
          {Object.keys(config.examples).map((item) => (
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
        {children}
      </HighlightedDemo>
      <BrandingProvider>
        {selectedDemo && customizationOptions && (
          <TextField
            size="small"
            label="Customization options"
            value={selectedCustomizationOption}
            onChange={(e) => {
              setSelectedCustomizationOption(e.target.value as CustomizationLabelNames);
            }}
            select
          >
            {Object.keys(customizationOptions)?.map((option) => (
              <MenuItem value={option} key={option}>
                {customizationOptions[option as CustomizationLabelNames]}
              </MenuItem>
            ))}
          </TextField>
        )}

        {selectedDemo && selectedCustomizationOption && (
          <HighlightedCode
            code={`${config.examples[selectedDemo][selectedCustomizationOption].code} `}
            language="js"
          />
        )}
      </BrandingProvider>
    </Box>
  );
}
