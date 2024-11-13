import { PickerValueManagerV8 } from '../../models';

export type PickerAnyValueManagerV8 = PickerValueManagerV8<any, any, any, any, any>;

export type PickerManagerFieldInternalProps<TManager extends PickerAnyValueManagerV8> =
  TManager extends PickerValueManagerV8<any, any, any, infer TFieldInternalProps, any>
    ? TFieldInternalProps
    : never;

export type PickerManagerFieldInternalPropsWithDefaults<TManager extends PickerAnyValueManagerV8> =
  TManager extends PickerValueManagerV8<any, any, any, any, infer TFieldInternalPropsWithDefaults>
    ? TFieldInternalPropsWithDefaults
    : never;
