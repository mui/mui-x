import * as React from 'react';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import {
  GridDensityMenuRootContextValue,
  useGridDensityMenuRootContext,
} from './GridDensityMenuRootContext';

export interface GridDensityMenuTriggerState extends GridDensityMenuRootContextValue {}

export interface GridDensityMenuTriggerProps extends ButtonProps {
  render?: RenderProp<GridDensityMenuTriggerState>;
}

const GridDensityMenuTrigger = React.forwardRef<HTMLButtonElement, GridDensityMenuTriggerProps>(
  function GridDensityMenuTrigger(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();
    const contextValue = useGridDensityMenuRootContext();
    const handleRef = useForkRef(ref, contextValue.triggerRef);
    const menuId = useId();

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref: handleRef,
        onClick: () => contextValue.onOpenChange(!contextValue.open),
        'aria-haspopup': 'true',
        'aria-expanded': contextValue.open ? 'true' : undefined,
        'aria-controls': contextValue.open ? menuId : undefined,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
      state: contextValue,
    });

    return renderElement();
  },
);

export { GridDensityMenuTrigger };
