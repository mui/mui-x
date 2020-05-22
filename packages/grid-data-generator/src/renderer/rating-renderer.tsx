import { CellParams } from '@material-ui-x/grid';
import { Rating } from '@material-ui/lab';
import React from 'react';

export function RatingRenderer(params: CellParams) {
	return <Rating name={params.data['id'].toString()} value={Number(params.value)} readOnly/>
}