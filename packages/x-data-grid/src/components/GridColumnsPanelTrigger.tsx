import * as React from 'react';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import {
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../hooks';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridComponentRenderer, RenderProp } from '../hooks/utils/useGridComponentRenderer';

export interface GridColumnsPanelTriggerState {
  open: boolean;
}

export interface GridColumnsPanelTriggerProps extends ButtonProps {
  // eslint-disable-next-line react/no-unused-prop-types
  render?: RenderProp<GridColumnsPanelTriggerState>;
}

const GridColumnsPanelTrigger = React.forwardRef<HTMLButtonElement, GridColumnsPanelTriggerProps>(
  function GridColumnsPanelTrigger(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.columns;

    const toggleColumnsPanel = () => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.columns, panelId, buttonId);
      }
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
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
      state: {
        open,
      },
    });

    return renderElement();
  },
);

export { GridColumnsPanelTrigger };
