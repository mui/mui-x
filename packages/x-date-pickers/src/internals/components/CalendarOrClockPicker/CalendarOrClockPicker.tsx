import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DateTimePickerTabsProps } from '../../../DateTimePicker';
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
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import { DateInputPropsLike } from '../wrappers/WrapperProps';
import { PickerStatePickerProps } from '../../hooks/usePickerState';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { PickerViewRoot } from '../PickerViewRoot';
import { CalendarOrClockPickerView, CalendarPickerView, ClockPickerView } from '../../models';
import { BaseToolbarProps } from '../../models/props/baseToolbarProps';

export interface CalendarOrClockPickerSlotsComponent extends CalendarPickerSlotsComponent {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  Tabs: React.ElementType<DateTimePickerTabsProps>;
}

export interface CalendarOrClockPickerSlotsComponentsProps
  extends CalendarPickerSlotsComponentsProps {
  tabs: Omit<DateTimePickerTabsProps, 'onChange' | 'view'>;
}

export interface ExportedCalendarOrClockPickerProps<TDate, View extends CalendarOrClockPickerView>
  extends Omit<BasePickerProps<any, TDate | null>, 'value' | 'onChange'>,
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
   * Overrideable components.
   * @default {}
   */
  components?: Partial<CalendarOrClockPickerSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<CalendarOrClockPickerSlotsComponentsProps>;
  toolbarFormat?: string;
  toolbarPlaceholder?: React.ReactNode;
  toolbarTitle?: React.ReactNode;
  hideTabs?: boolean;
}

export interface CalendarOrClockPickerProps<TDate, View extends CalendarOrClockPickerView>
  extends ExportedCalendarOrClockPickerProps<TDate, View>,
    PickerStatePickerProps<TDate | null> {
  autoFocus?: boolean;
  DateInputProps: DateInputPropsLike;
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate, TDate | null>>;
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

let warnedOnceNotValidOpenTo = false;

export function CalendarOrClockPicker<TDate, View extends CalendarOrClockPickerView>(
  props: CalendarOrClockPickerProps<TDate, View>,
) {
  const {
    autoFocus,
    className,
    parsedValue,
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
    dateRangeIcon,
    timeIcon,
    hideTabs,
    ...other
  } = props;
  const TabsComponent = other.components?.Tabs;
  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);

  const toShowToolbar = showToolbar ?? wrapperVariant !== 'desktop';
  const showTabs = !hideTabs && typeof window !== 'undefined' && window.innerHeight > 667;

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

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TDate | null, View>({
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
          parsedValue={parsedValue}
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
      {showTabs && !!TabsComponent && (
        <TabsComponent
          dateRangeIcon={dateRangeIcon}
          timeIcon={timeIcon}
          view={openView}
          onChange={setOpenView as (view: CalendarOrClockPickerView) => void}
          {...other.componentsProps?.tabs}
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
                value={parsedValue}
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
                value={parsedValue}
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
