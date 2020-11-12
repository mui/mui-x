import * as React from 'react';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';
import { GridToolbar } from './styled-wrappers/GridToolbar';

// TODO: We can list separate features here, eg. column picker
export interface DefaultToolbarProps {}

export const DefaultToolbar = React.forwardRef<HTMLDivElement, DefaultToolbarProps>(
  function DefaultFooter(props, ref) {
    const { children } = props; // Extranct the child components from the props
    const apiRef = React.useContext(ApiContext);

    // TODO: This part won't be needed if the component is separate
    const options = useGridSelector(apiRef, optionsSelector);
    if (options.hideToolbar) {
      return null;
    }

    return <GridToolbar ref={ref}>{children}</GridToolbar>;
  },
);
