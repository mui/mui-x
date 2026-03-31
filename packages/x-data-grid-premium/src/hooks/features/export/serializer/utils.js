export const getExcelJs = async () => {
    const excelJsModule = await import('@mui/x-internal-exceljs-fork');
    return excelJsModule.default ?? excelJsModule;
};
export const addColumnGroupingHeaders = (worksheet, columns, columnGroupPaths, columnGroupDetails) => {
    const maxDepth = Math.max(...columns.map(({ key }) => columnGroupPaths[key]?.length ?? 0));
    if (maxDepth === 0) {
        return;
    }
    for (let rowIndex = 0; rowIndex < maxDepth; rowIndex += 1) {
        const row = columns.map(({ key }) => {
            const groupingPath = columnGroupPaths[key];
            if (groupingPath.length <= rowIndex) {
                return { groupId: null, parents: groupingPath };
            }
            return {
                ...columnGroupDetails[groupingPath[rowIndex]],
                parents: groupingPath.slice(0, rowIndex),
            };
        });
        const newRow = worksheet.addRow(row.map((group) => (group.groupId === null ? null : (group?.headerName ?? group.groupId))));
        // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
        const lastRowIndex = newRow.worksheet.rowCount;
        let leftIndex = 0;
        let rightIndex = 1;
        while (rightIndex < columns.length) {
            const { groupId: leftGroupId, parents: leftParents } = row[leftIndex];
            const { groupId: rightGroupId, parents: rightParents } = row[rightIndex];
            const areInSameGroup = leftGroupId === rightGroupId &&
                leftParents.length === rightParents.length &&
                leftParents.every((leftParent, index) => rightParents[index] === leftParent);
            if (areInSameGroup) {
                rightIndex += 1;
            }
            else {
                if (rightIndex - leftIndex > 1) {
                    worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
                }
                leftIndex = rightIndex;
                rightIndex += 1;
            }
        }
        if (rightIndex - leftIndex > 1) {
            worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
        }
    }
};
export function addSerializedRowToWorksheet(serializedRow, worksheet) {
    const { row, dataValidation, outlineLevel, mergedCells } = serializedRow;
    const newRow = worksheet.addRow(row);
    Object.keys(dataValidation).forEach((field) => {
        newRow.getCell(field).dataValidation = {
            ...dataValidation[field],
        };
    });
    if (outlineLevel) {
        newRow.outlineLevel = outlineLevel;
    }
    // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
    const lastRowIndex = newRow.worksheet.rowCount;
    mergedCells.forEach((mergedCell) => {
        worksheet.mergeCells(lastRowIndex, mergedCell.leftIndex, lastRowIndex, mergedCell.rightIndex);
    });
}
export async function createValueOptionsSheetIfNeeded(valueOptionsData, sheetName, workbook) {
    if (Object.keys(valueOptionsData).length === 0) {
        return;
    }
    const valueOptionsWorksheet = workbook.addWorksheet(sheetName);
    valueOptionsWorksheet.columns = Object.keys(valueOptionsData).map((key) => ({ key }));
    Object.entries(valueOptionsData).forEach(([field, { values }]) => {
        valueOptionsWorksheet.getColumn(field).values = values;
    });
}
