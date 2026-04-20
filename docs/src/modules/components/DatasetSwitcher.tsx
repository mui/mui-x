import * as React from 'react';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export interface DatasetDefinition {
  label: string;
  initialEvents: SchedulerEvent[];
  defaultVisibleDate: Date;
  resources: SchedulerResource[];
}

export interface DatasetSwitcherProps {
  datasets: DatasetDefinition[];
  selectedIndex: number;
  onSelectDataset: (index: number) => void;
}

export function DatasetSwitcher(props: DatasetSwitcherProps) {
  const { datasets, selectedIndex, onSelectDataset } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (index: number) => {
    onSelectDataset(index);
    handleClose();
  };

  return (
    <React.Fragment>
      <Fab
        color="primary"
        onClick={handleClick}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        aria-label="Switch dataset"
      >
        <SwapHorizIcon />
      </Fab>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {datasets.map((dataset, index) => (
          <MenuItem
            key={dataset.label}
            selected={index === selectedIndex}
            onClick={() => handleSelect(index)}
          >
            <ListItemText>{dataset.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}
