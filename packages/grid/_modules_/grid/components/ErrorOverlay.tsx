import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export interface ErrorOverlayProps extends GridOverlayProps {
  message?: string;
}

export const ErrorOverlay = React.forwardRef<HTMLDivElement, ErrorOverlayProps>(
  function ErrorOverlay(props: ErrorOverlayProps, ref) {
    const { message, ...other } = props;
    const apiRef = React.useContext(GridApiContext);
    const defaultLabel = apiRef!.current.getLocaleText('errorOverlayDefaultLabel');

    return (
      <GridOverlay ref={ref} {...other}>
        {message || defaultLabel}
      </GridOverlay>
    );
  },
);
