const spacingUnit = '--DataGrid-t-spacing-unit';

// NOTE: Breakpoints can't come from the theme because we need access to them at
// initialization time and media-queries can't use CSS variables. For users with
// custom breakpoints, we might want to provide a way to configure them globally
// instead of through the theme.
const breakpoints = {
  values: {
    xs: 0, // phone
    sm: 600, // tablet
    md: 900, // small laptop
    lg: 1200, // desktop
    xl: 1536, // large screen
  },
  up: (key: any) => {
    const values = breakpoints.values as any;
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (min-width:${value}px)`;
  },
};

export const vars = {
  /* Helpers */
  /** @usage `...vars.props(vars.typography.body)` */
  props,
  breakpoints,
  spacing,
  spacingUnit,

  /* Variables */
  colors: {
    foreground: {
      base: '--DataGrid-t-colors-foreground-base',
      muted: '--DataGrid-t-colors-foreground-muted',
      disabled: '--DataGrid-t-colors-foreground-disabled',
    },
    background: {
      base: '--DataGrid-t-colors-background-base',
      overlay: '--DataGrid-t-colors-background-overlay',
    },
    interactive: {
      hover: '--DataGrid-t-colors-interactive-hover',
      hoverOpacity: '--DataGrid-t-colors-interactive-hover-opacity',
      focus: '--DataGrid-t-colors-interactive-focus',
      focusOpacity: '--DataGrid-t-colors-interactive-focus-opacity',
      disabled: '--DataGrid-t-colors-interactive-disabled',
      disabledOpacity: '--DataGrid-t-colors-interactive-disabled-opacity',
      selected: '--DataGrid-t-colors-interactive-selected',
      selectedOpacity: '--DataGrid-t-colors-interactive-selected-opacity',
    },
    border: {
      base: '--DataGrid-t-colors-border-base',
    },
  },
  radius: {
    base: '--DataGrid-t-radius-base',
  },
  typography: {
    fontFamily: {
      base: '--DataGrid-t-typography-font-family-base',
    },
    fontWeight: {
      light: '--DataGrid-t-typography-font-weight-light',
      regular: '--DataGrid-t-typography-font-weight-regular',
      medium: '--DataGrid-t-typography-font-weight-medium',
      bold: '--DataGrid-t-typography-font-weight-bold',
    },
    body: {
      fontFamily: '--DataGrid-t-typography-body-font-family',
      fontSize: '--DataGrid-t-typography-body-font-size',
      fontWeight: '--DataGrid-t-typography-body-font-weight',
      letterSpacing: '--DataGrid-t-typography-body-letter-spacing',
      lineHeight: '--DataGrid-t-typography-body-line-height',
    },
    small: {
      fontFamily: '--DataGrid-t-typography-small-font-family',
      fontSize: '--DataGrid-t-typography-small-font-size',
      fontWeight: '--DataGrid-t-typography-small-font-weight',
      letterSpacing: '--DataGrid-t-typography-small-letter-spacing',
      lineHeight: '--DataGrid-t-typography-small-line-height',
    },
  },
  transitions: {
    easing: {
      easeIn: '--DataGrid-t-transitions-easing-ease-in',
      easeOut: '--DataGrid-t-transitions-easing-ease-out',
      easeInOut: '--DataGrid-t-transitions-easing-ease-in-out',
    },
    duration: {
      short: '--DataGrid-t-transitions-duration-short',
      base: '--DataGrid-t-transitions-duration-base',
      long: '--DataGrid-t-transitions-duration-long',
    },
  },
  zIndex: {
    panel: '--DataGrid-t-z-index-panel',
    menu: '--DataGrid-t-z-index-menu',
  },
};

function spacing(a?: number, b?: number, c?: number, d?: number) {
  /* eslint-disable prefer-template */
  if (a === undefined) {
    return spacingString(1);
  }
  if (b === undefined) {
    return spacingString(a);
  }
  if (c === undefined) {
    return spacingString(a) + ' ' + spacingString(b);
  }
  if (d === undefined) {
    return spacingString(a) + ' ' + spacingString(b) + ' ' + spacingString(c);
  }
  return (
    spacingString(a) + ' ' + spacingString(b) + ' ' + spacingString(c) + ' ' + spacingString(d)
  );
  /* eslint-enable prefer-template */
}

function spacingString(value: number) {
  if (value === 0) {
    return '0';
  }
  return `calc(var(--DataGrid-t-spacing-unit) * ${value})`;
}

function props(input: Record<string, string>) {
  const result = {} as Record<string, string>;
  for (const key in input) {
    result[key] = `var(${input[key]})`;
  }
  return result;
}
