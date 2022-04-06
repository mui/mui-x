import * as React from 'react';
import PropTypes from 'prop-types';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { getDataGridUtilityClass } from '../../constants/gridClasses';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
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

function GridColumnHeaderFilterIconButton(props: ColumnHeaderFilterIconButtonProps) {
  const { counter, field, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const toggleFilter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const { open, openedPanelValue } = gridPreferencePanelStateSelector(apiRef.current.state);

      if (open && openedPanelValue === GridPreferencePanelsValue.filters) {
        apiRef.current.hideFilterPanel();
      } else {
        apiRef.current.showFilterPanel();
      }

      if (onClick) {
        onClick(apiRef.current.getColumnHeaderParams(field), event);
      }
    },
    [apiRef, field, onClick],
  );

  if (!counter) {
    return null;
  }

  const iconButton = (
    <IconButton
      onClick={toggleFilter}
      color="default"
      aria-label={apiRef.current.getLocaleText('columnHeaderFiltersLabel')}
      size="small"
      tabIndex={-1}
    >
      <rootProps.components.ColumnFilteredIcon className={classes.icon} fontSize="small" />
    </IconButton>
  );

  return (
    <rootProps.components.BaseTooltip
      title={
        apiRef.current.getLocaleText('columnHeaderFiltersTooltipActive')(
          counter,
        ) as React.ReactElement
      }
      enterDelay={1000}
      {...rootProps.componentsProps?.baseTooltip}
    >
      <GridIconButtonContainer>
        {counter > 1 && (
          <Badge badgeContent={counter} color="default">
            {iconButton}
          </Badge>
        )}

        {counter === 1 && iconButton}
      </GridIconButtonContainer>
    </rootProps.components.BaseTooltip>
  );
}

GridColumnHeaderFilterIconButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  counter: PropTypes.number,
  field: PropTypes.string.isRequired,
  onClick: PropTypes.func,
} as any;

export { GridColumnHeaderFilterIconButton };
