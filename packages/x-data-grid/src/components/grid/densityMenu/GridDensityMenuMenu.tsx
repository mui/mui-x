import * as React from 'react';
import Menu, { MenuProps } from '@mui/material/Menu';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridDensityMenuRootContext } from './GridDensityMenuRootContext';

export interface GridDensityMenuMenuState {}

export interface GridDensityMenuMenuProps extends Omit<MenuProps, 'open'> {
  render?: RenderProp<GridDensityMenuMenuState>;
}

const GridDensityMenuMenu = React.forwardRef<HTMLDivElement, GridDensityMenuMenuProps>(
  function GridDensityMenuMenu(props, ref) {
    const { render, ...other } = props;
    const { open, onOpenChange, triggerRef } = useGridDensityMenuRootContext();

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: Menu,
      props: {
        ref,
        anchorEl: triggerRef.current,
        open,
        onClose: () => onOpenChange(false),
        ...other,
      },
    });

    return renderElement();
  },
);

export { GridDensityMenuMenu };
