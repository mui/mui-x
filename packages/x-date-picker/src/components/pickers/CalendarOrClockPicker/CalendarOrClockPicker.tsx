import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useViews } from '../../../hooks/useViews';
import { ClockPickerInternal } from '../../ClockPicker/ClockPickerInternal';
import { CalendarPicker } from '../../CalendarPicker';
import { KeyboardDateInput } from '../../../internal/pickers/KeyboardDateInput';
import { useIsLandscape } from '../../../hooks/useIsLandscape';
import { WrapperVariant, WrapperVariantContext } from '../../../internal/pickers/wrappers/WrapperVariantContext';
import { DateInputPropsLike } from '../../../internal/pickers/wrappers/WrapperProps';
import { PickerSelectionState } from '../../../hooks/usePickerState';
import { BasePickerProps, CalendarAndClockProps, BaseToolbarProps } from '../../../internal/pickers/typings/BasePicker';
import { PickerViewRoot } from '../../views/PickerViewRoot';
import { CalendarOrClockPickerView, CalendarPickerView, ClockPickerView } from '../../../models';

export interface ExportedCalendarOrClockPickerProps<View extends CalendarOrClockPickerView>
  extends Omit<BasePickerProps<unknown, unknown>, 'value' | 'onChange'>,
    Omit<CalendarAndClockProps<unknown>, 'onViewChange' | 'openTo' | 'view'> {
  dateRangeIcon?: React.ReactNode;
  /**
   * Callback fired on view change.
   * @param {View} view The new view.
   */
  onViewChange?: (view: View) => void;
  /**
   * First view to show.
   */
  openTo: View;
  timeIcon?: React.ReactNode;
  /**
   * Array of views to show.
   */
  views: readonly View[];
}

export interface CalendarOrClockPickerProps<View extends CalendarOrClockPickerView>
  extends ExportedCalendarOrClockPickerProps<View> {
  autoFocus?: boolean;
  date: any;
  DateInputProps: DateInputPropsLike;
  isMobileKeyboardViewOpen: boolean;
  onDateChange: (
    date: any,
    currentWrapperVariant: WrapperVariant,
    isFinish?: PickerSelectionState,
  ) => void;
  toggleMobileKeyboardView: () => void;
}

export const MobileKeyboardInputView = styled('div')({
  padding: '16px 24px',
});

const PickerRoot = styled('div', { skipSx: true })<{ ownerState: { isLandscape: boolean } }>(
  ({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    ...(ownerState.isLandscape && {
      flexDirection: 'row',
    }),
  }),
);

const MobileKeyboardTextFieldProps = { fullWidth: true };

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export function CalendarOrClockPicker<View extends CalendarOrClockPickerView>(props: CalendarOrClockPickerProps<View>) {
  const {
    autoFocus,
    className,
    date,
    DateInputProps,
    isMobileKeyboardViewOpen,
    onDateChange,
    onViewChange,
    openTo,
    orientation,
    showToolbar,
    toggleMobileKeyboardView,
    ToolbarComponent = () => null,
    toolbarFormat,
    toolbarPlaceholder,
    toolbarTitle,
    views,
    ...other
  } = props;
  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const toShowToolbar =
    typeof showToolbar === 'undefined' ? wrapperVariant !== 'desktop' : showToolbar;

  const handleDateChange = React.useCallback(
    (newDate: unknown, selectionState?: PickerSelectionState) => {
      onDateChange(newDate, wrapperVariant, selectionState);
    },
    [onDateChange, wrapperVariant],
  );

  const handleViewChange = React.useCallback(
    (newView: View) => {
      if (isMobileKeyboardViewOpen) {
        toggleMobileKeyboardView();
      }
      if (onViewChange) {
        onViewChange(newView);
      }
    },
    [isMobileKeyboardViewOpen, onViewChange, toggleMobileKeyboardView],
  );

  const { openView, nextView, previousView, setOpenView, handleChangeAndOpenNext } = useViews({
    view: undefined,
    views,
    openTo,
    onChange: handleDateChange,
    onViewChange: handleViewChange,
  });

  return (
    <PickerRoot ownerState={{ isLandscape }}>
      {toShowToolbar && (
        <ToolbarComponent
          {...other}
          views={views}
          isLandscape={isLandscape}
          date={date}
          onChange={handleDateChange}
          setOpenView={setOpenView as NonNullable<BaseToolbarProps<unknown>['setOpenView']>}
          openView={openView}
          toolbarTitle={toolbarTitle}
          toolbarFormat={toolbarFormat}
          toolbarPlaceholder={toolbarPlaceholder}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
        />
      )}

      <PickerViewRoot>
        {isMobileKeyboardViewOpen ? (
          <MobileKeyboardInputView>
            <KeyboardDateInput
              {...DateInputProps}
              ignoreInvalidInputs
              disableOpenPicker
              TextFieldProps={MobileKeyboardTextFieldProps}
            />
          </MobileKeyboardInputView>
        ) : (
          <React.Fragment>
            {isDatePickerView(openView) && (
              <CalendarPicker
                autoFocus={autoFocus}
                date={date}
                onViewChange={setOpenView as CalendarAndClockProps<unknown>['onViewChange']}
                onChange={handleChangeAndOpenNext}
                view={openView}
                // Unclear why the predicate `isDatePickerView` does not imply the casted type
                views={views.filter(isDatePickerView) as CalendarPickerView[]}
                {...other}
              />
            )}

            {isTimePickerView(openView) && (
              <ClockPickerInternal
                {...other}
                autoFocus={autoFocus}
                date={date}
                view={openView}
                onChange={handleChangeAndOpenNext}
                openNextView={() => setOpenView(nextView)}
                openPreviousView={() => setOpenView(previousView)}
                nextViewAvailable={!nextView}
                previousViewAvailable={!previousView || isDatePickerView(previousView)}
                showViewSwitcher={wrapperVariant === 'desktop'}
              />
            )}
          </React.Fragment>
        )}
      </PickerViewRoot>
    </PickerRoot>
  );
}
