import { TimelineParameters } from '../../primitives/use-timeline';

export type TimelineView = 'hours' | 'days' | 'weeks' | 'months' | 'years';

// TODO: Add translations
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement>, TimelineParameters {}
