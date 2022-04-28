import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useViews, PickerOnChangeFn } from '../../hooks/useViews';
import { ClockPicker, ExportedClockPickerProps } from '../../../ClockPicker/ClockPicker';
import {
  CalendarPicker,
  CalendarPickerSlotsComponent,
  CalendarPickerSlotsComponentsProps,
  ExportedCalendarPickerProps,
} from '../../../CalendarPicker/CalendarPicker';
import { KeyboardDateInput } from '../KeyboardDateInput';
import { useIsLandscape } from '../../hooks/useIsLandscape';
import { WrapperVariant, WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import { DateInputPropsLike } from '../wrappers/WrapperProps';
import { PickerSelectionState } from '../../hooks/usePickerState';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { PickerViewRoot } from '../PickerViewRoot';
import { CalendarOrClockPickerView, CalendarPickerView, ClockPickerView } from '../../models';

export interface CalendarOrClockPickerSlotsComponent extends CalendarPickerSlotsComponent {}

export interface CalendarOrClockPickerSlotsComponentsProps
  extends CalendarPickerSlotsComponentsProps {}

export interface ExportedCalendarOrClockPickerProps<TDate, View extends CalendarOrClockPickerView>
  extends Omit<BasePickerProps<unknown, TDate>, 'value' | 'onChange'>,
    Omit<ExportedCalendarPickerProps<TDate>, 'onViewChange' | 'openTo' | 'view'>,
    ExportedClockPickerProps<TDate> {
  dateRangeIcon?: React.ReactNode;
  /**
   * Callback fired on view change.
   * @template View
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
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<CalendarOrClockPickerSlotsComponent>;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  componentsProps?: Partial<CalendarOrClockPickerSlotsComponentsProps>;
}

export interface CalendarOrClockPickerProps<TDate, View extends CalendarOrClockPickerView>
  extends ExportedCalendarOrClockPickerProps<TDate, View> {
  autoFocus?: boolean;
  date: TDate | null;
  DateInputProps: DateInputPropsLike;
  isMobileKeyboardViewOpen: boolean;
  onDateChange: (
    date: TDate | null,
    currentWrapperVariant: WrapperVariant,
    isFinish?: PickerSelectionState,
  ) => void;
  toggleMobileKeyboardView: () => void;
}

export const MobileKeyboardInputView = styled('div')({
  padding: '16px 24px',
});

const PickerRoot = styled('div')<{ ownerState: { isLandscape: boolean } }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(ownerState.isLandscape && {
    flexDirection: 'row',
  }),
}));

const MobileKeyboardTextFieldProps = { fullWidth: true };

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

export function CalendarOrClockPicker<TDate, View extends CalendarOrClockPickerView>(
  props: CalendarOrClockPickerProps<TDate, View>,
) {
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

  const handleDateChange = React.useCallback<PickerOnChangeFn<TDate>>(
    (newDate, selectionState) => {
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

  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TDate, View>({
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
          setOpenView={setOpenView as (view: CalendarOrClockPickerView) => void}
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
                onViewChange={setOpenView as (view: CalendarPickerView) => void}
                onChange={handleChangeAndOpenNext}
                view={openView}
                // Unclear why the predicate `isDatePickerView` does not imply the casted type
                views={views.filter(isDatePickerView) as CalendarPickerView[]}
                {...other}
              />
            )}

            {isTimePickerView(openView) && (
              <ClockPicker
                {...other}
                autoFocus={autoFocus}
                date={date}
                view={openView}
                // Unclear why the predicate `isDatePickerView` does not imply the casted type
                views={views.filter(isTimePickerView) as ClockPickerView[]}
                onChange={handleChangeAndOpenNext}
                onViewChange={setOpenView as (view: ClockPickerView) => void}
                showViewSwitcher={wrapperVariant === 'desktop'}
              />
            )}
          </React.Fragment>
        )}
      </PickerViewRoot>
    </PickerRoot>
  );
}
