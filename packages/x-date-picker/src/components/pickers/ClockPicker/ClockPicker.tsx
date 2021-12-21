import * as React from 'react';
import { ClockPickerInternal, ClockPickerInternalProps } from './ClockPickerInternal';
import { ClockPickerView } from '../../../models';
import { PickerViewRoot } from '../PickerViewRoot';
import { useViews } from '../../../hooks/useViews';

export interface ClockPickerProps<TDate>
  extends Omit<
    ClockPickerInternalProps<TDate>,
    'view' | 'openNextView' | 'openPreviousView' | 'nextViewAvailable' | 'previousViewAvailable'
  > {
  className?: string;
  /**
   * Callback fired on view change.
   * @param {ClockPickerView} view The new view.
   */
  onViewChange?: (view: ClockPickerView) => void;
  /**
   * Initially opened view.
   */
  openTo?: ClockPickerView;
  /**
   * Controlled clock view.
   */
  view?: ClockPickerView;
  /**
   * Available views for clock.
   */
  views?: readonly ClockPickerView[];
}

/**
 * Wrapping public API for better standalone usage of './ClockPicker'
 * @ignore - internal component.
 */
export const ClockPicker = React.forwardRef(function ClockPicker<TDate>(
  props: ClockPickerProps<TDate>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { view, openTo, className, onViewChange, views = ['hours', 'minutes'], ...other } = props;

  const { openView, setOpenView, nextView, previousView } = useViews({
    view,
    views,
    openTo,
    onViewChange,
    onChange: other.onChange,
  });

  return (
    <PickerViewRoot className={className} ref={ref}>
      <ClockPickerInternal<TDate>
        view={openView}
        nextViewAvailable={Boolean(nextView)}
        previousViewAvailable={Boolean(previousView)}
        openNextView={() => setOpenView(nextView)}
        openPreviousView={() => setOpenView(previousView)}
        {...other}
      />
    </PickerViewRoot>
  );
}) as <TDate>(props: ClockPickerProps<TDate> & React.RefAttributes<HTMLDivElement>) => JSX.Element;
