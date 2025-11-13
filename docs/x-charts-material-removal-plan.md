# x-charts @mui/material Removal Plan

## Overview

This document outlines a comprehensive plan to remove the `@mui/material` dependency from all `x-charts*` packages, making them framework-agnostic while maintaining full functionality and user flexibility.

## Proof of Concept

A working proof-of-concept implementation has been created to validate this architecture. See:

- **POC Location:** [`/packages/POC-README.md`](../packages/POC-README.md)
- **Base Package:** [`/packages/x-charts-base/`](../packages/x-charts-base/)
- **Material Package:** [`/packages/x-charts-material/`](../packages/x-charts-material/)

The POC demonstrates:

- ✅ Framework-agnostic base package with no Material UI dependencies
- ✅ Custom theme system using React Context and inline styles
- ✅ Material UI integration package that wraps base components
- ✅ Automatic theme adaptation from Material UI to chart theme
- ✅ Clean separation of concerns

## Current Dependencies Analysis

### Comprehensive List of @mui/material Usage

After analyzing all `x-charts*` packages, here's the complete breakdown:

#### From `@mui/material/styles`:

- **`styled`** - Used extensively across all packages for styled components (60+ files)
- **`useThemeProps`** - Used for component prop defaults with theme integration (20+ files)
- **`useTheme`** - Direct theme access (15+ files)
- **`Theme` (type)** - TypeScript type imports (10+ files)
- **`SxProps` (type)** - TypeScript type for sx prop
- **`ComponentsProps` (type)** - For theme augmentation
- **`ComponentsOverrides` (type)** - For theme augmentation
- **`createTheme`** - Only in test files
- **`ThemeProvider`** - Only in test files

#### Material UI Components:

- **`Popper`** - Tooltip positioning (x-charts, x-charts-pro)
- **`NoSsr`** - Server-side rendering prevention (x-charts, x-charts-pro)
- **`Typography`** - Text display in tooltips (x-charts, x-charts-pro)
- **`IconButton`** - Toolbar actions (x-charts)
- **`Button`** - Toolbar actions (x-charts)
- **`Tooltip`** - Hover tooltips (x-charts-pro)
- **`MenuList`** - Context menu (x-charts-pro)
- **`MenuItem`** - Menu items (x-charts-pro)
- **`ListItemIcon`** - Menu item icons (x-charts-pro)
- **`ListItemText`** - Menu item text (x-charts-pro)
- **`Divider`** - Menu dividers (x-charts-pro)
- **`Unstable_TrapFocus`** - Focus management (x-charts-pro)
- **`ClickAwayListener`** - Click outside detection (x-charts-pro)
- **`Grow`** - Transition animation (x-charts-pro)
- **`Paper`** - Elevated surface (x-charts-pro)

#### From `@mui/material/utils`:

- **`createSvgIcon`** - Icon creation utility (x-charts, x-charts-premium)
- **`useEventCallback`** - Event callback memoization (x-charts-pro)
- **`useMediaQuery`** - Media query hook (x-charts)

#### Package-by-Package Breakdown:

**`@mui/x-charts` (Core Package):**

- 50+ files using `styled`
- 15+ files using `useThemeProps`
- 10+ files using `useTheme`
- Components: `Popper`, `NoSsr`, `Typography`, `IconButton`, `Button`
- Utils: `createSvgIcon`, `useMediaQuery`

**`@mui/x-charts-pro`:**

- 20+ files using `styled`
- 10+ files using `useThemeProps`
- 5+ files using `useTheme`
- Components: `Popper`, `NoSsr`, `Typography`, `Tooltip`, `MenuList`, `MenuItem`, `ListItemIcon`, `ListItemText`, `Divider`, `Unstable_TrapFocus`, `ClickAwayListener`, `Grow`, `Paper`
- Utils: `useEventCallback`

**`@mui/x-charts-premium`:**

- 2 files using `styled`
- 1 file using `useTheme`
- Utils: `createSvgIcon`

### Most Commonly Used Items (Priority for Replacement):

1. **`styled` (60+ usages)** - Highest priority
2. **`useThemeProps` (30+ usages)** - High priority
3. **`useTheme` (20+ usages)** - High priority
4. **`Popper` (3 usages)** - Medium priority
5. **`NoSsr` (2 usages)** - Medium priority
6. **`Typography` (4 usages)** - Medium priority
7. **Menu components (6 usages)** - Low priority (Pro only)
8. **Utility functions** - Low priority (easy to replace)

## Styling Solution Evaluation

### Option A: Emotion (Direct Usage)

**Pros:**

- Already in the dependency tree (used by @mui/material)
- Familiar API, minimal migration effort
- Good performance with CSS-in-JS
- Supports server-side rendering
- Runtime theming capabilities

