import { randomArrayItem } from './random-generator';
export const addTreeDataOptionsToDemoData = (data, options = {}) => {
    const { averageChildren = 2, maxDepth = 1, groupingField } = options;
    const hasTreeData = maxDepth > 1 && groupingField != null;
    if (!hasTreeData) {
        return data;
    }
    if (data.rows.length > 1000) {
        throw new Error('MUI X: useDemoData tree data mode only works up to 1000 rows.');
    }
    const rowsByTreeDepth = {};
    const rowsCount = data.rows.length;
    const groupingCol = data.columns.find((col) => col.field === options.groupingField);
    if (!groupingCol) {
        throw new Error('MUI X: The tree data grouping field does not exist.');
    }
    data.initialState.columns.columnVisibilityModel[groupingField] = false;
    for (let i = 0; i < rowsCount; i += 1) {
        const row = data.rows[i];
        const currentChunk = Math.floor((i * (averageChildren ** maxDepth - 1)) / rowsCount) + 1;
        const currentDepth = Math.floor(Math.log(currentChunk) / Math.log(averageChildren));
        if (!rowsByTreeDepth[currentDepth]) {
            rowsByTreeDepth[currentDepth] = { rows: {}, rowIndexes: [] };
        }
        rowsByTreeDepth[currentDepth].rows[i] = { value: row, parentIndex: null };
        rowsByTreeDepth[currentDepth].rowIndexes.push(i);
    }
    Object.entries(rowsByTreeDepth).forEach(([depthStr, { rows }]) => {
        const depth = Number(depthStr);
        Object.values(rows).forEach((row) => {
            const path = [];
            let previousRow = null;
            for (let k = depth; k >= 0; k -= 1) {
                let rowTemp;
                if (k === depth) {
                    if (depth > 0) {
                        row.parentIndex = Number(randomArrayItem(rowsByTreeDepth[depth - 1].rowIndexes));
                    }
                    rowTemp = row;
                }
                else {
                    rowTemp = rowsByTreeDepth[k].rows[previousRow.parentIndex];
                }
                path.unshift(rowTemp.value[groupingField]);
                previousRow = rowTemp;
            }
            row.value.path = path;
        });
    });
    return {
        ...data,
        groupingColDef: {
            headerName: groupingCol.headerName ?? groupingCol.field,
            width: 250,
        },
        getTreeDataPath: (row) => row.path,
        treeData: true,
    };
};
