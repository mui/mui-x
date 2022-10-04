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

export interface UsePickerParams<
  TValue,
  TDate,
  TView extends CalendarOrClockPickerView,
  TViewProps extends {},
> {
  props: UsePickerProps<TValue, TView>;
  valueManager: PickerStateValueManager<TValue, TDate>;
  wrapperVariant: WrapperVariant;
  renderViews: (props: PickerViewsRendererProps<TValue, TView, TViewProps>) => React.ReactElement;
  sectionModeLookup?: PickerDateSectionModeLookup<TView>;
  inputRef?: React.RefObject<HTMLInputElement>;
  additionalViewProps: TViewProps;
}

export interface UsePickerResponse<TValue>
  extends Omit<UsePickerValueResponse<TValue>, 'views'>,
    UsePickerViewsResponse {}
