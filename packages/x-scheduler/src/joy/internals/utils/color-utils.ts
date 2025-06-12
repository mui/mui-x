import * as React from 'react';
import { CalendarResource } from '../../models/resource';

// TODO: Add support for event.color and props.color
export function getEventColorCSSVars(
  parameters: GetEventColorCSSVarsParameters,
): React.CSSProperties {
  const { resource } = parameters;
  const color = resource?.color;

  if (color == null) {
    return {};
  }

  return {
    '--event-color-1': `var(--${color}-1)`,
    '--event-color-2': `var(--${color}-2)`,
    '--event-color-3': `var(--${color}-3)`,
    '--event-color-4': `var(--${color}-4)`,
    '--event-color-5': `var(--${color}-5)`,
    '--event-color-6': `var(--${color}-6)`,
    '--event-color-7': `var(--${color}-7)`,
    '--event-color-8': `var(--${color}-8)`,
    '--event-color-9': `var(--${color}-9)`,
    '--event-color-10': `var(--${color}-10)`,
    '--event-color-11': `var(--${color}-11)`,
    '--event-color-12': `var(--${color}-12)`,
  } as React.CSSProperties;
}

interface GetEventColorCSSVarsParameters {
  resource: CalendarResource | undefined;
}
