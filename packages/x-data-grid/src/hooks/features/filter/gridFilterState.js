import { GridLogicOperator } from '../../../models/gridFilterItem';
export const defaultGridFilterLookup = {
    filteredRowsLookup: {},
    filteredChildrenCountLookup: {},
    filteredDescendantCountLookup: {},
};
export const getDefaultGridFilterModel = () => ({
    items: [],
    logicOperator: GridLogicOperator.And,
    quickFilterValues: [],
    quickFilterLogicOperator: GridLogicOperator.And,
});
