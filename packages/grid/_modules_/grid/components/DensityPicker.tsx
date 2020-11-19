import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useIcons } from '../hooks/utils/useIcons';
import { ApiContext } from './api-context';
import { DensityTypes, Density } from '../models/gridOptions';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { useGridState } from '../hooks/features/core/useGridState';

interface DensityConfig {
  density: Density;
  headerHeight: number;
  rowHeight: number;
}

interface DensityOption {
  icon: React.ReactElement;
  label: DensityTypes;
}

const DENSITY_DIVISOR = 2;
const DENSITY_MULTIPLIER = 1.5;

export const DensityPicker = React.memo(function DensityPicker() {
  const api = React.useContext(ApiContext);
  const options = useGridSelector(api, optionsSelector);
  const [, setGridState, forceUpdate] = useGridState(api!);
  const initialDensityConfig = React.useRef<DensityConfig>({
    density: options.density,
    headerHeight: options.headerHeight,
    rowHeight: options.rowHeight,
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
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

  const getUpdatedDensityConfig = (newDensity: Density): DensityConfig => {
    switch (newDensity) {
      case DensityTypes.Short:
        return {
          density: newDensity,
          headerHeight: Math.floor(initialDensityConfig.current.headerHeight / DENSITY_DIVISOR),
          rowHeight: Math.floor(initialDensityConfig.current.rowHeight / DENSITY_DIVISOR),
        };
      case DensityTypes.Tall:
        return {
          density: newDensity,
          headerHeight: Math.floor(initialDensityConfig.current.headerHeight * DENSITY_MULTIPLIER),
          rowHeight: Math.floor(initialDensityConfig.current.rowHeight * DENSITY_MULTIPLIER),
        };
      default:
        return {
          ...initialDensityConfig.current,
          density: newDensity,
        };
    }
  };

  const handleDensityPickerOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDensityPickerClose = () => setAnchorEl(null);

  const handleUpdateDensity = (newDensity: DensityTypes) => {
    setAnchorEl(null);
    setGridState((oldState) => ({
      ...oldState,
      options: {
        ...oldState.options,
        ...getUpdatedDensityConfig(newDensity),
      },
    }));
    forceUpdate();
  };

  React.useEffect(() => {
    if (initialDensityConfig.current.density !== DensityTypes.Medium) {
      setGridState((oldState) => ({
        ...oldState,
        options: {
          ...oldState.options,
          ...getUpdatedDensityConfig(initialDensityConfig.current.density),
        },
      }));
      forceUpdate();
    }
  }, [setGridState, forceUpdate]);

  const renderDensityOptions: Array<React.ReactElement> = DensityOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleUpdateDensity(option.label)}
      selected={option.label === options.density}
    >
      <ListItemIcon>{option.icon}</ListItemIcon>
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
        {renderDensityOptions}
      </Menu>
    </div>
  );
});
