import { CalendarResource } from '../../models/resource';

// TODO: Add support for event.color and props.color
export function getColorClassName(parameters: GetColorClassNameParameters): string {
  const { resource } = parameters;
  const color = resource?.color ?? 'primary';

  return `palette-${color}`;
}

interface GetColorClassNameParameters {
  resource: CalendarResource | undefined;
}