**Cons:**

- Still a runtime CSS-in-JS solution
- Adds ~30kb to bundle
- Requires users to have Emotion in their project
- Maintains indirect dependency coupling

### Option B: Zero-Runtime CSS-in-JS (Linaria/Vanilla Extract)

**Pros:**

- No runtime overhead
- Better performance (static CSS)
- Framework agnostic
- Type-safe styling

**Cons:**

- Build setup complexity for users
- Harder migration path from current implementation
- Limited dynamic theming
- May require bundler plugins
- Not suitable for SVG-heavy components

### Option C: CSS Modules + Inline Styles

**Pros:**

- Zero runtime dependencies
- Maximum flexibility for users
- No build tools required
- Simple mental model

**Cons:**

- More verbose component code
- No built-in theme integration
- Harder to override styles
- Requires CSS file management

### Option D: Inline Styles + CSS Variables (Recommended)

**Pros:**

- Completely dependency-free
- Works with any framework/library
- No build configuration needed
- Smallest possible footprint
- Dynamic theming via CSS variables
- Perfect for SVG components

**Cons:**

- No pseudo-selectors without wrapper elements
- Verbose style objects
- Need careful performance considerations

**Recommendation:** **Option D (Inline Styles + CSS Variables)** for core functionality

**Rationale:**

- Charts are primarily SVG-based (inline styles work perfectly)
- Maximum compatibility with any UI framework
- Zero dependencies = minimal maintenance burden
- CSS variables provide theming without runtime overhead
- Users can wrap with their own styled components if needed

## Multi-Phase Migration Plan

### Phase 1: Foundation (Version N - Preparation)

#### 1.1: Create Internal Component Replacements

**File: `/packages/x-charts/src/internals/components/Popper.tsx`**

```typescript
import * as React from 'react';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/react';
import { createPortal } from 'react-dom';

export interface PopperProps {
  open: boolean;
  anchorEl: Element | (() => Element) | null;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  className?: string;
  style?: React.CSSProperties;
  modifiers?: Array<{
    name: string;
    options?: Record<string, any>;
  }>;
  container?: Element | (() => Element | null) | null;
  disablePortal?: boolean;
}

export function Popper({
  open,
  anchorEl,
  children,
  placement = 'bottom',
  className,
  style,
  modifiers = [],
  container,
  disablePortal = false,
}: PopperProps) {
  const [mountNode, setMountNode] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (container) {
      const node = typeof container === 'function' ? container() : container;
      setMountNode(node);
    } else {
      setMountNode(document.body);
    }
  }, [container]);

  const anchor = typeof anchorEl === 'function' ? anchorEl() : anchorEl;

  const { refs, floatingStyles } = useFloating({
    open,
    placement,
    elements: {
      reference: anchor,
    },
    middleware: [
      offset(modifiers.find((m) => m.name === 'offset')?.options?.offset ?? 8),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  if (!open) {
    return null;
  }

  const content = (
    <div
      ref={refs.setFloating}
      className={className}
      style={{
        ...floatingStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );

  if (disablePortal || !mountNode) {
    return content;
  }

  return createPortal(content, mountNode);
}
```

**File: `/packages/x-charts/src/internals/components/NoSsr.tsx`**

```typescript
import * as React from 'react';

export interface NoSsrProps {
  children: React.ReactNode;
  defer?: boolean;
  fallback?: React.ReactNode;
}

export function NoSsr({ children, defer = false, fallback = null }: NoSsrProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!defer) {
      setMounted(true);
    }
  }, [defer]);

  React.useEffect(() => {
    if (defer) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [defer]);

  return <>{mounted ? children : fallback}</>;
}
```

#### 1.2: Create Theme System

**File: `/packages/x-charts/src/internals/theming/types.ts`**

```typescript
export interface ChartTheme {
  palette: {
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    background: {
      paper: string;
      default: string;
    };
    divider: string;
    action: {
      active: string;
      hover: string;
      disabled: string;
    };
  };
  typography: {
    fontSize: number;
    fontFamily: string;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    body1: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
    };
  };
  zIndex: {
    modal: number;
    tooltip: number;
  };
  shape: {
    borderRadius: number;
  };
  spacing: (factor: number) => number;
}

export const defaultTheme: ChartTheme = {
  palette: {
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    background: {
      paper: '#fff',
      default: '#fafafa',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      disabled: 'rgba(0, 0, 0, 0.26)',
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  zIndex: {
    modal: 1300,
    tooltip: 1500,
  },
  shape: {
    borderRadius: 4,
  },
  spacing: (factor: number) => factor * 8,
};
```

