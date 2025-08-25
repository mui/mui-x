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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var x_data_grid_1 = require("@mui/x-data-grid");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
function setColumnValue(columnValue) {
    internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Columns'), {
        target: { value: columnValue },
    });
}
function setOperatorValue(operator) {
    internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Operator'), {
        target: { value: operator },
    });
}
function deleteFilterForm() {
    internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Delete' }));
}
function CustomInputValue(props) {
    var item = props.item, applyValue = props.applyValue;
    var handleFilterChange = function (event) {
        applyValue(__assign(__assign({}, item), { value: event.target.value }));
    };
    return (<input name="custom-filter-operator" placeholder="Filter value" value={item.value} onChange={handleFilterChange} data-testid="customInput"/>);
}
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid /> - Filter panel', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
        disableVirtualization: true,
        rows: [
            {
                id: 0,
                brand: 'Nike',
                slogan: 'just do it',
                isPublished: false,
                country: 'United States',
                status: 0,
            },
            {
                id: 1,
                brand: 'Adidas',
                slogan: 'is all in',
                isPublished: true,
                country: 'Germany',
                status: 0,
            },
            {
                id: 2,
                brand: 'Puma',
                slogan: 'Forever Faster',
                isPublished: true,
                country: 'Germany',
                status: 2,
            },
        ],
        columns: [
            { field: 'brand' },
            {
                field: 'slogan',
                filterOperators: [
                    {
                        label: 'From',
                        value: 'from',
                        getApplyFilterFn: function () {
                            return function () { return false; };
                        },
                        InputComponent: CustomInputValue,
                    },
                    {
                        value: 'equals',
                        getApplyFilterFn: function (filterItem) {
                            if (!filterItem.value) {
                                return null;
                            }
                            var collator = new Intl.Collator(undefined, {
                                sensitivity: 'base',
                                usage: 'search',
                            });
                            return function (value) {
                                return collator.compare(filterItem.value, (value && value.toString()) || '') === 0;
                            };
                        },
                        InputComponent: x_data_grid_1.GridFilterInputValue,
                    },
                ],
            },
            { field: 'isPublished', type: 'boolean' },
            {
                field: 'country',
                type: 'singleSelect',
                valueOptions: ['United States', 'Germany', 'France'],
            },
            {
                field: 'status',
                type: 'singleSelect',
                valueOptions: [
                    { value: 0, label: 'Payment Pending' },
                    { value: 1, label: 'Shipped' },
                    { value: 2, label: 'Delivered' },
                ],
            },
        ],
    };
    function TestCase(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} {...props}/>
      </div>);
    }
    it('should show an empty string as the default filter input value', function () {
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }} filterModel={{ items: [{ field: 'brand', operator: 'contains' }] }}/>);
        expect(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }).value).to.equal('');
    });
    it('should keep filter operator and value if available', function () {
        render(<TestCase initialState={{
                filter: {
                    filterModel: {
                        items: [
                            {
                                field: 'brand',
                                value: 'Puma',
                                operator: 'equals',
                            },
                        ],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('equals');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
        setColumnValue('slogan');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('equals');
        expect(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Puma');
    });
    it('should reset value if operator is not available for the new column', function () {
        render(<TestCase initialState={{
                filter: {
                    filterModel: {
                        items: [
                            {
                                field: 'brand',
                                operator: 'contains',
                                value: 'Pu',
                            },
                        ],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('contains');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
        setColumnValue('slogan');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('from');
        expect(internal_test_utils_1.screen.getByTestId('customInput').value).to.equal('');
    });
    it('should reset value if the new operator has no input component', function () {
        var onFilterModelChange = (0, sinon_1.spy)();
        render(<TestCase initialState={{
                filter: {
                    filterModel: {
                        items: [
                            {
                                field: 'brand',
                                operator: 'contains',
                                value: 'Pu',
                            },
                        ],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }} onFilterModelChange={onFilterModelChange}/>);
        expect(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }).value).to.equal('Pu');
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('contains');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
        expect(onFilterModelChange.callCount).to.equal(0);
        setOperatorValue('isEmpty');
        expect(onFilterModelChange.callCount).to.equal(1);
        expect(onFilterModelChange.lastCall.args[0].items[0].value).to.equal(undefined);
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('isEmpty');
    });
    it('should reset filter value if not available in the new valueOptions', function () {
        render(<TestCase rows={[
                { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
                { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
                { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
            ]} columns={[
                { field: 'reference' },
                { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
                {
                    field: 'destination',
                    type: 'singleSelect',
                    valueOptions: ['Italy', 'Germany', 'UK'],
                },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'destination', operator: 'is', value: 'UK' }],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_2']);
        setColumnValue('origin');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });
    it('should keep the value if available in the new valueOptions', function () {
        var IT = { value: 'IT', label: 'Italy' };
        var GE = { value: 'GE', label: 'Germany' };
        render(<TestCase rows={[
                { id: 1, reference: 'REF_1', origin: 'IT', destination: 'GE' },
                { id: 2, reference: 'REF_2', origin: 'GE', destination: 'UK' },
                { id: 3, reference: 'REF_3', origin: 'GE', destination: 'IT' },
            ]} columns={[
                { field: 'reference' },
                { field: 'origin', type: 'singleSelect', valueOptions: [IT, GE] },
                { field: 'destination', type: 'singleSelect', valueOptions: ['IT', 'GE', 'UK'] },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'destination', operator: 'is', value: 'GE' }],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_1']);
        setColumnValue('origin');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_2', 'REF_3']);
    });
    it('should reset filter value if not available in the new valueOptions with operator "isAnyOf"', function () {
        render(<TestCase rows={[
                { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
                { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
                { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
            ]} columns={[
                { field: 'reference' },
                { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
                {
                    field: 'destination',
                    type: 'singleSelect',
                    valueOptions: ['Italy', 'Germany', 'UK'],
                },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'destination', operator: 'isAnyOf', value: ['UK'] }],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_2']);
        setColumnValue('origin');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });
    it('should keep the value if available in the new valueOptions with operator "isAnyOf"', function () {
        var IT = { value: 'IT', label: 'Italy' };
        var GE = { value: 'GE', label: 'Germany' };
        render(<TestCase rows={[
                { id: 1, reference: 'REF_1', origin: 'IT', destination: 'GE' },
                { id: 2, reference: 'REF_2', origin: 'GE', destination: 'UK' },
                { id: 3, reference: 'REF_3', origin: 'GE', destination: 'IT' },
            ]} columns={[
                { field: 'reference' },
                { field: 'origin', type: 'singleSelect', valueOptions: [IT, GE] },
                { field: 'destination', type: 'singleSelect', valueOptions: ['IT', 'GE', 'UK'] },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'destination', operator: 'isAnyOf', value: ['GE'] }],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_1']);
        setColumnValue('origin');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_2', 'REF_3']);
    });
    it('should reset filter value if moving from multiple to single value operator', function () {
        render(<TestCase rows={[
                { id: 1, reference: 'REF_1', origin: 'Italy', destination: 'Germany' },
                { id: 2, reference: 'REF_2', origin: 'Germany', destination: 'UK' },
                { id: 3, reference: 'REF_3', origin: 'Germany', destination: 'Italy' },
            ]} columns={[
                { field: 'reference' },
                { field: 'origin', type: 'singleSelect', valueOptions: ['Italy', 'Germany'] },
                {
                    field: 'destination',
                    type: 'singleSelect',
                    valueOptions: ['Italy', 'Germany', 'UK'],
                },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'destination', operator: 'isAnyOf', value: ['UK'] }],
                    },
                },
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_2']);
        setOperatorValue('is');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['REF_1', 'REF_2', 'REF_3']);
    });
    it('should close filter panel when removing the last filter', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onFilterModelChange;
        return __generator(this, function (_a) {
            onFilterModelChange = (0, sinon_1.spy)();
            render(<TestCase rows={[
                    { id: 1, val: 'VAL_1' },
                    { id: 2, val: 'VAL_2' },
                    { id: 3, val: 'VAL_3' },
                ]} columns={[{ field: 'id' }, { field: 'val' }]} initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'val', operator: 'contains', value: 'UK' }],
                        },
                    },
                    preferencePanel: {
                        open: true,
                        openedPanelValue: x_data_grid_1.GridPreferencePanelsValue.filters,
                    },
                }} onFilterModelChange={onFilterModelChange}/>);
            expect(internal_test_utils_1.screen.queryAllByRole('tooltip').length).to.deep.equal(1);
            deleteFilterForm();
            expect(internal_test_utils_1.screen.queryAllByRole('tooltip').length).to.deep.equal(0);
            return [2 /*return*/];
        });
    }); });
    // See https://github.com/mui/mui-x/issues/5402
    it('should not remove `isEmpty` filter from model when filter panel is opened through column menu', function () {
        render(<TestCase initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'brand', operator: 'isEmpty' }],
                    },
                },
            }}/>);
        // open filter panel
        var columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
        var menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
        internal_test_utils_1.fireEvent.click(menuIconButton);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Filter' }));
        // check that the filter is still in the model
        expect((0, helperFn_1.getSelectByName)('Columns').value).to.equal('brand');
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('isEmpty');
    });
    // See https://github.com/mui/mui-x/issues/7901#issuecomment-1427058922
    it('should remove `isAnyOf` filter from the model when filter panel is opened through column menu', function () {
        render(<TestCase initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'country', operator: 'isAnyOf', value: [] }],
                    },
                },
            }}/>);
        // open filter panel
        var columnCell = (0, helperFn_1.getColumnHeaderCell)(3);
        var menuIconButton = columnCell.querySelector('button[aria-label="country column menu"]');
        internal_test_utils_1.fireEvent.click(menuIconButton);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Filter' }));
        // check that the filter is changed to default one (`is`)
        expect((0, helperFn_1.getSelectByName)('Columns').value).to.equal('country');
        expect((0, helperFn_1.getSelectByName)('Operator').value).to.equal('is');
    });
});
