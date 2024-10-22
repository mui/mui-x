import * as React from 'react';
import {
  GridViewStreamIcon,
  useGridApiContext,
  useGridSelector,
  GridDensityOption,
  gridDensitySelector,
  GridCheckIcon,
  GridDensity,
  GridViewHeadlineIcon,
  GridTableRowsIcon,
} from '@mui/x-data-grid-premium';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import { Drawer, DrawerHeader, DrawerProps } from './Drawer';
import { ToolbarButton } from './ToolbarButton';

const DENSITY_ICONS = {
  compact: GridViewHeadlineIcon,
  standard: GridTableRowsIcon,
  comfortable: GridViewStreamIcon,
};

const DENSITY_OPTIONS: Omit<GridDensityOption, 'icon'>[] = [
  {
    label: 'Compact',
    value: 'compact',
  },
  {
    label: 'Standard',
    value: 'standard',
  },
  {
    label: 'Comfortable',
    value: 'comfortable',
  },
];

interface ToolbarDensityItemProps {
  listView: boolean;
  container: DrawerProps['container'];
}

export function ToolbarDensityItem(props: ToolbarDensityItemProps) {
  const { listView, container } = props;
  const [open, setOpen] = React.useState(false);
  const apiRef = useGridApiContext();
  const density = useGridSelector(apiRef, gridDensitySelector);

  const handleDensityChange = (value: GridDensity) => {
    apiRef.current.setDensity(value);
    setOpen(false);
  };

  const Icon = DENSITY_ICONS[density];

  return (
    <React.Fragment>
      <ToolbarButton onClick={() => setOpen(true)}>
        <Icon fontSize="small" />
      </ToolbarButton>

      <Drawer
        anchor={listView ? 'bottom' : 'right'}
        open={open}
        container={container}
        onClose={() => setOpen(false)}
      >
        <DrawerHeader>
          <Typography fontWeight={500}>Density</Typography>
        </DrawerHeader>

        <List>
          {DENSITY_OPTIONS.map((option) => {
            const isActive = density === option.value;

            return (
              <ListItem key={option.value} disablePadding>
                <ListItemButton onClick={() => handleDensityChange(option.value)}>
                  <ListItemIcon>{isActive ? <GridCheckIcon /> : null}</ListItemIcon>
                  <ListItemText>{option.label}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </React.Fragment>
  );
}