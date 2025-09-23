import { TimelineView } from '../Timeline.types';

export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  view?: TimelineView;
}
