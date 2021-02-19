import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { GridDensity, GridDensityTypes } from '../../models/gridDensity';
import { GridApiContext } from '../GridApiContext';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { GridDensityOption } from '../../models/api/gridDensityApi';
import { GridMenu } from '../menu/GridMenu';

export function GridDensitySelector() {
  const apiRef = React.useContext(GridApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const DensityCompactIcon = apiRef!.current.components!.DensityCompactIcon!;
  const DensityStandardIcon = apiRef!.current.components!.DensityStandardIcon!;
  const DensityComfortableIcon = apiRef!.current.components!.DensityComfortableIcon!;

  const DensityOptions: Array<GridDensityOption> = [
    {
      icon: <DensityCompactIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityCompact'),
      value: GridDensityTypes.Compact,
    },
    {
      icon: <DensityStandardIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityStandard'),
      value: GridDensityTypes.Standard,
    },
    {
      icon: <DensityComfortableIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityComfortable'),
      value: GridDensityTypes.Comfortable,
    },
  ];

  const getSelectedDensityIcon = React.useCallback((): React.ReactElement => {
    switch (densityValue) {
      case GridDensityTypes.Compact:
        return <DensityCompactIcon />;
      case GridDensityTypes.Comfortable:
        return <DensityComfortableIcon />;
      default:
        return <DensityStandardIcon />;
    }
  }, [densityValue, DensityCompactIcon, DensityComfortableIcon, DensityStandardIcon]);

  const handleDensitySelectorOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDensitySelectorClose = () => setAnchorEl(null);
  const handleDensityUpdate = (newDensity: GridDensity) => {
    apiRef!.current.setDensity(newDensity);
    setAnchorEl(null);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      handleDensitySelectorClose();
    }
  };

  // Disable the button if the corresponding is disabled
  if (options.disableDensitySelector) {
    return null;
  }

  const renderDensityOptions: Array<React.ReactElement> = DensityOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleDensityUpdate(option.value)}
      selected={option.value === densityValue}
    >
      <ListItemIcon>{option.icon}</ListItemIcon>
      {option.label}
    </MenuItem>
  ));

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        startIcon={getSelectedDensityIcon()}
        onClick={handleDensitySelectorOpen}
        aria-label={apiRef!.current.getLocaleText('toolbarDensityLabel')}
        aria-expanded={anchorEl ? 'true' : undefined}
        aria-haspopup="listbox"
      >
        {apiRef!.current.getLocaleText('toolbarDensity')}
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleDensitySelectorClose}
        position="bottom-start"
      >
        <MenuList role="listbox" onKeyDown={handleListKeyDown} autoFocusItem={Boolean(anchorEl)}>
          {renderDensityOptions}
        </MenuList>
      </GridMenu>
    </React.Fragment>
  );
}
