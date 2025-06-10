import { SchedulerValidDate } from '../../../../primitives/utils/adapter/types';
import { BaseViewProps } from '../../../models/views';

export interface TimeGridProps extends BaseViewProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerValidDate[];
}
