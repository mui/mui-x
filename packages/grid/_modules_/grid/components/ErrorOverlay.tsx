import * as React from 'react';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

export interface ErrorOverlayProps extends GridOverlayProps {
  message?: string;
  hasError: boolean;
  errorInfo: any;
}

export const ErrorOverlay = React.forwardRef<HTMLDivElement, ErrorOverlayProps>(
  function ErrorOverlay(props: ErrorOverlayProps, ref) {
    const { message, hasError, errorInfo, ...other } = props;
    const apiRef = useGridApiContext();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');

    return (
      <GridOverlay ref={ref} {...other}>
        {message || defaultLabel}
      </GridOverlay>
    );
  },
);
