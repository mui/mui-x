import {
  BasePickerProps,
  DateOrTimeViewWithMeridiem,
  PickerRangeValue,
  UsePickerNonStaticProps,
  UsePickerParameters,
  UsePickerProps,
} from '@mui/x-date-pickers/internals';
import * as React from 'react';
import { UseRangePositionProps } from '../hooks/useRangePosition';
import { PickerRangeStep } from '../utils/createRangePickerStepNavigation';

/**
 * Props common to all range non-static pickers.
 * These props are handled by the headless wrappers.
 */
export interface BaseRangeNonStaticPickerProps {
  /**
   * The label content.
   * Ignored if the field has several inputs.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   * Ignored if the field has several inputs.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Name attribute used by the `input` element in the Field.
   * Ignored if the field has several inputs.
   */
  name?: string;
}

export interface NonStaticRangePickerProps
  extends UsePickerNonStaticProps,
    BaseRangeNonStaticPickerProps,
    UseRangePositionProps {}

export interface UseRangePickerProps<
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<PickerRangeValue, TView, TError, any>,
> extends NonStaticRangePickerProps,
    BasePickerProps<PickerRangeValue, TView, TError, TExternalProps> {}

export interface NonStaticRangePickerHookParameters<
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UseRangePickerProps<TView, any, TExternalProps>,
> extends Pick<
    UsePickerParameters<PickerRangeValue, TView, TExternalProps>,
    'valueManager' | 'valueType' | 'validator' | 'rendererInterceptor' | 'ref'
  > {
  props: TExternalProps;
  /**
   * Steps available for the picker.
   * This will be used to define the behavior of navigation actions.
   * If null, the picker will not have any step navigation.
   */
  steps: PickerRangeStep[] | null;
}
