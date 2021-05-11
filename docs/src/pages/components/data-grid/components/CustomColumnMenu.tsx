import * as React from 'react';
import Button from '@material-ui/core/Button';
import {
  GridColumnMenu,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridFilterMenuItem,
  SortGridMenuItems,
  XGrid,
} from '@material-ui/x-grid';
import StarOutlineIcon from '@material-ui/icons/StarOutline';

export function CustomColumnMenu(props: GridColumnMenuProps & { bgColor: string }) {
  const { hideMenu, currentColumn, bgColor, ...other } = props;
  if (currentColumn.field === 'name') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        style={{ background: bgColor, color: '#fff' }}
        {...other}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      </GridColumnMenuContainer>
    );
  }
  if (currentColumn.field === 'stars') {
    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        style={{ background: bgColor, color: '#fff' }}
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
      style={{ background: bgColor, color: '#fff' }}
      {...other}
    />
  );
}

export default function CustomSortIcons() {
  const [menuBg, setMenuBg] = React.useState('#dc004d');
  return (
    <div style={{ height: 300, width: '100%' }}>
      <Button onClick={() => setMenuBg('#1876d2')}>Blue</Button>
      <Button onClick={() => setMenuBg('#dc004d')}>Red</Button>
      <div style={{ height: 250, width: '100%' }}>
        <XGrid
          columns={[
            { field: 'name', width: 150 },
            { field: 'stars', width: 150 },
            { field: 'users', width: 150 },
          ]}
          rows={[
            {
              id: 1,
              name: 'Material-UI',
              stars: 28000,
              users: '100M',
            },
            {
              id: 2,
              name: 'XGrid',
              stars: 15000,
              users: '10M',
            },
          ]}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
          componentsProps={{
            columnMenu: { bgColor: menuBg },
          }}
        />
      </div>
    </div>
  );
}
