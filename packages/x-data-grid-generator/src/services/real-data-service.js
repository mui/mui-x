import asyncWorker from './asyncWorker';
export function getRealGridData(rowLength, columns) {
    return new Promise((resolve) => {
        const tasks = { current: rowLength };
        const rows = [];
        const indexedValues = {};
        function work() {
            const row = {};
            for (let j = 0; j < columns.length; j += 1) {
                const column = columns[j];
                if (column.generateData) {
                    const context = {};
                    if (column.dataGeneratorUniquenessEnabled) {
                        let fieldValues = indexedValues[column.field];
                        if (!fieldValues) {
                            fieldValues = {};
                            indexedValues[column.field] = fieldValues;
                        }
                        context.values = fieldValues;
                    }
                    row[column.field] = column.generateData(row, context);
                }
            }
            rows.push(row);
            tasks.current -= 1;
        }
        const columnVisibilityModel = {};
        columns.forEach((col) => {
            if (col.hide) {
                columnVisibilityModel[col.field] = false;
            }
        });
        asyncWorker({
            work,
            done: () => resolve({ columns, rows, initialState: { columns: { columnVisibilityModel } } }),
            tasks,
        });
    });
}
