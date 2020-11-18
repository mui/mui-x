import * as React from 'react';
import { FilterInputValueProps } from '../components/tools/StringFilterInputValueProps';
import { ColDef } from './colDef/colDef';
import { FilterItem } from './filterItem';
import { CellParams } from './params/cellParams';

export interface FilterOperator {
	label: string;
	value: string | number;
	getApplyFilterFn: (
		filterItem: FilterItem,
		column: ColDef,
	) => null | ((params: CellParams) => boolean);
	InputComponent: React.ComponentType<FilterInputValueProps>;
}
