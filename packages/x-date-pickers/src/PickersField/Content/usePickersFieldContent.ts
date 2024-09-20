import * as React from 'react';

export function usePickersFieldContent(
  params: UsePickersFieldContent.Parameters,
): UsePickersFieldContent.ReturnValue {
  const getContentProps: UsePickersFieldContent.ReturnValue['getContentProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        children: 'CONTENT',
      };
    },
    [],
  );

  return React.useMemo(() => ({ getContentProps }), [getContentProps]);
}

export namespace UsePickersFieldContent {
  export interface Parameters {}

  export interface ReturnValue {
    /**
     * Resolver for the Content element's props.
     * @param externalProps custom props for the Content element
     * @returns props that should be spread on the Content element
     */
    getContentProps: (
      externalProps?: React.ComponentPropsWithRef<'div'>,
    ) => React.ComponentPropsWithRef<'div'>;
  }
}
