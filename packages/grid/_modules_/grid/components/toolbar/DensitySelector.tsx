import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';
import { DensityTypes, Density } from '../../models/gridOptions';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { DensityOption } from '../../models/api/densityApi';
import { densityValueSelector } from '../../hooks/features/density';
import { GridMenu } from '../menu/GridMenu';

const DensitySelectorListItemText = withStyles({
  root: {
    textTransform: 'capitalize',
  },
})(ListItemText);

export function DensitySelector() {
  const apiRef = React.useContext(ApiContext);
  const { density, rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const densityValue = useGridSelector(apiRef, densityValueSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const icons = useIcons();

  const DensityCompactIcon = icons!.DensityCompact!;
  const DensityStandardIcon = icons!.DensityStandard!;
  const DensityComfortableIcon = icons!.DensityComfortable!;

  const DensityOptions: Array<DensityOption> = [
    {
      icon: <DensityCompactIcon />,
      label: DensityTypes.Compact,
    },
    {
      icon: <DensityStandardIcon />,
      label: DensityTypes.Standard,
    },
    {
      icon: <DensityComfortableIcon />,
      label: DensityTypes.Comfortable,
    },
  ];

  React.useEffect(() => {
    apiRef!.current.setDensity(density, headerHeight, rowHeight);
  }, [apiRef, density, rowHeight, headerHeight]);

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
  const handleDensityUpdate = React.useCallback(
    (newDensity: Density) => {
      apiRef!.current.setDensity(newDensity);
      setAnchorEl(null);
    },
    [apiRef],
  );

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' || event.key === 'Escape') {
      event.preventDefault();
      handleDensitySelectorClose();
    }
  };

  const renderDensityOptions: Array<React.ReactElement> = DensityOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleDensityUpdate(option.label)}
      selected={option.label === densityValue}
    >
      <ListItemIcon>{option.icon}</ListItemIcon>
      <DensitySelectorListItemText
        primaryTypographyProps={{ variant: 'body2' }}
        primary={option.label}
      />
    </MenuItem>
  ));

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        startIcon={getSelectedDensityIcon()}
        onClick={handleDensitySelectorOpen}
        aria-label="Density"
        aria-haspopup="true"
      >
        Density
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleDensitySelectorClose}
        onKeyDown={handleListKeyDown}
      >
        {renderDensityOptions}
      </GridMenu>
    </React.Fragment>
  );
}
