import { DateOrTimeView } from '../../../models';
import { DateOrTimeViewWithMeridiem } from '../common';

export interface BaseTabsProps<TView extends DateOrTimeViewWithMeridiem | DateOrTimeView> {
  /**
   * Currently visible picker view.
   */
  view: TView;
  /**
   * Callback called when a tab is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: (view: TView) => void;
}

export interface ExportedBaseTabsProps {}
