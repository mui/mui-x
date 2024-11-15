import * as React from 'react';
import useId from '@mui/utils/useId';
import { ButtonProps } from '@mui/material/Button';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import {
  gridFilterActiveItemsSelector,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  useGridSelector,
} from '../../../hooks';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import {
  useGridComponentRenderer,
  RenderProp,
} from '../../../hooks/utils/useGridComponentRenderer';

export interface GridFilterPanelTriggerState {
  open: boolean;
  filterCount: number;
}

export interface GridFilterPanelTriggerProps extends ButtonProps {
  render?: RenderProp<GridFilterPanelTriggerState>;
}

const GridFilterPanelTrigger = React.forwardRef<HTMLButtonElement, GridFilterPanelTriggerProps>(
  function GridFilterPanelTrigger(props, ref) {
    const { render, ...other } = props;
    const rootProps = useGridRootProps();
    const buttonId = useId();
    const panelId = useId();
    const apiRef = useGridApiContext();
    const panelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
    const open =
      panelState.open && panelState.openedPanelValue === GridPreferencePanelsValue.filters;
    const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
    const filterCount = activeFilters.length;

    const toggleFilterPanel = () => {
      if (open) {
        apiRef.current.hidePreferences();
      } else {
        apiRef.current.showPreferences(GridPreferencePanelsValue.filters, panelId, buttonId);
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
        onClick: toggleFilterPanel,
        ...rootProps.slotProps?.baseButton,
        ...other,
      },
      state: {
        open,
        filterCount,
      },
    });

    return renderElement();
  },
);

export { GridFilterPanelTrigger };
