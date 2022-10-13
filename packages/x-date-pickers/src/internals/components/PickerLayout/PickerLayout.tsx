import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useViews, PickerOnChangeFn } from '../../hooks/useViews';
import { ClockPicker, ExportedClockPickerProps } from '../../../ClockPicker/ClockPicker';
import { DateCalendar } from '../../../DateCalendar';
import { DateCalendarSlotsComponent, DateCalendarSlotsComponentsProps, ExportedDateCalendarProps } from '../../../DateCalendar/DateCalendar';
import { useIsLandscape } from '../../hooks/useIsLandscape';
import { WrapperVariantContext } from '../wrappers/WrapperVariantContext';
import { DateInputPropsLike } from '../wrappers/WrapperProps';
import { PickerStatePickerProps } from '../../hooks/usePickerState';
import { BasePickerProps } from '../../models/props/basePickerProps';
import { PickerViewRoot } from '../PickerViewRoot';
import { CalendarOrClockPickerView, CalendarPickerView, ClockPickerView } from '../../models';
import { PickersActionBar } from '../../../PickersActionBar';
import { BaseToolbarProps } from '../../models/props/baseToolbarProps';
import { useFocusManagement } from './useFocusManagement';
import { PickerLayoutClasses, getPickerLayoutUtilityClass } from './pickerLayoutClasses';
import { DateTimePickerTabsProps } from '../../../DateTimePicker';

const ShortCutsPlaceholder = () => <div className="shorcut-place-holder">ShortCuts</div>;

export interface PickerLayoutSlotsComponent<TDate>
  extends DateCalendarSlotsComponent<TDate> {
  /**
   * Tabs enabling toggling between date and time pickers.
   * @default DateTimePickerTabs
   */
  Tabs: React.ElementType<DateTimePickerTabsProps>;
}

export interface PickerLayoutSlotsComponentsProps<TDate>
  extends DateCalendarSlotsComponentsProps<TDate> {
  tabs: Omit<DateTimePickerTabsProps, 'onChange' | 'view'>;
  layout: any;
}

export interface ExportedPickerLayoutProps<TDate, View extends CalendarOrClockPickerView>
  extends Omit<BasePickerProps<TDate | null>, 'value' | 'onChange'>,
  Omit<ExportedDateCalendarProps<TDate>, 'onViewChange' | 'openTo' | 'view'>,
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

  toolbarFormat?: string;
  toolbarPlaceholder?: React.ReactNode;
  toolbarTitle?: React.ReactNode;
  hideTabs?: boolean;
  components: Partial<PickerLayoutSlotsComponent<TDate>>;
  componentsProps: Partial<PickerLayoutSlotsComponentsProps<TDate>>;
}

export interface PickerLayoutProps<TDate, View extends CalendarOrClockPickerView>
  extends ExportedPickerLayoutProps<TDate, View>,
  PickerStatePickerProps<TDate | null> {
  autoFocus?: boolean;
  DateInputProps: DateInputPropsLike;
  ToolbarComponent?: React.JSXElementConstructor<BaseToolbarProps<TDate, TDate | null>>;
  classes?: Partial<PickerLayoutClasses>;
}

const useUtilityClasses = (ownerState: PickerLayoutProps<any, any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getPickerLayoutUtilityClass, classes);
};

