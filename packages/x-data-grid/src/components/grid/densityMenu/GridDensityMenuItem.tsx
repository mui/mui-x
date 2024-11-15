import * as React from 'react';
import { ListItemProps } from '@mui/material/ListItem';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';
import { useGridDensityMenuRootContext } from './GridDensityMenuRootContext';

export interface GridDensityMenuItemState {}

export interface GridDensityMenuItemProps extends ListItemProps {
  value?: 'compact' | 'standard' | 'comfortable';
  render?: RenderProp<GridDensityMenuItemState>;
}

const GridDensityMenuItem = React.forwardRef<HTMLLIElement, GridDensityMenuItemProps>(
  function GridDensityMenuItem(props, ref) {
    const { render, value, ...other } = props;
    const rootProps = useGridRootProps();
    const apiRef = useGridApiContext();
    const { onOpenChange, value: density } = useGridDensityMenuRootContext();

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
      switch (value) {
        case 'compact':
          apiRef.current.setDensity('compact');
          break;
        case 'standard':
          apiRef.current.setDensity('standard');
          break;
        case 'comfortable':
          apiRef.current.setDensity('comfortable');
          break;
        default:
          break;
      }

      props.onClick?.(event);
      onOpenChange(false);
    };

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseMenuItem,
      props: {
        ref,
        onClick: handleClick,
        selected: density === value,
        ...rootProps.slotProps?.baseMenuItem,
        ...other,
      },
    });

    return renderElement();
  },
);

export { GridDensityMenuItem };
