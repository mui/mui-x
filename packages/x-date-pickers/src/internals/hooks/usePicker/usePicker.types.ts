import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import {
  InferError,
  OnErrorProps,
  PickerChangeHandlerContext,
  PickerOwnerState,
  PickerValidDate,
  PickerValueType,
  TimezoneProps,
} from '../../../models';
import {
  DateOrTimeViewWithMeridiem,
  FormProps,
  PickerOrientation,
  PickerValidValue,
  PickerValueManager,
  PickerVariant,
} from '../../models';
import { Validator } from '../../../validation';
import { UseViewsOptions } from '../useViews';
import { PickerProviderProps } from '../../components/PickerProvider';
import { PickersInputLocaleText } from '../../../locales';
import { PickerFieldPrivateContextValue } from '../useNullableFieldPrivateContext';

/**
 * Props common to all picker headless implementations.
 * Those props are exposed on all the pickers.
 */
export interface UsePickerBaseProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<TValue, TView, TError, any>,
> extends OnErrorProps<TValue, TError>,
    Omit<UseViewsOptions<any, TView>, 'onChange' | 'onFocusedViewChange' | 'focusedView'>,
    TimezoneProps,
    FormProps {
  /**
   * The selected value.
   * Used when the component is controlled.
   */
  value?: TValue;
  /**
   * The default value.
   * Used when the component is not controlled.
   */
  defaultValue?: TValue;
  /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The new value.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onChange?: (value: TValue, context: PickerChangeHandlerContext<TError>) => void;
  /**
   * Callback fired when the value is accepted.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TError The validation error type. It will be either `string` or a `null`. It can be in `[start, end]` format in case of range value.
   * @param {TValue} value The value that was just accepted.
   * @param {FieldChangeHandlerContext<TError>} context The context containing the validation result of the current value.
   */
  onAccept?: (value: TValue, context: PickerChangeHandlerContext<TError>) => void;
  /**
   * If `null`, the section will only have field editing.
   * If `undefined`, internally defined view will be used.
   */
  viewRenderers: PickerViewRendererLookup<TValue, TView, TExternalProps>;
  /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date-time using the validation props, except callbacks like `shouldDisable<...>`.
   */
  referenceDate?: PickerValidDate;
  /**
   * Force rendering in particular orientation.
   */
  orientation?: PickerOrientation;
  /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */
  reduceAnimations?: boolean;
}

/**
 * Props used to handle the value of non-static pickers.
 */
export interface UsePickerNonStaticProps extends Omit<PickerFieldPrivateContextValue, 'fieldRef'> {
  /**
   * If `true`, the Picker will close after submitting the full date.
   * @default false
   */
  closeOnSelect?: boolean;
  /**
   * Control the popup or dialog open state.
   * @default false
   */
  open?: boolean;
  /**
   * Callback fired when the popup requests to be closed.
   * Use in controlled mode (see `open`).
   */
  onClose?: () => void;
  /**
   * Callback fired when the popup requests to be opened.
   * Use in controlled mode (see `open`).
   */
  onOpen?: () => void;
  // We don't take the `format` prop from `UseFieldInternalProps` to have a custom JSDoc description.
  /**
   * Format of the date when rendered in the input(s).
   * Defaults to localized format based on the used `views`.
   */
  format?: string;
  /**
   * If `true`, the open picker button will not be rendered (renders only the field).
   * @default false
   */
  disableOpenPicker?: boolean;
  /**
   * The label content.
   */
  label?: React.ReactNode;
  /**
   * Pass a ref to the `input` element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Name attribute used by the `input` element in the Field.
   */
  name?: string;
}

export interface UsePickerProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TError,
  TExternalProps extends UsePickerProps<TValue, TView, TError, any>,
> extends UsePickerBaseProps<TValue, TView, TError, TExternalProps>,
    UsePickerNonStaticProps {
  // We don't add JSDoc here because we want the `referenceDate` JSDoc to be the one from the view which has more context.
  referenceDate?: PickerValidDate;
  className?: string;
  sx?: SxProps<Theme>;
}

