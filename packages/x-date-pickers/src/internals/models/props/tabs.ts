import { DateOrTimeViewWithMeridiem } from '../common';

export interface BaseTabsProps<TView extends DateOrTimeViewWithMeridiem> {
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
  className?: string;
}

export interface ExportedBaseTabsProps {}
