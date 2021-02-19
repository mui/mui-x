import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { GridCellParams } from '@material-ui/x-grid';

export function renderAvatar(params: GridCellParams) {
  return (
    <Avatar style={{ backgroundColor: (params.value! as any).color }}>
      {(params.value! as any).name!.toString().substring(0, 1)}
    </Avatar>
  );
}
