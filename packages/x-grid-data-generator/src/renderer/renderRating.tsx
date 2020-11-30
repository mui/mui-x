import { CellParams } from '@material-ui/x-grid';
import { Rating } from '@material-ui/lab';
import * as React from 'react';

export function renderRating(params: CellParams) {
  return <Rating name={params.row.id.toString()} value={Number(params.value)} readOnly />;
}
