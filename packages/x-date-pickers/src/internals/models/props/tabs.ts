import { CalendarOrClockPickerView } from '../views';

export interface BaseTabsProps {
  /**
   * View currently visible in the picker.
   */
  view: CalendarOrClockPickerView;
  /**
   * Callback called when a tab is clicked
   * @param {CalendarOrClockPickerView} view The view to open
   */
  onViewChange: (view: CalendarOrClockPickerView) => void;
}

export interface ExportedBaseTabsProps {}
