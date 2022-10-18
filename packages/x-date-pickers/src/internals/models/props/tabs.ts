import { CalendarOrClockPickerView } from '../views';

export interface BaseTabsProps {
  /**
   * Currently visible picker view..
   */
  view: CalendarOrClockPickerView;
  /**
   * Callback called when a tab is clicked
   * @param {CalendarOrClockPickerView} view The view to open
   */
  onViewChange: (view: CalendarOrClockPickerView) => void;
}

export interface ExportedBaseTabsProps {}
