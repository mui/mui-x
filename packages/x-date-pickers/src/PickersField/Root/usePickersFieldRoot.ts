import * as React from 'react';
import { useField } from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import type { PickersFieldRoot } from './PickersFieldRoot';
import { InferFieldInternalProps, InferFieldSection, InferValueFromDate } from '../../models';
import { useLocalizationContext } from '../../internals/hooks/useUtils';

type InferDateFromController<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
> =
  TController extends PickersFieldRoot.Controller<infer TDate, any, any, any, any> ? TDate : never;

type InferIsRangeFromController<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
> =
  TController extends PickersFieldRoot.Controller<any, infer TIsRange, any, any, any>
    ? TIsRange
    : never;

type InferValueFromController<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
> = InferValueFromDate<
  InferDateFromController<TController>,
  InferIsRangeFromController<TController>
>;

type InferFieldSectionFromController<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
> = InferFieldSection<InferIsRangeFromController<TController>>;

type InferDefaultizedInternalPropsFromController<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
> =
  TController extends PickersFieldRoot.Controller<
    any,
    any,
    any,
    any,
    infer TDefaultizedInternalProps
  >
    ? TDefaultizedInternalProps
    : never;

export function usePickersFieldRoot<
  TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
>(params: UsePickersFieldRoot.Parameters<TController>): UsePickersFieldRoot.ReturnValue {
  const { controller, internalProps } = params;

  const adapter = useLocalizationContext<InferDateFromController<TController>>();
  const internalPropsWithDefault = controller.getDefaultInternalProps(adapter, internalProps);

  const fieldResponse = useField<
    InferValueFromController<TController>,
    InferDateFromController<TController>,
    InferFieldSectionFromController<TController>,
    true,
    // TODO: Add forwaredProps
    {},
    InferDefaultizedInternalPropsFromController<TController>
  >({
    forwardedProps: {},
    internalProps: { ...internalPropsWithDefault, enableAccessibleFieldDOMStructure: true },
    valueManager: controller.valueManager,
    fieldValueManager: controller.fieldValueManager,
    validator: controller.validator,
    valueType: controller.valueType,
  });

  const getRootProps: UsePickersFieldRoot.ReturnValue['getRootProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        children: externalProps.children,
      };
    },
    [],
  );

  // TODO: Memoize?
  const contextValue: PickersFieldProvider.ContextValue = { fieldResponse };

  // TODO: Memoize?
  return { getRootProps, contextValue };
}

export namespace UsePickersFieldRoot {
  export interface Parameters<
    TController extends PickersFieldRoot.Controller<any, any, any, any, any>,
  > {
    controller: TController;
    internalProps: InferFieldInternalProps<TController>;
  }

  export interface ReturnValue {
    /**
     * Resolver for the root element's props.
     * @param externalProps custom props for the root element
     * @returns props that should be spread on the root element
     */
    getRootProps: (
      externalProps?: React.ComponentPropsWithRef<'div'>,
    ) => React.ComponentPropsWithRef<'div'>;
    contextValue: PickersFieldProvider.ContextValue;
  }
}
