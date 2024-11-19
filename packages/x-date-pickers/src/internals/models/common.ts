import { DateView, TimeView } from '../../models/views';

export type PickerOrientation = 'portrait' | 'landscape';

export type PickerVariant = 'mobile' | 'desktop' | null;

export type TimeViewWithMeridiem = TimeView | 'meridiem';

export type DateOrTimeViewWithMeridiem = DateView | TimeViewWithMeridiem;
