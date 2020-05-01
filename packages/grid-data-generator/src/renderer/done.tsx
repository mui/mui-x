import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

export const IsDone: React.FC<{ value: boolean }> = React.memo(({ value }) =>
  value ? <DoneIcon fontSize={'small'} /> : <ClearIcon fontSize={'small'} />,
);
IsDone.displayName = 'IsDone';
