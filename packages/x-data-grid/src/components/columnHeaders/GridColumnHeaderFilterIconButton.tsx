import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useId from '@mui/utils/useId';
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
  const { slots, slotProps, classes: classesRootProps } = useGridRootProps();
  const ownerState = { ...props, classes: classesRootProps };
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
    <slots.baseIconButton
      id={labelId}
      onClick={toggleFilter}
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? panelId : undefined}
      {...slotProps?.baseIconButton}
    >
      <slots.columnFilteredIcon className={classes.icon} fontSize="small" />
    </slots.baseIconButton>
  );

  return (
    <slots.baseTooltip
      title={
        apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
          counter,
        ) as React.ReactElement<any>
      }
      enterDelay={1000}
      {...slotProps?.baseTooltip}
    >
      <GridIconButtonContainer>
        {counter > 1 && (
          <slots.baseBadge badgeContent={counter} color="default">
            {iconButton}
          </slots.baseBadge>
        )}

        {counter === 1 && iconButton}
      </GridIconButtonContainer>
    </slots.baseTooltip>
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
