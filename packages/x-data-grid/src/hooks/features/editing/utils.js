export const getDefaultCellValue = (colDef) => {
    switch (colDef.type) {
        case 'boolean':
            return false;
        case 'date':
        case 'dateTime':
        case 'number':
            return undefined;
        case 'singleSelect':
            return null;
        case 'string':
        default:
            return '';
    }
};
