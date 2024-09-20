import * as React from 'react';

export function usePickersFieldRoot(
  params: UsePickersFieldRoot.Parameters,
): UsePickersFieldRoot.ReturnValue {
  const getRootProps: UsePickersFieldRoot.ReturnValue['getRootProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        children: externalProps.children,
      };
    },
    [],
  );

  return React.useMemo(() => ({ getRootProps }), [getRootProps]);
}

export namespace UsePickersFieldRoot {
  export interface Parameters {}

  export interface ReturnValue {
    /**
     * Resolver for the root element's props.
     * @param externalProps custom props for the root element
     * @returns props that should be spread on the root element
     */
    getRootProps: (
      externalProps?: React.ComponentPropsWithRef<'div'>,
    ) => React.ComponentPropsWithRef<'div'>;
  }
}
