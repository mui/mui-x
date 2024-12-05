/* eslint-disable react/no-unused-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../../../hooks';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridColumnsPanelTriggerState {
  open: boolean;
}

export interface GridColumnsPanelTriggerProps extends Omit<ButtonProps, 'className'> {
  render?: RenderProp<GridColumnsPanelTriggerState>;
  className?: string | ((state: GridColumnsPanelTriggerState) => string);
}

const GridColumnsPanelTrigger = React.forwardRef<HTMLButtonElement, GridColumnsPanelTriggerProps>(
  function GridColumnsPanelTrigger(props, ref) {
    const { render, className, onClick, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.columns;
    const state = { open };
    const resolvedClassName = typeof className === 'function' ? className(state) : className;

    const toggleColumnsPanel = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, panelId, buttonId);
      }

      onClick?.(event);
    };

    const { renderElement } = useGridComponentRenderer({
      render,
      defaultElement: rootProps.slots.baseButton,
      props: {
        ref,
        id: buttonId,
        'aria-haspopup': 'true',
        'aria-expanded': open ? 'true' : undefined,
        'aria-controls': open ? panelId : undefined,
        onClick: toggleColumnsPanel,
        className: resolvedClassName,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
      state,
    });

    return renderElement();
  },
);

GridColumnsPanelTrigger.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { GridColumnsPanelTrigger };
