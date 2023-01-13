import * as React from 'react';
import { DateOrTimeView } from '../views';

export interface BaseToolbarProps<TValue, TView extends DateOrTimeView>
  extends ExportedBaseToolbarProps {
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  value: TValue;
  /**
   * Currently visible picker view.
   */
  view: TView;
  /**
   * Callback called when a toolbar is clicked
   * @template TView
   * @param {TView} view The view to open
   */
  onViewChange: (view: TView) => void;
  views: readonly DateOrTimeView[];
  disabled?: boolean;
  readOnly?: boolean;
}

export interface ExportedBaseToolbarProps {
  /**
   * Toolbar date format.
   */
  toolbarFormat?: string;
  /**
   * Toolbar value placeholder—it is displayed when the value is empty.
   * @default "––"
   */
  toolbarPlaceholder?: React.ReactNode;
  /**
   * className applied to the root component.
   */
  className?: string;
}
