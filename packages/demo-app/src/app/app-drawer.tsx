import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { GridOn } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export interface AppDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

export function AppDrawer({ isOpen, toggleDrawer }: AppDrawerProps) {
  const classes = useStyles();

  return (
    <SwipeableDrawer open={isOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <List>
          <ListItem component={Link} button to={'/'} key={'back'}>
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary={'Material-UI X'}></ListItemText>
          </ListItem>
          <ListItem component={Link} to={'/grid'} button key={'gridData'}>
            <ListItemIcon>
              <GridOn />
            </ListItemIcon>
            <ListItemText primary={'Grid'}></ListItemText>
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
}
