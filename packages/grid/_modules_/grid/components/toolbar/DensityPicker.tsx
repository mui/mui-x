import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';
import { DensityTypes, Density } from '../../models/gridOptions';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { DensityOption } from '../../models/api/densityApi';
import { densitySizeSelector } from '../../hooks/features/density';

export const DensityPicker = React.memo(function DensityPicker() {
  const apiRef = React.useContext(ApiContext);
  const { density, rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const densitySize = useGridSelector(apiRef, densitySizeSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const icons = useIcons();

  const DensitySmallIcon = icons!.DensitySmall!;
  const DensityMediumIcon = icons!.DensityMedium!;
  const DensityLargeIcon = icons!.DensityLarge!;

  const DensityOptions: Array<DensityOption> = [
    {
      icon: <DensitySmallIcon />,
      label: DensityTypes.Small,
    },
    {
      icon: <DensityMediumIcon />,
      label: DensityTypes.Medium,
    },
    {
      icon: <DensityLargeIcon />,
      label: DensityTypes.Large,
    },
  ];

  React.useEffect(() => {
    apiRef!.current.setDensity(density, headerHeight, rowHeight);
  }, [apiRef, density, rowHeight, headerHeight]);

  const getSelectedDensityIcon = React.useCallback((): React.ReactElement => {
    switch (densitySize) {
      case DensityTypes.Small:
        return <DensitySmallIcon />;
      case DensityTypes.Large:
        return <DensityLargeIcon />;
      default:
        return <DensityMediumIcon />;
    }
  }, [densitySize]);

  const handleDensityPickerOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDensityPickerClose = () => setAnchorEl(null);
  const handleDensityUpdate = React.useCallback(
    (newDensity: Density) => {
      apiRef!.current.setDensity(newDensity);
      setAnchorEl(null);
    },
    [apiRef],
  );

  const renderDensityOptions: Array<React.ReactElement> = DensityOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleDensityUpdate(option.label)}
      selected={option.label === densitySize}
    >
      <ListItemIcon>{option.icon}</ListItemIcon>
      <ListItemText primary={option.label} />
    </MenuItem>
  ));

  return (
    <div className="MuiDataGrid-toolbarElement">
      <Button
        color="primary"
        size="small"
        startIcon={getSelectedDensityIcon()}
        onClick={handleDensityPickerOpen}
        aria-label="Density"
        aria-haspopup="true"
      >
        Density
      </Button>
      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDensityPickerClose}
      >
        {renderDensityOptions}
      </Menu>
    </div>
  );
});
