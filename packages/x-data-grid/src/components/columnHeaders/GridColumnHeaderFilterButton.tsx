import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses, unstable_useId as useId } from '@mui/utils';
import { useGridSelector } from '../../hooks';
import {
  gridPreferencePanelSelectorWithLabel,
  gridPreferencePanelStateSelector,
} from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { GridColumnHeaderParams } from '../../models/params/gridColumnHeaderParams';

export interface ColumnHeaderFilterButtonProps {
  field: string;
  counter?: number;
  onClick?: (params: GridColumnHeaderParams, event: React.MouseEvent<HTMLButtonElement>) => void;
}

type OwnerState = ColumnHeaderFilterButtonProps & {
  classes?: DataGridProcessedProps['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    button: ['filterButton'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

function GridColumnHeaderFilterButtonWrapped(props: ColumnHeaderFilterButtonProps) {
  if (!props.counter) {
    return null;
  }
  return <GridColumnHeaderFilterButton {...props} />;
}

GridColumnHeaderFilterButtonWrapped.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func,
} as any;

function GridColumnHeaderFilterButton(props: ColumnHeaderFilterButtonProps) {
  const { counter, field, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);
  const labelId = useId();
  const isOpen = useGridSelector(apiRef, gridPreferencePanelSelectorWithLabel, labelId);
  const panelId = useId();

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef);

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
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      className={classes.button}
      {...rootProps.slotProps?.baseIconButton}
    >
      <rootProps.slots.columnFilteredIcon fontSize="small" />
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
      <React.Fragment>
        {counter > 1 && (
          <rootProps.slots.baseBadge badgeContent={counter} color="default">
            {iconButton}
          </rootProps.slots.baseBadge>
        )}

        {counter === 1 && iconButton}
      </React.Fragment>
    </rootProps.slots.baseTooltip>
  );
}

GridColumnHeaderFilterButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func,
} as any;

export { GridColumnHeaderFilterButtonWrapped as GridColumnHeaderFilterButton };
