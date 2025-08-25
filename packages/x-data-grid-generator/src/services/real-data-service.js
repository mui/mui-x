"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealGridData = getRealGridData;
var asyncWorker_1 = require("./asyncWorker");
function getRealGridData(rowLength, columns) {
    return new Promise(function (resolve) {
        var tasks = { current: rowLength };
        var rows = [];
        var indexedValues = {};
        function work() {
            var row = {};
            for (var j = 0; j < columns.length; j += 1) {
                var column = columns[j];
                if (column.generateData) {
                    var context = {};
                    if (column.dataGeneratorUniquenessEnabled) {
                        var fieldValues = indexedValues[column.field];
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
        var columnVisibilityModel = {};
        columns.forEach(function (col) {
            if (col.hide) {
                columnVisibilityModel[col.field] = false;
            }
        });
        (0, asyncWorker_1.default)({
            work: work,
            done: function () { return resolve({ columns: columns, rows: rows, initialState: { columns: { columnVisibilityModel: columnVisibilityModel } } }); },
            tasks: tasks,
        });
    });
}