const PickerLayoutRoot = styled('div', {
  name: 'MuiCalendarOrClockPicker',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: { isLandscape: boolean } }>(() => ({
  display: 'grid',
  gridAutoColumns: 'max-content auto max-content',
  gridAutoRows: 'max-content auto max-content',
}));

const isDatePickerView = (view: CalendarOrClockPickerView): view is CalendarPickerView =>
  view === 'year' || view === 'month' || view === 'day';

const isTimePickerView = (view: CalendarOrClockPickerView): view is ClockPickerView =>
  view === 'hours' || view === 'minutes' || view === 'seconds';

let warnedOnceNotValidOpenTo = false;

export function PickerLayout<TDate, View extends CalendarOrClockPickerView>(inProps: any) {
  const props = useThemeProps({ props: inProps, name: 'MuiPickerLayout' });
  const {
    autoFocus,
    className,
    value,
    DateInputProps,
    isMobileKeyboardViewOpen,
    onDateChange,
    onViewChange,
    onCancel,
    onClear,
    onAcceptCommittedValue,
    onSetToday,
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
    // excluding classes from `other` to avoid passing them down to children
    classes: providedClasses,
    ...other
  } = props;
  const TabsComponent = other.components?.Tabs;
  const ActionBar = other.components?.ActionBar ?? PickersActionBar;

  const isLandscape = useIsLandscape(views, orientation);
  const wrapperVariant = React.useContext(WrapperVariantContext);
  const classes = useUtilityClasses(props);

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

  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TDate, View>({
    view: undefined,
    views,
    openTo,
    onChange: handleDateChange,
    onViewChange: handleViewChange,
  });

  const { focusedView, setFocusedView } = useFocusManagement({ autoFocus, openView });

  const { showTabsBefore, ...layoutProps } = other.componentsProps.layout

  return (
    <PickerLayoutRoot ownerState={{ isLandscape }} className={classes.root} {...layoutProps}>
      {toShowToolbar && (
        <ToolbarComponent
          {...other}
          views={views}
          isLandscape={isLandscape}
          value={value}
          onChange={handleDateChange}
          setOpenView={setOpenView as (view: CalendarOrClockPickerView) => void}
          openView={openView}
          toolbarTitle={toolbarTitle}
          toolbarFormat={toolbarFormat}
          toolbarPlaceholder={toolbarPlaceholder}
          toggleMobileKeyboardView={toggleMobileKeyboardView}
        />
      )}

      <ShortCutsPlaceholder />
      <PickerViewRoot className="MUI-PickerViewRoot">
        {showTabs && !!TabsComponent && showTabsBefore && (
          <TabsComponent
            dateRangeIcon={dateRangeIcon}
            timeIcon={timeIcon}
            view={openView}
            onChange={setOpenView as (view: CalendarOrClockPickerView) => void}
            {...other.componentsProps?.tabs}
          />
        )}
        {isDatePickerView(openView) && (
          <DateCalendar
            autoFocus={autoFocus}
            value={value}
            onViewChange={setOpenView as (view: CalendarPickerView) => void}
            onChange={handleChangeAndOpenNext}
            view={openView}
            // Unclear why the predicate `isDatePickerView` does not imply the casted type
            views={views.filter(isDatePickerView) as CalendarPickerView[]}
            focusedView={focusedView}
            onFocusedViewChange={setFocusedView}
            {...other}
          />
        )}

        {isTimePickerView(openView) && (
          <ClockPicker
            {...other}
            autoFocus={autoFocus}
            value={value}
            view={openView}
            // Unclear why the predicate `isDatePickerView` does not imply the casted type
            views={views.filter(isTimePickerView) as ClockPickerView[]}
            onChange={handleChangeAndOpenNext}
            onViewChange={setOpenView as (view: ClockPickerView) => void}
            showViewSwitcher={wrapperVariant === 'desktop'}
          />
        )}
        {showTabs && !!TabsComponent && !showTabsBefore && (
          <TabsComponent
            dateRangeIcon={dateRangeIcon}
            timeIcon={timeIcon}
            view={openView}
            onChange={setOpenView as (view: CalendarOrClockPickerView) => void}
            {...other.componentsProps?.tabs}
          />
        )}
      </PickerViewRoot>
      <ActionBar
        onCancel={onCancel}
        onClear={onClear}
        onAccept={onAcceptCommittedValue}
        onSetToday={onSetToday}
        actions={[]}
        {...other.componentsProps?.actionBar}
      />
    </PickerLayoutRoot>
  );
}
