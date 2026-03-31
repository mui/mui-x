import { jsx as _jsx } from "react/jsx-runtime";
import { gridRowNodeSelector } from '@mui/x-data-grid-pro';
import { GridFooterCell, } from '@mui/x-data-grid-pro/internals';
import { gridAggregationLookupSelector } from './gridAggregationSelectors';
import { GridAggregationHeader } from '../../../components/GridAggregationHeader';
import { gridPivotActiveSelector } from '../pivoting/gridPivotingSelectors';
const getAggregationValueWrappedRenderCell = ({ value: renderCell, aggregationRule, getCellAggregationResult, apiRef, }) => {
    const pivotActive = gridPivotActiveSelector(apiRef);
    const wrappedRenderCell = (params) => {
        const cellAggregationResult = getCellAggregationResult(params.id, params.field);
        if (cellAggregationResult != null) {
            if (!renderCell) {
                if (cellAggregationResult.position === 'footer') {
                    return _jsx(GridFooterCell, { ...params });
                }
                if (pivotActive && cellAggregationResult.value === 0) {
                    return null;
                }
                return params.formattedValue;
            }
            if (pivotActive && cellAggregationResult.value === 0) {
                return null;
            }
            const aggregationMeta = {
                hasCellUnit: aggregationRule.aggregationFunction.hasCellUnit ?? true,
                aggregationFunctionName: aggregationRule.aggregationFunctionName,
                position: cellAggregationResult.position,
            };
            return renderCell({ ...params, aggregation: aggregationMeta });
        }
        if (!renderCell) {
            return params.formattedValue;
        }
        return renderCell(params);
    };
    return wrappedRenderCell;
};
/**
 * Add the aggregation method around the header name
 */
const getWrappedRenderHeader = ({ value: renderHeader, aggregationRule, }) => {
    const wrappedRenderHeader = (params) => {
        // TODO: investigate why colDef is undefined
        if (!params.colDef) {
            return null;
        }
        return (_jsx(GridAggregationHeader, { ...params, aggregation: { aggregationRule }, renderHeader: renderHeader }));
    };
    return wrappedRenderHeader;
};
/**
 * Add a wrapper around each wrappable property of the column to customize the behavior of the aggregation cells.
 */
export const wrapColumnWithAggregationValue = (column, aggregationRule, apiRef) => {
    const getCellAggregationResult = (id, field) => {
        let cellAggregationPosition = null;
        const rowNode = gridRowNodeSelector(apiRef, id);
        if (!rowNode) {
            return null;
        }
        if (rowNode.type === 'group') {
            cellAggregationPosition = 'inline';
        }
        else if (id.toString().startsWith('auto-generated-group-footer-')) {
            cellAggregationPosition = 'footer';
        }
        if (cellAggregationPosition == null) {
            return null;
        }
        // TODO: Add custom root id
        const groupId = cellAggregationPosition === 'inline' ? id : (rowNode.parent ?? '');
        const aggregationResult = gridAggregationLookupSelector(apiRef)?.[groupId]?.[field];
        if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
            return null;
        }
        return aggregationResult;
    };
    let didWrapSomeProperty = false;
    const wrappedColumn = {
        ...column,
        aggregationWrappedProperties: [],
    };
    const wrapColumnProperty = (property, wrapper) => {
        const originalValue = column[property];
        const wrappedProperty = wrapper({
            apiRef,
            value: originalValue,
            colDef: column,
            aggregationRule,
            getCellAggregationResult,
        });
        if (wrappedProperty !== originalValue) {
            didWrapSomeProperty = true;
            wrappedColumn[property] = wrappedProperty;
            wrappedColumn.aggregationWrappedProperties.push({
                name: property,
                originalValue,
                wrappedValue: wrappedProperty,
            });
        }
    };
    wrapColumnProperty('renderCell', getAggregationValueWrappedRenderCell);
    wrapColumnProperty('renderHeader', getWrappedRenderHeader);
    if (!didWrapSomeProperty) {
        return column;
    }
    return wrappedColumn;
};
const isColumnWrappedWithAggregation = (column) => {
    return (typeof column.aggregationWrappedProperties !==
        'undefined');
};
/**
 * Remove the aggregation wrappers around the wrappable properties of the column.
 */
export const unwrapColumnFromAggregation = (column) => {
    if (!isColumnWrappedWithAggregation(column)) {
        return column;
    }
    const { aggregationWrappedProperties, ...unwrappedColumn } = column;
    aggregationWrappedProperties.forEach(({ name, originalValue, wrappedValue }) => {
        // The value changed since we wrapped it
        if (wrappedValue !== unwrappedColumn[name]) {
            return;
        }
        unwrappedColumn[name] = originalValue;
    });
    return unwrappedColumn;
};
