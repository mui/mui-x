import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../hooks/utils/useGridComponentRenderer';

export interface GridPrintTriggerState {}

export interface GridPrintTriggerProps extends ButtonProps {
  // eslint-disable-next-line react/no-unused-prop-types
  render?: RenderProp<GridPrintTriggerState>;
}

const GridPrintTrigger = React.forwardRef<HTMLButtonElement, GridPrintTriggerProps>(
  function GridPrintTrigger(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref,
        onClick: () => apiRef.current.exportDataAsPrint(),
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
    });

    return renderElement();
  },
);

export { GridPrintTrigger };
