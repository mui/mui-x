import * as React from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useIcons } from '../../hooks/utils/useIcons';
import { ApiContext } from '../api-context';
import { SizeTypes, Size } from '../../models/gridOptions';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { SizeOption } from '../../models/api/sizeApi';
import { sizeValueSelector } from '../../hooks/features/size';
import { GridMenu } from '../menu/GridMenu';

export function SizePicker() {
  const apiRef = React.useContext(ApiContext);
  const { size, rowHeight, headerHeight } = useGridSelector(apiRef, optionsSelector);
  const sizeValue = useGridSelector(apiRef, sizeValueSelector);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const icons = useIcons();

  const SizeSmallIcon = icons!.SizeSmall!;
  const SizeMediumIcon = icons!.SizeMedium!;
  const SizeLargeIcon = icons!.SizeLarge!;

  const SizeOptions: Array<SizeOption> = [
    {
      icon: <SizeSmallIcon />,
      label: SizeTypes.Small,
    },
    {
      icon: <SizeMediumIcon />,
      label: SizeTypes.Medium,
    },
    {
      icon: <SizeLargeIcon />,
      label: SizeTypes.Large,
    },
  ];

  React.useEffect(() => {
    apiRef!.current.setSize(size, headerHeight, rowHeight);
  }, [apiRef, size, rowHeight, headerHeight]);

  const getSelectedSizeIcon = React.useCallback((): React.ReactElement => {
    switch (sizeValue) {
      case SizeTypes.Small:
        return <SizeSmallIcon />;
      case SizeTypes.Large:
        return <SizeLargeIcon />;
      default:
        return <SizeMediumIcon />;
    }
  }, [sizeValue]);

  const handleSizePickerOpen = (event) => setAnchorEl(event.currentTarget);
  const handleSizePickerClose = () => setAnchorEl(null);
  const handleSizeUpdate = React.useCallback(
    (newSize: Size) => {
      apiRef!.current.setSize(newSize);
      setAnchorEl(null);
    },
    [apiRef],
  );

  const renderSizeOptions: Array<React.ReactElement> = SizeOptions.map((option, index) => (
    <MenuItem
      key={index}
      onClick={() => handleSizeUpdate(option.label)}
      selected={option.label === sizeValue}
    >
      <ListItemIcon>{option.icon}</ListItemIcon>
      <ListItemText primary={option.label} />
    </MenuItem>
  ));

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        startIcon={getSelectedSizeIcon()}
        onClick={handleSizePickerOpen}
        aria-label="Density"
        aria-haspopup="true"
      >
        Density
      </Button>
      <GridMenu
        open={Boolean(anchorEl)}
        target={anchorEl}
        onClickAway={handleSizePickerClose}
        onKeyDown={handleSizePickerClose}
      >
        {renderSizeOptions}
      </GridMenu>
    </React.Fragment>
  );
}
