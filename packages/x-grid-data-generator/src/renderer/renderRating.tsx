import { CellParams } from '@material-next/x-grid';
import { Rating } from '@material-ui/lab';
import * as React from 'react';

export function renderRating(params: CellParams) {
  return <Rating name={params.data.id.toString()} value={Number(params.value)} readOnly />;
}
