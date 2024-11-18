import type { PickerValueManagerV8 } from '../../models';

export type PickerAnyValueManagerV8 = PickerValueManagerV8<any, any, any, any, any>;

type PickerManagerProperties<TManager extends PickerAnyValueManagerV8> =
  TManager extends PickerValueManagerV8<
    infer TValue,
    infer TEnableAccessibleFieldDOMStructure,
    infer TError,
    infer TFieldInternalProps,
    infer TFieldInternalPropsWithDefaults
  >
    ? {
        value: TValue;
        enableAccessibleFieldDOMStructure: TEnableAccessibleFieldDOMStructure;
        error: TError;
        fieldInternalProps: TFieldInternalProps;
        fieldInternalPropsWithDefaults: TFieldInternalPropsWithDefaults;
      }
    : never;

export type PickerManagerFieldInternalProps<TManager extends PickerAnyValueManagerV8> =
  PickerManagerProperties<TManager>['fieldInternalProps'];

export type PickerManagerFieldInternalPropsWithDefaults<TManager extends PickerAnyValueManagerV8> =
  PickerManagerProperties<TManager>['fieldInternalPropsWithDefaults'];
