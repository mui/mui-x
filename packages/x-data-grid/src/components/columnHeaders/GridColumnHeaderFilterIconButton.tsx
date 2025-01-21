import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { useGridSelectorV8 } from '../../hooks/utils/useGridSelector';
import {
  gridPreferencePanelSelectorWithLabel,
  gridPreferencePanelStateSelector,
} from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridIconButtonContainer } from './GridIconButtonContainer';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';

export interface ColumnHeaderFilterIconButtonProps {
  field: string;
  counter?: number;
  onClick?: (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLButtonElement>) => void;
}

type OwnerState = ColumnHeaderFilterIconButtonProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    icon: ['filterIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderFilterIconButtonWrapped(props: ColumnHeaderFilterIconButtonProps) {
  if (!props.counter) {
    return null;
  }
  return <GridColumnHeaderFilterIconButton {...props} />;
}

GridColumnHeaderFilterIconButtonWrapped.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func,
} as any;

function GridColumnHeaderFilterIconButton(props: ColumnHeaderFilterIconButtonProps) {
  const { counter, field, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const labelId = useId();
  const isOpen = useGridSelectorV8(apiRef, gridPreferencePanelSelectorWithLabel, labelId);
  const panelId = useId();

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef.current.state);

      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        apiRef.current.showFilterPanel(undefined, panelId, labelId);
      }

      if (onClick) {
        onClick(apiRef.current.getColumnHeaderParams(field), event);
      }
    },
    [apiRef, field, onClick, panelId, labelId],
  );

  if (!counter) {
    return null;
  }

  const iconButton = (
    <rootProps.slots.baseIconButton
      id={labelId}
      onClick={toggleFilter}
      color="default"
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnFilteredIcon className={classes.icon} fontSize="small" />
    </rootProps.slots.baseIconButton>
  );

  return (
    <rootProps.slots.baseTooltip
      title={
        apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
          counter,
        ) as React.ReactElement<any>
      }
      enterDelay={1000}
      {...rootProps.slotProps?.baseTooltip}
    >
      <GridIconButtonContainer>
        {counter > 1 && (
          <rootProps.slots.baseBadge badgeContent={counter} color="default">
            {iconButton}
          </rootProps.slots.baseBadge>
        )}

        {counter === 1 && iconButton}
      </GridIconButtonContainer>
    </rootProps.slots.baseTooltip>
  );
}

GridColumnHeaderFilterIconButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func,
} as any;

export { GridColumnHeaderFilterIconButtonWrapped as GridColumnHeaderFilterIconButton };
