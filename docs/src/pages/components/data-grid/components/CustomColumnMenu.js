import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  GridColumnMenu,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
  useGridApiRef,
  XGrid,
} from '@material-ui/x-grid';
import StarOutlineIcon from '@material-ui/icons/StarOutline';

const useStyles = makeStyles((theme) => ({
  primary: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  secondary: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

function CustomColumnMenuComponent(props) {
  const classes = useStyles();
  const { hideMenu, currentColumn, color, ...other } = props;

  if (currentColumn.field === 'name') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        className={classes[color]}
        {...other}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn} />
      </GridColumnMenuContainer>
    );
  }
  if (currentColumn.field === 'stars') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        className={classes[color]}
        {...other}
      >
        <div
          style={{
            width: 127,
            height: 160,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <StarOutlineIcon style={{ fontSize: 80 }} />
        </div>
      </GridColumnMenuContainer>
    );
  }
  return (
    <GridColumnMenu
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      className={classes[color]}
      {...other}
    />
  );
}

CustomColumnMenuComponent.propTypes = {
  color: PropTypes.string.isRequired,
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
};

export { CustomColumnMenuComponent };

export default function CustomColumnMenu() {
  const [color, setColor] = React.useState('primary');
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.showColumnMenu('default');
  }, [apiRef, color]);

  return (
    <div
      style={{
        height: 300,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ alignSelf: 'center' }}>
        <Button
          color={color}
          onClick={() =>
            setColor((current) => (current === 'primary' ? 'secondary' : 'primary'))
          }
        >
          Toggle menu background
        </Button>
      </div>
      <div style={{ height: 250, width: '100%', marginTop: 16 }}>
        <XGrid
          apiRef={apiRef}
          columns={[
            { field: 'default', width: 150 },
            { field: 'name', width: 150 },
            { field: 'stars', width: 150 },
          ]}
          rows={[
            {
              id: 1,
              name: 'Material-UI',
              stars: 28000,
              default: 'Open source',
            },
            {
              id: 2,
              name: 'XGrid',
              stars: 15000,
              default: 'Enterprise',
            },
          ]}
          components={{
            ColumnMenu: CustomColumnMenuComponent,
          }}
          componentsProps={{
            columnMenu: { color },
          }}
        />
      </div>
    </div>
  );
}
