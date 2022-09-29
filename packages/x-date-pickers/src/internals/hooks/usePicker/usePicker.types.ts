import * as React from 'react';
import { WrapperVariant } from '../../components/wrappers/WrapperVariantContext';
import { CalendarOrClockPickerView } from '../../models/views';
import { PickerStateValueManager } from '../usePickerState';
import { UsePickerValueProps, UsePickerValueResponse } from './usePickerValue';
import {
  ExportedUsePickerViewProps,
  PickerDateSectionModeLookup,
  PickerViewsRendererProps,
  UsePickerViewsResponse,
} from './usePickerViews';

export interface UsePickerProps<TValue, TView extends CalendarOrClockPickerView>
  extends UsePickerValueProps<TValue>,
    ExportedUsePickerViewProps<TView> {}

export interface UsePickerParams<TValue, TDate, TView extends CalendarOrClockPickerView> {
  props: UsePickerProps<TValue, TView>;
  valueManager: PickerStateValueManager<TValue, TDate>;
  wrapperVariant: WrapperVariant;
  renderViews: (props: PickerViewsRendererProps<TValue, TView>) => React.ReactElement;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
}

export interface UsePickerResponse<TValue>
  extends Omit<UsePickerValueResponse<TValue>, 'views'>,
    UsePickerViewsResponse {}
