import { TimelineView } from '../models';
import { SchedulerState, SchedulerParameters } from '../utils/SchedulerStore';

export interface TimelineState extends SchedulerState {
  /**
   * The view displayed in the timeline.
   */
  view: TimelineView;
  /**
   * The views available in the timeline.
   */
  views: TimelineView[];
}

export interface TimelineParameters extends SchedulerParameters {
  /**
   * The view currently displayed in the timeline.
   */
  view?: TimelineView;
  /**
   * The view initially displayed in the timeline.
   * To render a controlled timeline, use the `view` prop.
   * @default "time"
   */
  defaultView?: TimelineView;
  /**
   * The views available in the timeline.
   * @default ["time", "days", "weeks", "months", "years"]
   */
  views?: TimelineView[];
  /**
   * Event handler called when the view changes.
   */
  onViewChange?: (view: TimelineView, event: React.UIEvent | Event) => void;
}