**File: `/packages/x-charts/src/internals/theming/ThemeProvider.tsx`**

```typescript
import * as React from 'react';
import { ChartTheme, defaultTheme } from './types';

const ThemeContext = React.createContext<ChartTheme>(defaultTheme);

export interface ChartThemeProviderProps {
  theme?: Partial<ChartTheme>;
  children: React.ReactNode;
}

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object'
    ) {
      output[key as keyof T] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return output;
}

export function ChartThemeProvider({ theme, children }: ChartThemeProviderProps) {
  const mergedTheme = React.useMemo(
    () => (theme ? deepMerge(defaultTheme, theme) : defaultTheme),
    [theme]
  );

  return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
}

export function useChartTheme(): ChartTheme {
  return React.useContext(ThemeContext);
}
```

**File: `/packages/x-charts/src/internals/theming/adaptMuiTheme.ts`**

```typescript
import { ChartTheme } from './types';

/**
 * Adapts a Material UI theme to ChartTheme format
 * Supports both v5 and v6 Material UI themes
 */
export function adaptMuiTheme(muiTheme: any): ChartTheme {
  return {
    palette: {
      text: {
        primary: muiTheme.palette?.text?.primary ?? 'rgba(0, 0, 0, 0.87)',
        secondary: muiTheme.palette?.text?.secondary ?? 'rgba(0, 0, 0, 0.6)',
        disabled: muiTheme.palette?.text?.disabled ?? 'rgba(0, 0, 0, 0.38)',
      },
      background: {
        paper: muiTheme.palette?.background?.paper ?? '#fff',
        default: muiTheme.palette?.background?.default ?? '#fafafa',
      },
      divider: muiTheme.palette?.divider ?? 'rgba(0, 0, 0, 0.12)',
      action: {
        active: muiTheme.palette?.action?.active ?? 'rgba(0, 0, 0, 0.54)',
        hover: muiTheme.palette?.action?.hover ?? 'rgba(0, 0, 0, 0.04)',
        disabled: muiTheme.palette?.action?.disabled ?? 'rgba(0, 0, 0, 0.26)',
      },
    },
    typography: {
      fontSize: muiTheme.typography?.fontSize ?? 14,
      fontFamily:
        muiTheme.typography?.fontFamily ??
        '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeightLight: muiTheme.typography?.fontWeightLight ?? 300,
      fontWeightRegular: muiTheme.typography?.fontWeightRegular ?? 400,
      fontWeightMedium: muiTheme.typography?.fontWeightMedium ?? 500,
      fontWeightBold: muiTheme.typography?.fontWeightBold ?? 700,
      body1: {
        fontSize: muiTheme.typography?.body1?.fontSize ?? '1rem',
        fontWeight: muiTheme.typography?.body1?.fontWeight ?? 400,
        lineHeight: muiTheme.typography?.body1?.lineHeight ?? 1.5,
      },
    },
    zIndex: {
      modal: muiTheme.zIndex?.modal ?? 1300,
      tooltip: muiTheme.zIndex?.tooltip ?? 1500,
    },
    shape: {
      borderRadius: muiTheme.shape?.borderRadius ?? 4,
    },
    spacing: muiTheme.spacing ?? ((factor: number) => factor * 8),
  };
}
```

#### 1.3: Create CSS Variable System

**File: `/packages/x-charts/src/internals/theming/cssVariables.ts`**

```typescript
import * as React from 'react';
import { ChartTheme } from './types';

export function generateCssVariables(theme: ChartTheme): Record<string, string> {
  return {
    '--mui-charts-palette-text-primary': theme.palette.text.primary,
    '--mui-charts-palette-text-secondary': theme.palette.text.secondary,
    '--mui-charts-palette-text-disabled': theme.palette.text.disabled,
    '--mui-charts-palette-background-paper': theme.palette.background.paper,
    '--mui-charts-palette-background-default': theme.palette.background.default,
    '--mui-charts-palette-divider': theme.palette.divider,
    '--mui-charts-typography-fontSize': `${theme.typography.fontSize}px`,
    '--mui-charts-typography-fontFamily': theme.typography.fontFamily,
    '--mui-charts-zIndex-modal': String(theme.zIndex.modal),
    '--mui-charts-zIndex-tooltip': String(theme.zIndex.tooltip),
    '--mui-charts-shape-borderRadius': `${theme.shape.borderRadius}px`,
  };
}

export function useCssVariables(theme: ChartTheme): React.CSSProperties {
  return React.useMemo(() => generateCssVariables(theme), [theme]);
}
```

#### 1.4: Migrate ChartsReferenceLine Component

**File: `/packages/x-charts/src/ChartsReferenceLine/common.tsx`**

