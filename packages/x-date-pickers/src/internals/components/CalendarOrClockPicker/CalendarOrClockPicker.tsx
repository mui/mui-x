import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useViews, PickerOnChangeFn } from '../../hooks/useViews';
import { TimeClock, ExportedTimeClockProps } from '../../../TimeClock/TimeClock';
import {
  DateCalendar,
  DateCalendarSlotsComponent,
  DateCalendarSlotsComponentsProps,
} from '../../../DateCalendar';
import { ExportedDateCalendarProps } from '../../../DateCalendar/DateCalendar';
import { KeyboardDateInput } from '../KeyboardDateInput';
import { useIsLandscape } from '../../hooks/useIsLandscape';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import { DateInputPropsLike } from '../wrappers/WrapperProps';
import { PickerStatePickerProps } from '../../hooks/usePickerState';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { PickerViewRoot } from '../PickerViewRoot';
import { DateOrTimeView, DateView, TimeView } from '../../models';
import { BaseToolbarProps, ExportedBaseToolbarProps } from '../../models/props/toolbar';
import { BaseTabsProps, ExportedBaseTabsProps } from '../../models/props/tabs';
import {
  CalendarOrClockPickerClasses,
  getCalendarOrClockPickerUtilityClass,
} from './calendarOrClockPickerClasses';

export interface CalendarOrClockPickerSlotsComponent<TDate, TView extends DateOrTimeView>
  extends DateCalendarSlotsComponent<TDate> {
  Tabs?: React.JSXElementConstructor<BaseTabsProps<TView>>;
  Toolbar?: React.JSXElementConstructor<BaseToolbarProps<TDate | null, TView>>;
}

export interface CalendarOrClockPickerSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  tabs?: ExportedBaseTabsProps;
  toolbar?: ExportedBaseToolbarProps;
}

export interface ExportedCalendarOrClockPickerProps<TDate, TView extends DateOrTimeView>
  extends Omit<BasePickerProps<TDate | null, TDate>, 'value' | 'onChange' | 'localeText'>,
    Omit<ExportedDateCalendarProps<TDate>, 'onViewChange' | 'openTo' | 'view' | 'views'>,
    ExportedTimeClockProps<TDate> {
  /**
   * Callback fired on view change.
   * @template View
   * @param {View} view The new view.
   */
  onViewChange?: (view: TView) => void;
  /**
   * First view to show.
   */
  openTo: TView;
  /**
   * Array of views to show.
   */
  views: readonly TView[];
  /**
   * Overrideable components.
   * @default {}
   */
  components?: CalendarOrClockPickerSlotsComponent<TDate, TView>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: CalendarOrClockPickerSlotsComponentsProps<TDate>;
}

export interface CalendarOrClockPickerProps<TDate, View extends DateOrTimeView>
  extends ExportedCalendarOrClockPickerProps<TDate, View>,
    PickerStatePickerProps<TDate | null> {
  autoFocus?: boolean;
  DateInputProps: DateInputPropsLike;
  /**
   * Display ampm controls under the clock (instead of in the toolbar).
   * @default false if toolbar is displayed
   */
  ampmInClock?: boolean;
  classes?: Partial<CalendarOrClockPickerClasses>;
}

const useUtilityClasses = (ownerState: CalendarOrClockPickerProps<any, any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    mobileKeyboardInputView: ['mobileKeyboardInputView'],
  };

  return composeClasses(slots, getCalendarOrClockPickerUtilityClass, classes);
};

export const MobileKeyboardInputView = styled('div', {
  name: 'MuiCalendarOrClockPicker',
  slot: 'MobileKeyboardInputView',
  overridesResolver: (_, styles) => styles.mobileKeyboardInputView,
})({
  padding: '16px 24px',
});

const PickerRoot = styled('div', {
  name: 'MuiCalendarOrClockPicker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: { isLandscape: boolean } }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  ...(ownerState.isLandscape && {
    flexDirection: 'row',
  }),
}));

