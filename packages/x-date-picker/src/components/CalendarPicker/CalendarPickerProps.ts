import * as React from 'react'
import { CommonProps } from '@mui/material/OverridableComponent';
import { PickerOnChangeFn } from './useViews'
import {ExportedDayPickerProps} from "../pickerViews/DayPicker/DayPickerProps";

type CalendarPickerView = 'year' | 'day' | 'month';

export interface CalendarPickerProps<TDate> extends CommonProps, ExportedDayPickerProps<TDate> {
    className?: string;
    date: TDate | null;
    /**
     * Default calendar month displayed when `value={null}`.
     */
    defaultCalendarMonth?: TDate;
    /**
     * If `true`, the picker and text field are disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * @default false
     */
    disableFuture?: boolean;
    /**
     * @default false
     */
    disablePast?: boolean;
    /**
     * Max selectable date. @DateIOType
     */
    maxDate?: TDate;
    /**
     * Min selectable date. @DateIOType
     */
    minDate?: TDate;
    /**
     * Callback fired on view change.
     * @param {CalendarPickerView} view The new view displayed.
     */
    onViewChange?: (view: CalendarPickerView) => void;
    /**
     * Callback fired on date change
     */
    onChange: PickerOnChangeFn<TDate>;
    /**
     * Callback firing on month change. @DateIOType
     * @param {TDate} date The new visible month.
     */
    onMonthChange?: (date: TDate) => void;
    /**
     * Initially open view.
     * @default 'day'
     */
    openTo?: CalendarPickerView;
    /**
     * Make picker read only.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Disable heavy animations.
     * @default typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent)
     */
    reduceAnimations?: boolean;
    /**
     * Component displaying when passed `loading` true.
     * @default () => <span data-mui-test="loading-progress">...</span>
     * @returns {React.ReactNode} The element to render when the calendar is loading.
     */
    renderLoading?: () => React.ReactNode;
    /**
     * Disable specific date. @DateIOType
     * @param {TDate} day The day to check.
     * @returns {boolean} Return `true` is the day should be disabled.
     */
    shouldDisableDate?: (day: TDate) => boolean;
    /**
     * Controlled open view.
     */
    view?: CalendarPickerView;
    /**
     * Views for calendar picker.
     * @default ['year', 'day']
     */
    views?: readonly CalendarPickerView[];
}