```typescript
import * as React from 'react';
import { useChartTheme } from '../internals/theming/ThemeProvider';
import { referenceLineClasses, ChartsReferenceLineClasses } from './chartsReferenceLineClasses';
import { ChartsTextStyle } from '../ChartsText';
import { AxisId } from '../models/axis';

export const DEFAULT_SPACING = 5;
export const DEFAULT_SPACING_MIDDLE_OTHER_AXIS = 0;

export type CommonChartsReferenceLineProps = {
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign?: 'start' | 'middle' | 'end';
  /**
   * The label to display along the reference line.
   */
  label?: string;
  /**
   * Additional space around the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default { x: 0, y: 5 } on a horizontal line and { x: 5, y: 0 } on a vertical line.
   */
  spacing?: number | { x?: number; y?: number };
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId?: AxisId;
  /**
   * The style applied to the label.
   */
  labelStyle?: ChartsTextStyle;
  /**
   * The style applied to the line.
   */
  lineStyle?: React.CSSProperties;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsReferenceLineClasses>;
};

export interface ReferenceLineRootProps extends React.SVGProps<SVGGElement> {
  children?: React.ReactNode;
}

export const ReferenceLineRoot = React.forwardRef<SVGGElement, ReferenceLineRootProps>(
  function ReferenceLineRoot({ children, className, style, ...props }, ref) {
    const theme = useChartTheme();

    const rootStyles: React.CSSProperties = {
      ...style,
    };

    const lineStyles: React.CSSProperties = {
      fill: 'none',
      stroke: theme.palette.text.primary,
      shapeRendering: 'crispEdges',
      strokeWidth: 1,
      pointerEvents: 'none',
    };

    const labelStyles: React.CSSProperties = {
      fill: theme.palette.text.primary,
      stroke: 'none',
      pointerEvents: 'none',
      fontSize: 12,
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.typography.body1.fontWeight,
    };

    return (
      <g ref={ref} className={className} style={rootStyles} {...props}>
        <style>
          {`
            .${referenceLineClasses.line} {
              fill: ${lineStyles.fill};
              stroke: ${lineStyles.stroke};
              shape-rendering: ${lineStyles.shapeRendering};
              stroke-width: ${lineStyles.strokeWidth};
              pointer-events: ${lineStyles.pointerEvents};
            }
            .${referenceLineClasses.label} {
              fill: ${labelStyles.fill};
              stroke: ${labelStyles.stroke};
              pointer-events: ${labelStyles.pointerEvents};
              font-size: ${labelStyles.fontSize}px;
              font-family: ${labelStyles.fontFamily};
              font-weight: ${labelStyles.fontWeight};
            }
          `}
        </style>
        {children}
      </g>
    );
  },
);
```

#### 1.5: Migrate ChartsTooltipContainer

**File: `/packages/x-charts/src/ChartsTooltip/ChartsTooltipContainer.tsx`**