const MobileKeyboardTextFieldProps = { fullWidth: true };

const isDatePickerView = (view: DateOrTimeView): view is DateView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: DateOrTimeView): view is TimeView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

// TODO v6: Drop with the legacy pickers
export function CalendarOrClockPicker<TDate, View extends DateOrTimeView>(
  inProps: CalendarOrClockPickerProps<TDate, View>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiCalendarOrClockPicker' });
  const {
    ampmInClock,
    autoFocus,
    className,
    value,
    DateInputProps,
    isMobileKeyboardViewOpen,
    onDateChange,
    onViewChange,
    openTo,
    orientation,
    showToolbar,
    toggleMobileKeyboardView,
    views,
    components,
    componentsProps,
    // excluding classes from `other` to avoid passing them down to children
    classes: providedClasses,
    ...other
  } = props;
  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const classes = useUtilityClasses(props);

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

  const { view, setView, focusedView, setFocusedView, setValueAndGoToNextView } = useViews({
    view: undefined,
    views,
    openTo,
    onChange: handleDateChange,
    onViewChange: handleViewChange,
    autoFocus,
  });

  const Tabs = components?.Tabs;

  const isDesktop = wrapperVariant === 'desktop';
  const shouldRenderToolbar = showToolbar ?? !isDesktop;
  const Toolbar = components?.Toolbar;

  return (
    <PickerRoot ownerState={{ isLandscape }} className={classes.root}>
      {shouldRenderToolbar && !!Toolbar && (
        <Toolbar
          {...componentsProps?.toolbar}
          isLandscape={isLandscape}
          onChange={handleDateChange}
          value={value}
          view={view}
          onViewChange={setView as (view: DateOrTimeView) => void}
          views={views}
          disabled={other.disabled}
          readOnly={other.readOnly}
          isMobileKeyboardViewOpen={isMobileKeyboardViewOpen}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
          ampmInClock={ampmInClock}
        />
      )}
      {!!Tabs && !isDesktop && (
        <Tabs
          view={view}
          onViewChange={setView as (view: DateOrTimeView) => void}
          {...componentsProps?.tabs}
        />
      )}
      <PickerViewRoot>
        {isMobileKeyboardViewOpen ? (
          <MobileKeyboardInputView className={classes.mobileKeyboardInputView}>
            <KeyboardDateInput
              {...DateInputProps}
              ignoreInvalidInputs
              disableOpenPicker
              TextFieldProps={MobileKeyboardTextFieldProps}
            />
          </MobileKeyboardInputView>
        ) : (
          <React.Fragment>
            {isDatePickerView(view) && (
              <DateCalendar
                autoFocus={autoFocus}
                value={value}
                onViewChange={setView as (view: DateView) => void}
                onChange={setValueAndGoToNextView}
                view={view}
                // Unclear why the predicate `isDatePickerView` does not imply the casted type
                views={views.filter(isDatePickerView) as DateView[]}
                focusedView={focusedView as DateView | null}
                onFocusedViewChange={setFocusedView as (view: DateView, hasFocus: boolean) => void}
                components={components}
                componentsProps={componentsProps}
                {...other}
              />
            )}

            {isTimePickerView(view) && (
              <TimeClock
                {...other}
                autoFocus={autoFocus}
                value={value}
                view={view}
                // Unclear why the predicate `isDatePickerView` does not imply the casted type
                views={views.filter(isTimePickerView) as TimeView[]}
                onChange={setValueAndGoToNextView}
                onViewChange={setView as (view: TimeView) => void}
                showViewSwitcher={isDesktop}
                ampmInClock={!shouldRenderToolbar || ampmInClock}
                components={components}
                componentsProps={componentsProps}
              />
            )}
          </React.Fragment>
        )}
      </PickerViewRoot>
      {!!Tabs && isDesktop && (
        <Tabs
          view={view}
          onViewChange={setView as (view: DateOrTimeView) => void}
          {...componentsProps?.tabs}
        />
      )}
    </PickerRoot>
  );
}
