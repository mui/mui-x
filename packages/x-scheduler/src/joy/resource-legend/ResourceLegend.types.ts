import { CalendarResource, CalendarResourceId } from '../models/resource';

export interface ResourceLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  resources: CalendarResource[];
  visibleResourceIds: CalendarResourceId[];
  onResourceVisibilityChange: (event: React.SyntheticEvent, value: CalendarResourceId) => void;
}
