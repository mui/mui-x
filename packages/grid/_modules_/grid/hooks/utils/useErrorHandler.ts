import * as React from 'react';
import { COMPONENT_ERROR } from '../../constants';
import { ApiRef } from '../../models/api';

export function useErrorHandler(apiRef: ApiRef, props) {
  const [errorState, setErrorState] = React.useState<any>(null);

  const errorHandler = (args: any) => {
    // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
    setErrorState(args);
  };
  React.useEffect(() => apiRef!.current.subscribeEvent(COMPONENT_ERROR, errorHandler), [apiRef]);

  React.useEffect(() => {
    apiRef!.current.showError(props.error);
  }, [apiRef, props.error]);

  return errorState;
}
