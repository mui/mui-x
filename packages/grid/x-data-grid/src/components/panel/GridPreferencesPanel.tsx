import * as React from 'react';
import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { GridEvents } from '../../models';

export const GridPreferencesPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridPreferencesPanel(props, ref) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const panelContent = apiRef.current.unstable_applyPreProcessors(
    'preferencePanel',
    null,
    preferencePanelState.openedPanelValue ?? GridPreferencePanelsValue.filters,
  );

  const handleClose = React.useCallback(() => {
    apiRef.current.hidePreferences();
    apiRef.current.publishEvent(GridEvents.panelClose, {
      openedPanelValue: preferencePanelState.openedPanelValue,
    });
  }, [apiRef, preferencePanelState]);

  const handleOpen = React.useCallback(() => {
    apiRef.current.publishEvent(GridEvents.panelOpen, {
      openedPanelValue: preferencePanelState.openedPanelValue,
    });
  }, [apiRef, preferencePanelState]);

  React.useEffect(() => {
    if (preferencePanelState.open) {
      handleOpen();
    }
  }, [handleOpen, preferencePanelState.open]);

  return (
    <rootProps.components.Panel
      ref={ref}
      as={rootProps.components.BasePopper}
      open={columns.length > 0 && preferencePanelState.open}
      onPanelClose={handleClose}
      {...rootProps.componentsProps?.panel}
      {...props}
      {...rootProps.componentsProps?.basePopper}
    >
      {panelContent}
    </rootProps.components.Panel>
  );
});
