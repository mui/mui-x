"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var getDefaultProps = function (nbColumns) {
    var columns = [];
    var row = {};
    for (var i = 1; i <= nbColumns; i += 1) {
        columns.push({ field: "col".concat(i) });
        row["col".concat(i)] = i;
    }
    return {
        disableVirtualization: true,
        columns: columns,
        rows: [__assign({ id: 0 }, row)],
        autoHeight: isJSDOM,
    };
};
describe('<DataGrid /> - Column grouping', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function TestDataGrid(props) {
        var nbColumns = props.nbColumns, other = __rest(props, ["nbColumns"]);
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...getDefaultProps(nbColumns)} {...other}/>
      </div>);
    }
    describe('Header grouping columns', function () {
        it('should add one header row when columns have a group', function () {
            render(<TestDataGrid nbColumns={2} columnGroupingModel={[{ groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] }]}/>);
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(3);
        });
        it('should add header rows to match max depth of column groups', function () {
            render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col123',
                        children: [
                            { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                            { field: 'col3' },
                        ],
                    },
                ]}/>);
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(4);
        });
        it('should add correct aria-colspan, aria-colindex on headers', function () {
            render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col123',
                        children: [
                            { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                            { field: 'col3' },
                        ],
                    },
                ]}/>);
            var row1Headers = document.querySelectorAll('[aria-rowindex="1"] [role="columnheader"]');
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(row1Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['3']);
            expect(Array.from(row1Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['2', '1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '3']);
        });
        it('should support non connexe groups', function () {
            render(<TestDataGrid nbColumns={4} columnGroupingModel={[
                    {
                        groupId: 'col134',
                        children: [
                            { groupId: 'col13', children: [{ field: 'col1' }, { field: 'col3' }] },
                            { field: 'col4' },
                        ],
                    },
                ]}/>);
            var row1Headers = document.querySelectorAll('[aria-rowindex="1"] [role="columnheader"]');
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(row1Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['1', '1', '2']);
            expect(Array.from(row1Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '2', '3']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['1', '1', '1', '1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '2', '3', '4']);
        });
        it('should only consider visible columns non connexe groups', function () {
            var setProps = render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col12',
                        children: [{ field: 'col1' }, { groupId: 'col2', children: [{ field: 'col2' }] }],
                    },
                ]}/>).setProps;
            // 2 header groups, 1 header, 1 row
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(4);
            // hide the column with 2 nested groups
            setProps({ columnVisibilityModel: { col2: false } });
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(3);
            // hide the last  column with a group
            setProps({ columnVisibilityModel: { col1: false, col2: false } });
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(2);
        });
        it('should update headers when `columnGroupingModel` is modified', function () {
            var setProps = render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col12',
                        children: [{ field: 'col1' }, { groupId: 'col2', children: [{ field: 'col2' }] }],
                    },
                ]}/>).setProps;
            // 2 header groups, 1 header, 1 row
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(4);
            // remove the top group
            setProps({ columnGroupingModel: [{ groupId: 'col2', children: [{ field: 'col2' }] }] });
            expect(internal_test_utils_1.screen.queryAllByRole('row')).to.have.length(3);
        });
        it('should split empty group cell if they are children of different group', function () {
            render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col1',
                        children: [{ field: 'col1' }],
                    },
                    {
                        groupId: 'col2',
                        children: [{ field: 'col2' }],
                    },
                    {
                        groupId: 'col3',
                        children: [
                            {
                                groupId: 'col3bis',
                                children: [{ field: 'col3' }],
                            },
                        ],
                    },
                ]}/>);
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['1', '1', '1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '2', '3']);
        });
        it('should merge empty group cell if they are children of the group', function () {
            render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col12',
                        children: [{ field: 'col1' }, { field: 'col2' }],
                    },
                    {
                        groupId: 'col3',
                        children: [
                            {
                                groupId: 'col3bis',
                                children: [{ field: 'col3' }],
                            },
                        ],
                    },
                ]}/>);
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colspan'); })).to.deep.equal(['2', '1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '3']);
        });
        it('should not throw warning when all columns are hidden', function () {
            var setProps = render(<TestDataGrid nbColumns={3} columnGroupingModel={[
                    {
                        groupId: 'col123',
                        children: [
                            { groupId: 'A', children: [{ field: 'col1' }, { field: 'col2' }] },
                            { field: 'col3' },
                        ],
                    },
                ]}/>).setProps;
            setProps({
                columnVisibilityModel: {
                    col1: false,
                    col2: false,
                    col3: false,
                },
            });
        });
        // See https://github.com/mui/mui-x/issues/8602
        it('should not throw when both `columns` and `columnGroupingModel` are updated', function () {
            var defaultProps = getDefaultProps(2);
            var setProps = render(<TestDataGrid nbColumns={0} {...defaultProps} columnGroupingModel={[
                    {
                        groupId: 'testGroup',
                        children: [{ field: 'col1' }, { field: 'col2' }],
                    },
                ]}/>).setProps;
            setProps({
                columns: __spreadArray(__spreadArray([], defaultProps.columns, true), [{ field: 'newColumn' }], false),
                columnGroupingModel: [
                    {
                        groupId: 'testGroup',
                        children: [{ field: 'col1' }, { field: 'col2' }, { field: 'newColumn' }],
                    },
                ],
            });
            var row1Headers = document.querySelectorAll('[aria-rowindex="1"] [role="columnheader"]');
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"]');
            expect(Array.from(row1Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1']);
            expect(Array.from(row2Headers).map(function (header) { return header.getAttribute('aria-colindex'); })).to.deep.equal(['1', '2', '3']);
        });
        // https://github.com/mui/mui-x/issues/13985
        it('should not throw when both `columns` and `columnGroupingModel` are updated twice', function () {
            function Demo() {
                var _a = React.useState({
                    columns: [],
                    columnGroupingModel: [],
                }), props = _a[0], setProps = _a[1];
                var handleClick = function () {
                    ReactDOM.flushSync(function () {
                        setProps({
                            columns: [{ field: "field_0" }],
                            columnGroupingModel: [{ groupId: 'Group', children: [{ field: "field_0" }] }],
                        });
                    });
                    setProps({
                        columns: [{ field: "field_1" }],
                        columnGroupingModel: [{ groupId: 'Group', children: [{ field: "field_1" }] }],
                    });
                };
                return (<div style={{ width: 300, height: 300 }}>
            <button onClick={handleClick}>Update columns</button>
            <x_data_grid_1.DataGrid rows={[{ id: 1, field_0: 'Value 0', field_1: 'Value 1' }]} {...props}/>
          </div>);
            }
            render(<Demo />);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /Update columns/ }));
            var row1Headers = document.querySelectorAll('[aria-rowindex="1"] [role="columnheader"] .MuiDataGrid-columnHeaderTitle');
            var row2Headers = document.querySelectorAll('[aria-rowindex="2"] [role="columnheader"] .MuiDataGrid-columnHeaderTitle');
            expect(Array.from(row1Headers).map(function (header) { return header.textContent; })).to.deep.equal(['Group']);
            expect(Array.from(row2Headers).map(function (header) { return header.textContent; })).to.deep.equal([
                'field_1',
            ]);
        });
    });
    // TODO: remove the skip. I failed to test if an error is thrown
    describe.skip('error messages', function () {
        function TestWithError(props) {
            return (<internal_test_utils_1.ErrorBoundary>
          <TestDataGrid {...props}/>
        </internal_test_utils_1.ErrorBoundary>);
        }
        it('should log an error if two groups have the same id', function () {
            expect(function () {
                render(<TestWithError nbColumns={2} columnGroupingModel={[
                        {
                            groupId: 'col12',
                            children: [{ field: 'col1' }, { groupId: 'col12', children: [{ field: 'col2' }] }],
                        },
                    ]}/>);
            }).toErrorDev();
        });
        it('should log an error if a columns is referenced in two groups', function () {
            expect(function () {
                render(<TestWithError nbColumns={3} columnGroupingModel={[
                        {
                            groupId: 'col12',
                            children: [{ field: 'col1' }, { field: 'col2' }],
                        },
                        {
                            groupId: 'col23',
                            children: [{ field: 'col2' }, { field: 'col3' }],
                        },
                    ]}/>);
            }).toErrorDev();
        });
        it('should log an error if a group have no id', function () {
            expect(function () {
                try {
                    render(<TestWithError nbColumns={2} columnGroupingModel={[
                            {
                                // @ts-ignore
                                groupId: undefined,
                                children: [
                                    { field: 'col1' },
                                    { groupId: 'col12', children: [{ field: 'col2' }] },
                                ],
                            },
                        ]}/>);
                }
                catch (error) {
                    console.error(error);
                }
            }).toErrorDev('MUI-DataGrid: an element of the columnGroupingModel does not have either `field` or `groupId`');
        });
        it('should log a warning if a group has no children', function () {
            expect(function () {
                render(<TestWithError nbColumns={2} columnGroupingModel={[
                        {
                            groupId: 'col12',
                            children: [],
                        },
                    ]}/>);
            }).toWarnDev('MUI-DataGrid: group groupId=col12 has no children.');
            expect(function () {
                render(<TestWithError nbColumns={2} columnGroupingModel={[
                        // @ts-ignore
                        {
                            groupId: 'col12',
                        },
                    ]}/>);
            }).toWarnDev('MUI-DataGrid: group groupId=col12 has no children.');
        });
    });
});
