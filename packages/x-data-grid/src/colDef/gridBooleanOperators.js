import { GridFilterInputBoolean, sanitizeFilterItemValue, } from '../components/panel/filterPanel/GridFilterInputBoolean';
export const getGridBooleanOperators = () => [
    {
        value: 'is',
        getApplyFilterFn: (filterItem) => {
            const sanitizedValue = sanitizeFilterItemValue(filterItem.value);
            if (sanitizedValue === undefined) {
                return null;
            }
            return (value) => Boolean(value) === sanitizedValue;
        },
        InputComponent: GridFilterInputBoolean,
    },
];
