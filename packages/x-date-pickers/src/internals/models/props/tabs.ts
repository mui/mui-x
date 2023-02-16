import { DateOrTimeView } from '../views';

export interface BaseTabsProps<TView extends DateOrTimeView> {
  /**
   * Currently visible picker view.
   */
  view: TView;
  /**
   * Available views.
   */
  views: readonly TView[];
  /**
   * Callback called when a tab is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: (view: TView) => void;
}

export interface ExportedBaseTabsProps {}
