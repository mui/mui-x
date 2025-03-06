import type { PickerManager } from '../../models';
import type { UseFieldInternalProps } from '../hooks/useField';

export type PickerAnyManager = PickerManager<any, any, any, any, any>;

type PickerManagerProperties<TManager extends PickerAnyManager> =
  TManager extends PickerManager<
    infer TValue,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TValidationProps,
    infer TFieldInternalProps
  >
    ? {
        value: TValue;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        validationProps: TValidationProps;
        fieldInternalProps: TFieldInternalProps;
      }
    : never;

export type PickerManagerValue<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['value'];

export type PickerManagerError<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['error'];

export type PickerManagerFieldInternalProps<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['fieldInternalProps'];

export type PickerManagerValidationProps<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['validationProps'];

export type PickerManagerFieldInternalPropsWithDefaults<TManager extends PickerAnyManager> =
  UseFieldInternalProps<
    PickerManagerValue<TManager>,
    PickerManagerEnableAccessibleFieldDOMStructure<TManager>,
    PickerManagerError<TManager>
  > &
    PickerManagerValidationProps<TManager>;

export type PickerManagerEnableAccessibleFieldDOMStructure<TManager extends PickerAnyManager> =
  PickerManagerProperties<TManager>['enableAccessibleFieldDOMStructure'];
