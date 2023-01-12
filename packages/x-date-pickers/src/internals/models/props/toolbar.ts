import * as React from 'react';
import { DateOrTimeView } from '../views';

export interface BaseToolbarProps<TValue, TView extends DateOrTimeView>
  extends ExportedBaseToolbarProps {
  /**
   * If `true`, show the toolbar even in desktop mode.
   * @default `true` for Desktop, `false` for Mobile (based on the chosen wrapper and `desktopModeMediaQuery` prop), `displayStaticWrapperAs === 'desktop'` for `Static` pickers
   */
  hidden?: boolean;
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
  // TODO v6: Drop with the legacy pickers
  isMobileKeyboardViewOpen?: boolean;
  // TODO v6: Drop with the legacy pickers
  toggleMobileKeyboardView?: () => void;
}

export interface ExportedBaseToolbarProps extends Pick<BaseToolbarProps<any, any>, 'hidden'> {
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
