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

const keys = {
  spacingUnit: '--DataGrid-t-spacing-unit',

  /* Variables */
  colors: {
    border: {
      base: '--DataGrid-t-color-border-base',
    },
    foreground: {
      base: '--DataGrid-t-color-foreground-base',
      muted: '--DataGrid-t-color-foreground-muted',
      accent: '--DataGrid-t-color-foreground-accent',
      disabled: '--DataGrid-t-color-foreground-disabled',
    },
    background: {
      base: '--DataGrid-t-color-background-base',
      overlay: '--DataGrid-t-color-background-overlay',
      backdrop: '--DataGrid-t-color-background-backdrop',
    },
    interactive: {
      hover: '--DataGrid-t-color-interactive-hover',
      hoverOpacity: '--DataGrid-t-color-interactive-hover-opacity',
      focus: '--DataGrid-t-color-interactive-focus',
      focusOpacity: '--DataGrid-t-color-interactive-focus-opacity',
      disabled: '--DataGrid-t-color-interactive-disabled',
      disabledOpacity: '--DataGrid-t-color-interactive-disabled-opacity',
      selected: '--DataGrid-t-color-interactive-selected',
      selectedOpacity: '--DataGrid-t-color-interactive-selected-opacity',
    },
  },
  header: {
    background: {
      base: '--DataGrid-t-header-background-base',
    },
  },
  cell: {
    background: {
      pinned: '--DataGrid-t-cell-background-pinned',
    },
  },
  radius: {
    base: '--DataGrid-t-radius-base',
  },
  typography: {
    font: {
      body: '--DataGrid-t-typography-font-body',
      small: '--DataGrid-t-typography-font-small',
      large: '--DataGrid-t-typography-font-large',
    },
    fontFamily: {
      base: '--DataGrid-t-typography-font-family-base',
    },
    fontWeight: {
      light: '--DataGrid-t-typography-font-weight-light',
      regular: '--DataGrid-t-typography-font-weight-regular',
      medium: '--DataGrid-t-typography-font-weight-medium',
      bold: '--DataGrid-t-typography-font-weight-bold',
    },
  },
  transitions: {
    easing: {
      easeIn: '--DataGrid-t-transition-easing-ease-in',
      easeOut: '--DataGrid-t-transition-easing-ease-out',
      easeInOut: '--DataGrid-t-transition-easing-ease-in-out',
    },
    duration: {
      short: '--DataGrid-t-transition-duration-short',
      base: '--DataGrid-t-transition-duration-base',
      long: '--DataGrid-t-transition-duration-long',
    },
  },
  shadows: {
    base: '--DataGrid-t-shadow-base',
    overlay: '--DataGrid-t-shadow-overlay',
  },
  zIndex: {
    panel: '--DataGrid-t-z-index-panel',
    menu: '--DataGrid-t-z-index-menu',
  },
} as const;

export type GridCSSVariablesInterface = {
  [E in CreateObjectEntries<typeof keys> as E['value']]: string | number;
};

type Entry = { key: string; value: unknown };
type EmptyEntry<TValue> = { key: ''; value: TValue };

type CreateObjectEntries<TValue, TValueInitial = TValue> = TValue extends object
  ? {
      [TKey in keyof TValue]-?: TKey extends string
        ? OmitItself<TValue[TKey], TValueInitial> extends infer TNestedValue
          ? TNestedValue extends Entry
            ? {
                key: `${TKey}.${TNestedValue['key']}`;
                value: TNestedValue['value'];
              }
            : never
          : never
        : never;
    }[keyof TValue]
  : EmptyEntry<TValue>;

type OmitItself<TValue, TValueInitial> = TValue extends TValueInitial
  ? EmptyEntry<TValue>
  : CreateObjectEntries<TValue, TValueInitial>;

const values = wrap(keys);

export const vars = {
  breakpoints,
  spacing,
  transition,
  keys,
  ...values,
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

function transition(
  props: string[],
  options?: {
    duration?: string;
    easing?: string;
    delay?: number;
  },
) {
  const {
    duration = vars.transitions.duration.base,
    easing = vars.transitions.easing.easeInOut,
    delay = 0,
  } = options ?? {};
  return props.map((prop) => `${prop} ${duration} ${easing} ${delay}ms`).join(', ');
}

function wrap<T>(input: T): T {
  if (typeof input === 'string') {
    return `var(${input})` as any;
  }
  const result = {} as any;
  for (const key in input as any) {
    if (Object.hasOwn(input as any, key)) {
      result[key] = wrap((input as any)[key]);
    }
  }
  return result;
}