```typescript
'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import HTMLElementType from '@mui/utils/HTMLElementType';
import useLazyRef from '@mui/utils/useLazyRef';
import { rafThrottle } from '@mui/x-internals/rafThrottle';
import { Popper } from '../internals/components/Popper';
import { NoSsr } from '../internals/components/NoSsr';
import { useChartTheme } from '../internals/theming/ThemeProvider';
import { TriggerOptions, useIsFineMainPointer, usePointerType } from './utils';
import { ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsLastInteraction,
  selectorChartsTooltipItemIsDefined,
  selectorChartsTooltipItemPosition,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  selectorChartsInteractionAxisTooltip,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorChartsInteractionPolarAxisTooltip } from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';
import { useAxisSystem } from '../hooks/useAxisSystem';
import { useSvgRef } from '../hooks';
import { selectorBrushShouldPreventTooltip } from '../internals/plugins/featurePlugins/useChartBrush';

const selectorReturnFalse = () => false;

function getIsOpenSelector(
  trigger: TriggerOptions,
  axisSystem: 'none' | 'polar' | 'cartesian',
  shouldPreventBecauseOfBrush?: boolean,
) {
  if (shouldPreventBecauseOfBrush) {
    return selectorReturnFalse;
  }
  if (trigger === 'item') {
    return selectorChartsTooltipItemIsDefined;
  }
  if (axisSystem === 'polar') {
    return selectorChartsInteractionPolarAxisTooltip;
  }
  if (axisSystem === 'cartesian') {
    return selectorChartsInteractionAxisTooltip;
  }
  return selectorReturnFalse;
}

export interface ChartsTooltipContainerProps<T extends TriggerOptions = TriggerOptions> {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse;
   * - 'axis': Shows values associated with the hovered x value;
   * - 'none': Does not display tooltip.
   * @default 'axis'
   */
  trigger?: T;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  /**
   * Determine if the tooltip should be placed on the pointer location or on the node.
   * @default 'pointer'
   */
  anchor?: 'pointer' | 'node';
  /**
   * Determines the tooltip position relatively to the anchor.
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Class name applied to the root element.
   */
  className?: string;
  /**
   * Style applied to the root element.
   */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltipContainer(inProps: ChartsTooltipContainerProps) {
  const {
    trigger = 'axis',
    position,
    anchor = 'pointer',
    classes: propClasses,
    className,
    style: styleProp,
    children,
  } = inProps;

  const theme = useChartTheme();
  const svgRef = useSvgRef();
  const classes = useUtilityClasses(propClasses);

  const pointerType = usePointerType();
  const isFineMainPointer = useIsFineMainPointer();

  const popperRef = React.useRef<{ update: () => void } | null>(null);
  const positionRef = useLazyRef(() => ({ x: 0, y: 0 }));

  const axisSystem = useAxisSystem();

  const store = useStore<[UseChartCartesianAxisSignature]>();

  const shouldPreventBecauseOfBrush = useSelector(store, selectorBrushShouldPreventTooltip);
  const isOpen = useSelector(
    store,
    getIsOpenSelector(trigger, axisSystem, shouldPreventBecauseOfBrush),
  );

  const lastInteraction = useSelector(store, selectorChartsLastInteraction);
  const computedAnchor = lastInteraction === 'keyboard' ? 'node' : anchor;

  const itemPosition = useSelector(
    store,
    trigger === 'item' && computedAnchor === 'node'
      ? selectorChartsTooltipItemPosition
      : () => null,
    [position],
  );

  React.useEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement === null) {
      return () => {};
    }

    if (itemPosition !== null) {
      const positionUpdate = rafThrottle(() => {
        // eslint-disable-next-line react-compiler/react-compiler
        positionRef.current = {
          x: svgElement.getBoundingClientRect().left + (itemPosition?.x ?? 0),
          y: svgElement.getBoundingClientRect().top + (itemPosition?.y ?? 0),
        };
        popperRef.current?.update();
      });
      positionUpdate();
      return () => positionUpdate.clear();
    }

    const pointerUpdate = rafThrottle((x: number, y: number) => {
      positionRef.current = { x, y };
      popperRef.current?.update();
    });

    const handlePointerEvent = (event: PointerEvent) => {
      pointerUpdate(event.clientX, event.clientY);
    };

    svgElement.addEventListener('pointerdown', handlePointerEvent);
    svgElement.addEventListener('pointermove', handlePointerEvent);
    svgElement.addEventListener('pointerenter', handlePointerEvent);

    return () => {
      svgElement.removeEventListener('pointerdown', handlePointerEvent);
      svgElement.removeEventListener('pointermove', handlePointerEvent);
      svgElement.removeEventListener('pointerenter', handlePointerEvent);
      pointerUpdate.clear();
    };
  }, [svgRef, positionRef, itemPosition]);

  const anchorEl = React.useMemo(
    () => ({
      getBoundingClientRect: () => ({
        x: positionRef.current.x,
        y: positionRef.current.y,
        top: positionRef.current.y,
        left: positionRef.current.x,
        right: positionRef.current.x,
        bottom: positionRef.current.y,
        width: 0,
        height: 0,
        toJSON: () => '',
      }),
    }),
    [positionRef],
  );

  const isMouse = pointerType?.pointerType === 'mouse' || isFineMainPointer;
  const isTouch = pointerType?.pointerType === 'touch' || !isFineMainPointer;

  const modifiers = React.useMemo(
    () => [
      {
        name: 'offset',
        options: {
          offset: () => {
            if (isTouch) {
              return [0, 64];
            }
            return [0, 8];
          },
        },
      },
      ...(!isMouse
        ? [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['top-end', 'top-start', 'bottom-end', 'bottom'],
              },
            },
          ]
        : []),
      { name: 'preventOverflow', options: { altAxis: true } },
    ],
    [isMouse, isTouch],
  );

  const rootStyle: React.CSSProperties = {
    pointerEvents: 'none',
    zIndex: theme.zIndex.modal,
    ...styleProp,
  };

  if (trigger === 'none') {
    return null;
  }

  return (
    <NoSsr>
      {isOpen && (
        <Popper
          className={`${classes?.root ?? ''} ${className ?? ''}`.trim()}
          style={rootStyle}
          open={isOpen}
          placement={position ?? (isMouse ? 'right-start' : 'top')}
          anchorEl={anchorEl}
          modifiers={modifiers}
        >
          {children}
        </Popper>
      )}
    </NoSsr>
  );
}

ChartsTooltipContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Determine if the tooltip should be placed on the pointer location or on the node.
   * @default 'pointer'
   */
  anchor: PropTypes.oneOf(['node', 'pointer']),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
  children: PropTypes.node,
  /**
   * Determines the tooltip position relatively to the anchor.
   */
  position: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
  /**
   * Style applied to the root element.
   */
  style: PropTypes.object,
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse;
   * - 'axis': Shows values associated with the hovered x value;
   * - 'none': Does not display tooltip.
   * @default 'axis'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltipContainer };
```

