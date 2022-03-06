import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { GridOverlay, GridOverlayProps } from './containers/GridOverlay';

const ErrorGridOverlay = styled(GridOverlay, {
  shouldForwardProp: (prop) => prop !== 'rowHeight',
})((props: GridOverlayProps & { rowHeight: number }) => {
  return {
    minHeight: props.rowHeight,
    width: '100%',
  };
});
export interface ErrorOverlayProps extends GridOverlayProps {
  message?: string;
  hasError: boolean;
  errorInfo: any;
  rowHeight: number;
}

// TODO v6: rename to GridErrorOverlay
export const ErrorOverlay = React.forwardRef<HTMLDivElement, ErrorOverlayProps>(
  function ErrorOverlay(props: ErrorOverlayProps, ref) {
    const { message, hasError, errorInfo, ...other } = props;
    const apiRef = useGridApiContext();
    const defaultLabel = apiRef.current.getLocaleText('errorOverlayDefaultLabel');

    return (
      <ErrorGridOverlay ref={ref} {...other}>
        {message || defaultLabel}
      </ErrorGridOverlay>
    );
  },
);
