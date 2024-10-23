import { DateView, TimeView } from '../../models/views';

export type PickerOrientation = 'portrait' | 'landscape';

export type PickerVariant = 'mobile' | 'desktop';

export type ValueType = 'date' | 'time' | 'date-time' | null;

export type TimeViewWithMeridiem = TimeView | 'meridiem';

export type DateOrTimeViewWithMeridiem = DateView | TimeViewWithMeridiem;
