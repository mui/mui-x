import * as React from 'react';
import { unstable_useId as useId, useForkRef } from '@mui/material/utils';
import MenuList from '@mui/material/MenuList';
import Button, { ButtonProps } from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { gridDensityValueSelector } from '../../hooks/features/density/densitySelector';
import { GridDensity, GridDensityTypes } from '../../models/gridDensity';
import { isHideMenuKey, isTabKey } from '../../utils/keyboardUtils';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { GridDensityOption } from '../../models/api/gridDensityApi';
import { GridMenu } from '../menu/GridMenu';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridToolbarDensitySelector = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function GridToolbarDensitySelector(props, ref) {
    const { onClick, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const densityValue = useGridSelector(apiRef, gridDensityValueSelector);
    const densityButtonId = useId();
    const densityMenuId = useId();

    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const handleRef = useForkRef(ref, buttonRef);

    const densityOptions: GridDensityOption[] = [
      {
        icon: <rootProps.components.DensityCompactIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityCompact'),
        value: GridDensityTypes.Compact,
      },
      {
        icon: <rootProps.components.DensityStandardIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityStandard'),
        value: GridDensityTypes.Standard,
      },
      {
        icon: <rootProps.components.DensityComfortableIcon />,
        label: apiRef.current.getLocaleText('toolbarDensityComfortable'),
        value: GridDensityTypes.Comfortable,
      },
    ];

    const startIcon = React.useMemo<React.ReactElement>(() => {
      switch (densityValue) {
        case GridDensityTypes.Compact:
          return <rootProps.components.DensityCompactIcon />;
        case GridDensityTypes.Comfortable:
          return <rootProps.components.DensityComfortableIcon />;
        default:
          return <rootProps.components.DensityStandardIcon />;
      }
    }, [densityValue, rootProps]);

    const handleDensitySelectorOpen = (event) => {
      setOpen(true);
      onClick?.(event);
    };
    const handleDensitySelectorClose = () => setOpen(false);
    const handleDensityUpdate = (newDensity: GridDensity) => {
      apiRef.current.setDensity(newDensity);
      setOpen(false);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
      if (isTabKey(event.key)) {
        event.preventDefault();
      }
      if (isHideMenuKey(event.key)) {
        handleDensitySelectorClose();
      }
    };

    // Disable the button if the corresponding is disabled
    if (rootProps.disableDensitySelector) {
      return null;
    }

    const densityElements = densityOptions.map<React.ReactElement>((option, index) => (
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
          ref={handleRef}
          color="primary"
          size="small"
          startIcon={startIcon}
          aria-label={apiRef.current.getLocaleText('toolbarDensityLabel')}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          aria-labelledby={densityMenuId}
          id={densityButtonId}
          {...other}
          onClick={handleDensitySelectorOpen}
        >
          {apiRef.current.getLocaleText('toolbarDensity')}
        </Button>
        <GridMenu
          open={open}
          target={buttonRef.current}
          onClickAway={handleDensitySelectorClose}
          position="bottom-start"
        >
          <MenuList
            id={densityMenuId}
            className="MuiDataGrid-gridMenuList"
            aria-labelledby={densityButtonId}
            onKeyDown={handleListKeyDown}
            autoFocusItem={open}
          >
            {densityElements}
          </MenuList>
        </GridMenu>
      </React.Fragment>
    );
  },
);
