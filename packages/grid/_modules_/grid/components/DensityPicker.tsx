import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useIcons } from '../hooks/utils/useIcons';
import { OptionsContext } from './options-context';
import { DensityTypes, DensityOption } from '../models/gridOptions';

export const DensityPicker = React.memo(function DensityPicker() {
  const { density } = React.useContext(OptionsContext);
  const [ selectedDensity, setSelectedDensity ] = React.useState(density);
  const [ anchorEl, setAnchorEl ] = React.useState(null);
  const icons = useIcons();

  const DensityShortIcon = icons!.densityShort!;
  const DensityMediumIcon = icons!.densityMedium!;
  const DensityTallIcon = icons!.densityTall!;

  const DensityOptions: Array<DensityOption> = [
    {
      icon: <DensityShortIcon />,
      label: DensityTypes.Short,
    },
    {
      icon: <DensityMediumIcon />,
      label: DensityTypes.Medium,
    },
    {
      icon: <DensityTallIcon />,
      label: DensityTypes.Tall,
    },
  ];

  const handleDensityPickerOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDensityPickerClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDensity = (newDensity) => {
    // TODO: Update the rowHeight option
    setSelectedDensity(newDensity);
    setAnchorEl(null);
  };

  const renderdensityOptions: Array<React.ReactElement> = DensityOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleSelectDensity(option.label)}
      selected={option.label === selectedDensity}
    >
      <ListItemIcon>
        {option.icon}
      </ListItemIcon>
      <ListItemText primary={option.label} />
    </MenuItem>
  ));

  return (
    <div className="MuiDataGrid-toolbarElement">
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        size="small"
        onClick={handleDensityPickerOpen}
      >
        Density
      </Button>

      <Menu
        elevation={1}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleDensityPickerClose}
      >
        {renderdensityOptions}
      </Menu>
    </div>
  );
});
