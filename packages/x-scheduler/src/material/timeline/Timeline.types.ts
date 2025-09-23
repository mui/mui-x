import { TimelineParameters } from '../../primitives/use-timeline';
import { ViewSwitcherTranslations } from '../models/translations';

export type TimelineView = Extract<
  keyof ViewSwitcherTranslations,
  'time' | 'days' | 'weeks' | 'months' | 'years'
>;

// TODO: Add translations
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement>, TimelineParameters {}
