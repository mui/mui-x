import { Avatar } from '@material-ui/core';
import React from 'react';
import { CellParams } from '@material-ui-x/grid';

export function AvatarRenderer(params: CellParams) {
  return (
    <Avatar style={{ backgroundColor: (params.value! as any).color }}>
      {(params.value! as any).name!.toString().substring(0, 1)}
    </Avatar>
  );
}
