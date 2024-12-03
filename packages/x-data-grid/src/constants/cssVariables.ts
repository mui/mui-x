const spacingUnit = '--DataGrid-t-spacing-unit';

const breakpoints = {
  // These come from material-ui, they can't be configured by the theme.
  // We might want to provide an option to configure them globally.
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
  spacing,
  spacingUnit,

  breakpoints,

  palette: {
    background: {
      default: '--DataGrid-t-palette-background-default',
      /** Equivalent to "paper", used for elements floating above other ones. */
      elevated: '--DataGrid-t-palette-background-elevated',
    },
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
