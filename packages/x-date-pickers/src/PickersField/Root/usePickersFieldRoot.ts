import * as React from 'react';
import { useField } from '../../internals/hooks/useField';
import type { PickersFieldProvider } from './PickersFieldProvider';
import type { PickersFieldRoot } from './PickersFieldRoot';
import { InferFieldInternalProps } from '../../models';

export function usePickersFieldRoot<
  TController extends PickersFieldRoot.Controller<any, any, any, any>,
>(params: UsePickersFieldRoot.Parameters<TController>): UsePickersFieldRoot.ReturnValue {
  const { controller, internalProps } = params;

  console.log(internalProps);

  const fieldResponse = useField({
    forwardedProps: {},
    internalProps,
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

  const contextValue = React.useMemo<PickersFieldProvider.ContextValue>(() => ({}), []);

  return React.useMemo(() => ({ getRootProps, contextValue }), [getRootProps, contextValue]);
}

export namespace UsePickersFieldRoot {
  export interface Parameters<TController extends PickersFieldRoot.Controller<any, any, any, any>> {
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
