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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var rows = [{ id: '123567', title: 'test' }];
var columns = [{ field: 'id' }, { field: 'title' }];
var listColumn = {
    field: 'listColumn',
    renderCell: function (params) { return <div data-testid="list-column">Title: {params.row.title}</div>; },
};
describe('<DataGridPro /> - List view', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function Test(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} {...props}/>
      </div>);
    }
    it('should not render list column when list view is not enabled', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} listViewColumn={listColumn}/>
      </div>);
        expect(internal_test_utils_1.screen.queryByTestId('list-column')).to.equal(null);
    });
    it('should render list column when list view is enabled', function () {
        render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} listView listViewColumn={listColumn}/>
      </div>);
        expect(internal_test_utils_1.screen.getByTestId('list-column')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByTestId('list-column')).to.have.text('Title: test');
    });
    it('should render list column when `listView` prop updates', function () {
        var setProps = render(<Test listViewColumn={listColumn}/>).setProps;
        expect(internal_test_utils_1.screen.queryByTestId('list-column')).to.equal(null);
        setProps({ listView: true });
        expect(internal_test_utils_1.screen.getByTestId('list-column')).not.to.equal(null);
        expect(internal_test_utils_1.screen.getByTestId('list-column')).to.have.text('Title: test');
        setProps({ listView: false });
        expect(internal_test_utils_1.screen.queryByTestId('list-column')).to.equal(null);
    });
    it('should update cell contents when the `renderCell` function changes', function () {
        var setProps = render(<Test listView listViewColumn={listColumn}/>).setProps;
        setProps({
            listViewColumn: __assign(__assign({}, listColumn), { renderCell: function (params) { return <div data-testid="list-column">ID: {params.row.id}</div>; } }),
        });
        expect(internal_test_utils_1.screen.getByTestId('list-column')).to.have.text('ID: 123567');
    });
    it('should warn if the `listViewColumn` prop is not provided when `listView` is enabled', function () {
        expect(function () {
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_pro_1.DataGridPro columns={columns} rows={rows} listView/>
        </div>);
        }).toWarnDev([
            'MUI X: The `listViewColumn` prop must be set if `listView` is enabled.',
            'To fix, pass a column definition to the `listViewColumn` prop, e.g. `{ field: "example", renderCell: (params) => <div>{params.row.id}</div> }`.',
            'For more details, see https://mui.com/x/react-data-grid/list-view/',
        ].join('\n'));
    });
});
