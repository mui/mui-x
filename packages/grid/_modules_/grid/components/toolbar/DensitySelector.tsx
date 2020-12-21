import * as React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';
import { DensityTypes, Density } from '../../models/gridOptions';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { DensityOption } from '../../models/api/densityApi';
import { densityValueSelector } from '../../hooks/features/density';
import { GridMenu } from '../menu/GridMenu';

export function DensitySelector() {
  const apiRef = React.useContext(ApiContext);
  const densityValue = useGridSelector(apiRef, densityValueSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const icons = useIcons();

  const DensityCompactIcon = icons!.DensityCompact!;
  const DensityStandardIcon = icons!.DensityStandard!;
  const DensityComfortableIcon = icons!.DensityComfortable!;

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
  }, [densityValue]);

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
        onKeyDown={handleListKeyDown}
        position="bottom-start"
      >
        {renderDensityOptions}
      </GridMenu>
    </React.Fragment>
  );
}
