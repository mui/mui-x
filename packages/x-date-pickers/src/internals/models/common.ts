import { DateView, TimeView } from '../../models/views';

export type WrapperVariant = 'mobile' | 'desktop' | null;

export type ValueType = 'date' | 'time' | 'date-time' | null;

export type TimeViewWithMeridiem = TimeView | 'meridiem';

export type DateOrTimeViewWithMeridiem = DateView | TimeViewWithMeridiem;
