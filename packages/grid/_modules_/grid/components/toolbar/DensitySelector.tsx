import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { densityValueSelector } from '../../hooks/features/density/densitySelector';
import { Density, DensityTypes } from '../../models/density';
import { ApiContext } from '../api-context';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/optionsSelector';
import { DensityOption } from '../../models/api/densityApi';
import { GridMenu } from '../menu/GridMenu';

export function DensitySelector() {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const densityValue = useGridSelector(apiRef, densityValueSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const DensityCompactIcon = apiRef!.current.components!.DensityCompactIcon!;
  const DensityStandardIcon = apiRef!.current.components!.DensityStandardIcon!;
  const DensityComfortableIcon = apiRef!.current.components!.DensityComfortableIcon!;

  const DensityOptions: Array<DensityOption> = [
    {
      icon: <DensityCompactIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityCompact'),
      value: DensityTypes.Compact,
    },
    {
      icon: <DensityStandardIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityStandard'),
      value: DensityTypes.Standard,
    },
    {
      icon: <DensityComfortableIcon />,
      label: apiRef!.current.getLocaleText('toolbarDensityComfortable'),
      value: DensityTypes.Comfortable,
    },
  ];

  const getSelectedDensityIcon = React.useCallback((): React.ReactElement => {
    switch (densityValue) {
      case DensityTypes.Compact:
        return <DensityCompactIcon />;
      case DensityTypes.Comfortable:
        return <DensityComfortableIcon />;
      default:
        return <DensityStandardIcon />;
    }
  }, [densityValue, DensityCompactIcon, DensityComfortableIcon, DensityStandardIcon]);

  const handleDensitySelectorOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDensitySelectorClose = () => setAnchorEl(null);
  const handleDensityUpdate = (newDensity: Density) => {
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
  if (options.disableColumnFilter) {
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
        aria-haspopup="true"
      >
        {apiRef!.current.getLocaleText('toolbarDensity')}
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleDensitySelectorClose}
        position="bottom-start"
      >
        <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
          {renderDensityOptions}
        </MenuList>
      </GridMenu>
    </React.Fragment>
  );
}
