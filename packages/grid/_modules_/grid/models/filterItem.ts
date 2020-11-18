import { FilterOperator } from './filterOperator';

export interface FilterItem {
	id?: number;
	columnField?: string;
	value?: string;
	operator?: FilterOperator; // Contains...
}

export enum LinkOperator {
	And = 'and',
	Or = 'or',
}