### Phase 2: Compatibility Layer (Version N)

#### 2.1: Create Deprecation Warnings

**File: `/packages/x-charts/src/internals/utils/deprecationWarnings.ts`**

```typescript
let hasWarned = false;

export function warnStyledUsage(componentName: string) {
  if (process.env.NODE_ENV !== 'production' && !hasWarned) {
    console.warn(
      `MUI X: The ${componentName} component is using deprecated styled API from @mui/material. ` +
        `This will be removed in v8. ` +
        `Please wrap your chart with ChartThemeProvider for theming support. ` +
        `See https://mui.com/x/react-charts/migration-v8/ for more information.`,
    );
    hasWarned = true;
  }
}
```

#### 2.2: Update Package Dependencies

**File: `/packages/x-charts/package.json`**

```json
{
  "name": "@mui/x-charts",
  "dependencies": {
    "@floating-ui/react": "^0.26.0",
    "@mui/x-internals": "workspace:^",
    "@mui/utils": "^6.0.0",
    "prop-types": "^15.8.1"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
    "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "@mui/material": {
      "optional": true
    }
  }
}
```

### Phase 3: Documentation (Version N)

#### 3.1: Create Migration Guide

**File: `/docs/pages/x/migration/migration-charts-v7-to-v8.md`**

````markdown
# Migration from v7 to v8

## Removal of @mui/material dependency

The x-charts package no longer depends on `@mui/material`. This makes the charts more lightweight and framework-agnostic.

### Breaking Changes

#### Theme Provider

Previously, x-charts inherited theming from Material UI's `ThemeProvider`. Now you need to use `ChartThemeProvider`:

```diff
-import { ThemeProvider } from '@mui/material/styles';
+import { ChartThemeProvider } from '@mui/x-charts/theming';

-<ThemeProvider theme={muiTheme}>
+<ChartThemeProvider>
   <BarChart {...props} />
-</ThemeProvider>
+</ChartThemeProvider>
```
````

#### Using Material UI Theme

If you want to continue using your Material UI theme:

```tsx
import { useTheme } from '@mui/material/styles';
import { ChartThemeProvider, adaptMuiTheme } from '@mui/x-charts/theming';

function MyChart() {
  const muiTheme = useTheme();

  return (
    <ChartThemeProvider theme={adaptMuiTheme(muiTheme)}>
      <BarChart {...props} />
    </ChartThemeProvider>
  );
}
```

#### Custom Theming

You can provide a custom theme object:

```tsx
import { ChartThemeProvider } from '@mui/x-charts/theming';