export interface UsePickerParameters<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, any>,
> {
  ref: React.ForwardedRef<HTMLDivElement> | undefined;
  localeText: PickersInputLocaleText | undefined;
  variant: PickerVariant;
  valueManager: PickerValueManager<TValue, InferError<TExternalProps>>;
  valueType: PickerValueType;
  validator: Validator<TValue, InferError<TExternalProps>, TExternalProps>;
  autoFocusView: boolean;
  viewContainerRole: 'dialog' | 'tooltip' | null;
  /**
   * A function that intercepts the regular picker rendering.
   * Can be used to consume the provided `viewRenderers` and render a custom component wrapping them.
   * @param {PickerViewRendererLookup<TValue, TView, TExternalProps>} viewRenderers The `viewRenderers` that were provided to the picker component.
   * @param {TView} popperView The current picker view.
   * @param {any} rendererProps All the props that are being passed down to the renderer.
   * @returns {React.ReactNode} A React node that will be rendered instead of the default renderer.
   */
  rendererInterceptor?: React.JSXElementConstructor<
    PickerRendererInterceptorProps<TValue, TView, TExternalProps>
  >;
  props: TExternalProps;
}

export interface UsePickerReturnValue<TValue extends PickerValidValue> {
  ownerState: PickerOwnerState;
  renderCurrentView: () => React.ReactNode;
  providerProps: Omit<PickerProviderProps<TValue>, 'children'>;
}

export type PickerSelectionState = 'partial' | 'shallow' | 'finish';

export interface UsePickerState<TValue extends PickerValidValue> {
  /**
   * Whether the picker is open.
   */
  open: boolean;
  /**
   * Date displayed on the views and the field.
   * It is updated whenever the user modifies something.
   */
  draft: TValue;
  /**
   * Last value published (the last value for which `shouldPublishValue` returned `true`).
   * If `onChange` is defined, it's the value that was passed on the last call to this callback.
   */
  lastPublishedValue: TValue;
  /**
   * Last value committed (the last value for which `shouldCommitValue` returned `true`).
   * If `onAccept` is defined, it's the value that was passed on the last call to this callback.
   */
  lastCommittedValue: TValue;
  /**
   * Last value passed to `props.value`.
   * Used to update the `draft` value whenever the `value` prop changes.
   */
  lastControlledValue: TValue | undefined;
  /**
   * If we never modified the value since the mount of the component,
   * Then we might want to apply some custom logic.
   *
   * For example, when the component is not controlled and `defaultValue` is defined.
   * Then clicking on "Accept", "Today" or "Clear" should fire `onAccept` with `defaultValue`, but clicking on "Cancel" or dismissing the picker should not.
   */
  hasBeenModifiedSinceMount: boolean;
}

export interface PickerViewsRendererBaseExternalProps
  extends Omit<UsePickerProps<any, any, any, any>, 'openTo' | 'viewRenderers' | 'onChange'> {}

export type PickerViewsRendererProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = Omit<TExternalProps, 'className' | 'sx'> & {
  value: TValue;
  onChange: (value: TValue, selectionState?: PickerSelectionState) => void;
  view: TView;
  views: readonly TView[];
  focusedView: TView | null;
  onFocusedViewChange: (viewToFocus: TView, hasFocus: boolean) => void;
  showViewSwitcher: boolean;
  timeViewsCount: number;
};

export type PickerViewRenderer<
  TValue extends PickerValidValue,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = (props: PickerViewsRendererProps<TValue, any, TExternalProps>) => React.ReactNode;

export type PickerViewRendererLookup<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends PickerViewsRendererBaseExternalProps,
> = Record<TView, PickerViewRenderer<TValue, TExternalProps> | null>;

export interface PickerRendererInterceptorProps<
  TValue extends PickerValidValue,
  TView extends DateOrTimeViewWithMeridiem,
  TExternalProps extends UsePickerProps<TValue, TView, any, TExternalProps>,
> {
  viewRenderers: PickerViewRendererLookup<TValue, TView, TExternalProps>;
  popperView: TView;
  rendererProps: PickerViewsRendererProps<TValue, TView, TExternalProps>;
}
