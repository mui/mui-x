import type * as React from 'react';

/**
 * Returns the typography variant without its nested rules (media queries, selectors),
 * so it can be passed to an inline `style` prop.
 * Inline styles can't hold nested rules: React ignores them and warns in development.
 * @param variant A theme typography variant, for example `theme.typography.caption`.
 * @returns The variant's flat CSS properties.
 */
export function getInlineTypographyStyle(variant: object): React.CSSProperties {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(variant)) {
    if (value === null || typeof value !== 'object') {
      result[key] = value;
    }
  }

  return result as React.CSSProperties;
}