const customTheme = {
  palette: {
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

<ChartThemeProvider theme={customTheme}>
  <BarChart {...props} />
</ChartThemeProvider>;
```

### Bundle Size Impact

Removing the @mui/material dependency reduces the bundle size by approximately 30-40KB (minified + gzipped).

### Styling Changes

Styled components have been replaced with inline styles and CSS variables. If you were customizing styles via the `styled` API, you now have these options:

1. Use the `style` prop
2. Use the `className` prop with external CSS
3. Wrap components in your own styled wrapper

### Component Replacements

- `Popper` from `@mui/material` → Internal `Popper` using `@floating-ui/react`
- `NoSsr` from `@mui/material` → Internal `NoSsr` implementation

These changes are transparent to end users.

````

#### 3.2: Update Examples

**File: `/docs/pages/x/react-charts/getting-started.md`**

```markdown
## Installation

```bash
npm install @mui/x-charts
````

## Basic Usage

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars() {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
      series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
      width={500}
      height={300}
    />
  );
}
```

## With Custom Theme

```tsx
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartThemeProvider } from '@mui/x-charts/theming';

const customTheme = {
  palette: {
    text: {
      primary: '#2c3e50',
    },
  },
};

export default function ThemedChart() {
  return (
    <ChartThemeProvider theme={customTheme}>
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
        series={[{ data: [4, 3, 5] }]}
        width={500}
        height={300}
      />
    </ChartThemeProvider>
  );
}
```

````

### Phase 4: Testing Strategy

#### 4.1: Create Migration Tests

**File: `/packages/x-charts/src/internals/theming/ThemeProvider.test.tsx`**

```typescript
import { expect } from 'chai';
import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { ChartThemeProvider, useChartTheme } from './ThemeProvider';
import { defaultTheme } from './types';

describe('ChartThemeProvider', () => {
  it('should provide default theme when no theme prop is passed', () => {
    const { result } = renderHook(() => useChartTheme(), {
      wrapper: ({ children }) => <ChartThemeProvider>{children}</ChartThemeProvider>,
    });

    expect(result.current).to.deep.equal(defaultTheme);
  });

  it('should merge custom theme with default theme', () => {
    const customTheme = {
      palette: {
        text: {
          primary: '#custom',
        },
      },
    };

    const { result } = renderHook(() => useChartTheme(), {
      wrapper: ({ children }) => (
        <ChartThemeProvider theme={customTheme}>{children}</ChartThemeProvider>
      ),
    });

    expect(result.current.palette.text.primary).to.equal('#custom');
    expect(result.current.palette.text.secondary).to.equal(defaultTheme.palette.text.secondary);
  });

  it('should deeply merge nested theme properties', () => {
    const customTheme = {
      typography: {
        fontSize: 16,
      },
    };

    const { result } = renderHook(() => useChartTheme(), {
      wrapper: ({ children }) => (
        <ChartThemeProvider theme={customTheme}>{children}</ChartThemeProvider>
      ),
    });

    expect(result.current.typography.fontSize).to.equal(16);
    expect(result.current.typography.fontFamily).to.equal(defaultTheme.typography.fontFamily);
  });
});
````

**File: `/packages/x-charts/src/internals/theming/adaptMuiTheme.test.ts`**

```typescript
import { expect } from 'chai';
import { adaptMuiTheme } from './adaptMuiTheme';
import { defaultTheme } from './types';

describe('adaptMuiTheme', () => {
  it('should adapt Material UI v5 theme', () => {
    const muiTheme = {
      palette: {
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
          secondary: 'rgba(0, 0, 0, 0.6)',
        },
        background: {
          paper: '#fff',
          default: '#fafafa',
        },
      },
      typography: {
        fontSize: 14,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      zIndex: {
        modal: 1300,
        tooltip: 1500,
      },
    };

    const result = adaptMuiTheme(muiTheme);

    expect(result.palette.text.primary).to.equal(muiTheme.palette.text.primary);
    expect(result.typography.fontSize).to.equal(muiTheme.typography.fontSize);
    expect(result.zIndex.modal).to.equal(muiTheme.zIndex.modal);
  });

  it('should handle missing properties with defaults', () => {
    const incompleteMuiTheme = {
      palette: {
        text: {
          primary: '#000',
        },
      },
    };

    const result = adaptMuiTheme(incompleteMuiTheme);

    expect(result.palette.text.primary).to.equal('#000');
    expect(result.palette.text.secondary).to.equal(
      defaultTheme.palette.text.secondary,
    );
    expect(result.typography.fontSize).to.equal(defaultTheme.typography.fontSize);
  });
});
```

#### 4.2: Visual Regression Tests

**File: `/packages/x-charts/src/ChartsTooltip/ChartsTooltipContainer.test.tsx`**

```typescript
import { expect } from 'chai';
import * as React from 'react';
import { screen } from '@testing-library/react';
import { createRenderer } from '@mui/internal-test-utils';
import { ChartThemeProvider } from '../internals/theming/ThemeProvider';
import { ChartsTooltipContainer } from './ChartsTooltipContainer';

describe('<ChartsTooltipContainer />', () => {
  const { render } = createRenderer();

  it('should apply theme styles correctly', () => {
    const customTheme = {
      zIndex: {
        modal: 9999,
        tooltip: 10000,
      },
    };

    render(
      <ChartThemeProvider theme={customTheme}>
        <ChartsTooltipContainer trigger="item" open>
          <div data-testid="tooltip-content">Tooltip</div>
        </ChartsTooltipContainer>
      </ChartThemeProvider>
    );

    const tooltipRoot = screen.getByTestId('tooltip-content').parentElement;
    const computedStyle = window.getComputedStyle(tooltipRoot!);

    expect(computedStyle.zIndex).to.equal('9999');
  });
});
```

### Phase 5: Rollout Timeline

#### Version 7.x (Current - Preparation)

- ✅ Add new theme system alongside existing Material UI integration
- ✅ Add `ChartThemeProvider` as optional
- ✅ Add `adaptMuiTheme` helper
- ✅ Internal components (`Popper`, `NoSsr`) created but not used
- ✅ Documentation written but marked as "coming in v8"
- ✅ Deprecation warnings in development mode

#### Version 8.0 (Breaking Release)

- 🔄 Switch to new theme system by default
- 🔄 Remove `@mui/material` from dependencies
- 🔄 Make `@mui/material` an optional peer dependency
- 🔄 Update all examples in documentation
- 🔄 Migration guide published
- 🔄 Codemods for automatic migration (if feasible)

#### Version 8.1+ (Stabilization)

- 📝 Address user feedback
- 📝 Add more theming examples
- 📝 Performance optimizations based on real-world usage
- 📝 Consider removing Material UI peer dependency entirely

## Implementation Checklist

### Phase 1: Foundation

- [ ] Create `/packages/x-charts/src/internals/components/Popper.tsx`
- [ ] Create `/packages/x-charts/src/internals/components/NoSsr.tsx`
- [ ] Create `/packages/x-charts/src/internals/theming/types.ts`
- [ ] Create `/packages/x-charts/src/internals/theming/ThemeProvider.tsx`
- [ ] Create `/packages/x-charts/src/internals/theming/adaptMuiTheme.ts`
- [ ] Create `/packages/x-charts/src/internals/theming/cssVariables.ts`
- [ ] Add `@floating-ui/react` to dependencies
- [ ] Migrate `packages/x-charts/src/ChartsReferenceLine/common.tsx`
- [ ] Migrate `ChartsTooltipContainer.tsx`

### Phase 2: Migration

- [ ] Create utility to identify all styled components across x-charts
- [ ] Migrate all `styled()` usage to inline styles + theme
- [ ] Replace all `@mui/material` component imports
- [ ] Update prop types and TypeScript definitions
- [ ] Run `pnpm proptypes` to regenerate PropTypes
- [ ] Run `pnpm docs:api` to update API docs

### Phase 3: Testing

- [ ] Write unit tests for new theme system
- [ ] Write tests for `adaptMuiTheme`
- [ ] Create visual regression tests
- [ ] Test with various Material UI theme configurations
- [ ] Test without Material UI in the project
- [ ] Run `pnpm test:unit --run --project 'x-charts*'`
- [ ] Run `pnpm test:browser --run --project 'x-charts*'`

### Phase 4: Documentation

- [ ] Write migration guide
- [ ] Update all code examples in docs
- [ ] Create theming documentation page
- [ ] Add FAQ section for common migration issues
- [ ] Run `pnpm docs:typescript:formatted`

### Phase 5: Cleanup

- [ ] Remove all `@mui/material` imports
- [ ] Update `package.json` dependencies
- [ ] Remove deprecated code paths
- [ ] Run `pnpm generate:exports`
- [ ] Run `pnpm prettier`
- [ ] Run `pnpm eslint`

## Rollback Strategy

If critical issues are discovered:

1. **Version 8.0.1** - Quick patch with compatibility layer
2. **Version 8.1** - Re-introduce Material UI as required dependency with deprecation
3. **Version 9.0** - Attempt removal again with learnings applied

## Success Metrics

- Bundle size reduction: Target 30-40KB
- No increase in runtime performance overhead
- Migration completion rate in community projects: Target >70% within 6 months
- GitHub issues related to migration: Target <50 in first 3 months
- npm download count maintains or increases

## Risks & Mitigation

| Risk                               | Impact | Mitigation                                                      |
| ---------------------------------- | ------ | --------------------------------------------------------------- |
| Breaking changes affect many users | High   | Comprehensive migration guide, codemods, clear timeline         |
| Performance regression             | Medium | Extensive benchmarking, inline styles optimization              |
| Theme system incompleteness        | Medium | Start with Material UI compatibility, iterate based on feedback |
| Community resistance               | Low    | Clear communication of benefits, optional compatibility layer   |

## Additional Considerations

### Other x-charts Packages

This plan should be extended to:

- `@mui/x-charts-pro`
- `@mui/x-charts-premium`
- `@mui/x-charts-vendor` (if applicable)

Each package should follow the same migration pattern.

### Backward Compatibility

Consider providing a compatibility package:

```bash
npm install @mui/x-charts-material-compat
```

This package could provide drop-in replacements that automatically bridge Material UI themes to Chart themes, easing migration for large codebases.

### Performance Considerations

- Inline styles in SVG are performant for charts
- Consider memoization for theme-based style calculations
- CSS variables can be used for runtime theme switching
- Benchmark against current implementation

### Future Enhancements

Once Material UI dependency is removed:

- Consider supporting other design systems (Chakra UI, Ant Design, etc.)
- Provide theme presets for popular design systems
- Build a theme builder/customizer tool
- Support CSS custom properties for easier customization
