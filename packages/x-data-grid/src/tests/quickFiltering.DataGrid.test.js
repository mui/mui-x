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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Quick filter', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        disableVirtualization: true,
        rows: [
            {
                id: 0,
                brand: 'Nike',
            },
            {
                id: 1,
                brand: 'Adidas',
            },
            {
                id: 2,
                brand: 'Puma',
            },
        ],
        columns: [{ field: 'brand' }],
    };
    function TestCase(props) {
        var _a;
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} showToolbar disableColumnSelector disableDensitySelector disableColumnFilter {...props} slotProps={__assign(__assign({}, props === null || props === void 0 ? void 0 : props.slotProps), { toolbar: __assign({ showQuickFilter: true }, (_a = props === null || props === void 0 ? void 0 : props.slotProps) === null || _a === void 0 ? void 0 : _a.toolbar) })}/>
      </div>);
    }
    describe('component', function () {
        it('should apply filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'a')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to customize input splitting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onFilterModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onFilterModelChange = (0, sinon_1.spy)();
                        user = render(<TestCase onFilterModelChange={onFilterModelChange} slotProps={{
                                toolbar: {
                                    quickFilterProps: {
                                        quickFilterParser: function (searchInput) {
                                            return searchInput.split(',').map(function (value) { return value.trim(); });
                                        },
                                    },
                                },
                            }}/>).user;
                        expect(onFilterModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adid, nik')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(onFilterModelChange.lastCall.firstArg).to.deep.equal({
                                    items: [],
                                    logicOperator: 'and',
                                    quickFilterValues: ['adid', 'nik'],
                                    quickFilterLogicOperator: 'and',
                                });
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should no prettify user input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adidas   nike')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('adidas   nike');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update input when the state is modified', function () {
            var setProps = render(<TestCase />).setProps;
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
            setProps({
                filterModel: {
                    items: [],
                    quickFilterValues: ['adidas', 'nike'],
                },
            });
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('adidas nike');
            setProps({
                filterModel: {
                    items: [],
                    quickFilterValues: [],
                },
            });
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
        });
        it('should allow to customize input formatting', function () {
            var setProps = render(<TestCase slotProps={{
                    toolbar: {
                        quickFilterProps: {
                            quickFilterFormatter: function (quickFilterValues) { return quickFilterValues.join(', '); },
                        },
                    },
                }}/>).setProps;
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
            setProps({
                filterModel: {
                    items: [],
                    quickFilterValues: ['adidas', 'nike'],
                },
            });
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('adidas, nike');
        });
        it('should be collapsed by default if there is no value', function () {
            render(<TestCase />);
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
            expect(internal_test_utils_1.screen.getByRole('searchbox').tabIndex).to.equal(-1);
            expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('false');
        });
        it('should be expanded by default if there is a value', function () {
            render(<TestCase filterModel={{ items: [], quickFilterValues: ['adidas'] }}/>);
            expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('adidas');
            expect(internal_test_utils_1.screen.getByRole('searchbox').tabIndex).to.equal(0);
            expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('true');
        });
        it('should expand when the trigger is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('true');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should expand when the input changes value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adidas')];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('true');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should collapse when the escape key is pressed with no value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('true');
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('false');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear the input when the escape key is pressed with a value and not collapse the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adidas')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }).getAttribute('aria-expanded')).to.equal('true');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear the value when the clear button is clicked and focus to `the input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase filterModel={{ items: [], quickFilterValues: ['adidas'] }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Clear' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('searchbox').value).to.equal('');
                        expect(internal_test_utils_1.screen.getByRole('searchbox')).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus the input when the trigger is clicked and return focus to the trigger when collapsed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.getByRole('searchbox')).toHaveFocus();
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Search' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('quick filter logic', function () {
        it('should return rows that match all values by default', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adid')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), ' nik')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return rows that match some values if quickFilterLogicOperator="or"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase initialState={{
                                filter: { filterModel: { items: [], quickFilterLogicOperator: x_data_grid_1.GridLogicOperator.Or } },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Search' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), 'adid')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), ' nik')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas']);
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore hidden columns by default', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase columns={[{ field: 'id' }, { field: 'brand' }]} initialState={{
                                columns: { columnVisibilityModel: { id: false } },
                                filter: { filterModel: { items: [] } },
                            }}/>).user;
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '1')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '[Backspace]2')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should search hidden columns when quickFilterExcludeHiddenColumns=false', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase columns={[{ field: 'id' }, { field: 'brand' }]} initialState={{
                                columns: { columnVisibilityModel: { id: false } },
                                filter: { filterModel: { items: [], quickFilterExcludeHiddenColumns: false } },
                            }}/>).user;
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '1')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '[Backspace]2')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should ignore hidden columns when quickFilterExcludeHiddenColumns=true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase columns={[{ field: 'id' }, { field: 'brand' }]} initialState={{
                                columns: { columnVisibilityModel: { id: false } },
                                filter: { filterModel: { items: [], quickFilterExcludeHiddenColumns: true } },
                            }}/>).user;
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '1')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('searchbox'), '[Backspace]2')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply filters on quickFilterExcludeHiddenColumns value change', function () {
            var setProps = render(<TestCase columns={[{ field: 'id' }, { field: 'brand' }]} columnVisibilityModel={{ brand: false }} filterModel={{
                    items: [],
                    quickFilterValues: ['adid'],
                    quickFilterExcludeHiddenColumns: false,
                }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            setProps({
                filterModel: {
                    items: [],
                    quickFilterValues: ['adid'],
                    quickFilterExcludeHiddenColumns: true,
                },
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
        });
        it('should apply filters on column visibility change when quickFilterExcludeHiddenColumns=true', function () {
            var getApplyQuickFilterFnSpy = (0, sinon_1.spy)(x_data_grid_1.getGridStringQuickFilterFn);
            var setProps = render(<TestCase columns={[
                    {
                        field: 'id',
                        getApplyQuickFilterFn: getApplyQuickFilterFnSpy,
                    },
                    { field: 'brand' },
                ]} initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterValues: ['adid'],
                            quickFilterExcludeHiddenColumns: true,
                        },
                    },
                }}/>).setProps;
            // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
            var initialCallCount = internal_test_utils_1.reactMajor >= 19 ? 1 : 2;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);
            setProps({ columnVisibilityModel: { brand: false } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount + 1);
            setProps({ columnVisibilityModel: { brand: true } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount + 2);
        });
        it('should not apply filters on column visibility change when quickFilterExcludeHiddenColumns=true but no quick filter values', function () {
            var getApplyQuickFilterFnSpy = (0, sinon_1.spy)(x_data_grid_1.getGridStringQuickFilterFn);
            var setProps = render(<TestCase columns={[
                    { field: 'id', getApplyQuickFilterFn: getApplyQuickFilterFnSpy },
                    { field: 'brand' },
                ]} initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterExcludeHiddenColumns: true,
                        },
                    },
                }}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);
            setProps({ columnVisibilityModel: { brand: false } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);
            setProps({ columnVisibilityModel: { brand: true } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(0);
        });
        it('should not apply filters on column visibility change when quickFilterExcludeHiddenColumns=false', function () {
            var getApplyQuickFilterFnSpy = (0, sinon_1.spy)(x_data_grid_1.getGridStringQuickFilterFn);
            var setProps = render(<TestCase columns={[
                    { field: 'id', getApplyQuickFilterFn: getApplyQuickFilterFnSpy },
                    { field: 'brand' },
                ]} initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterValues: ['adid'],
                            quickFilterExcludeHiddenColumns: false,
                        },
                    },
                }}/>).setProps;
            // Because of https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
            var initialCallCount = internal_test_utils_1.reactMajor >= 19 ? 1 : 2;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);
            setProps({ columnVisibilityModel: { brand: false } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);
            setProps({ columnVisibilityModel: { brand: true } });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['1']);
            expect(getApplyQuickFilterFnSpy.callCount).to.equal(initialCallCount);
        });
    });
    describe('column type: string', function () {
        var getRows = function (_a) {
            var quickFilterValues = _a.quickFilterValues;
            var unmount = render(<TestCase filterModel={{
                    items: [],
                    quickFilterValues: quickFilterValues,
                }} rows={[
                    { id: 0, country: undefined, phone: '5511111111' },
                    { id: 1, country: null, phone: '5522222222' },
                    { id: 2, country: '', phone: '5533333333' },
                    { id: 3, country: 'France (fr)', phone: '5544444444' },
                    { id: 4, country: 'Germany', phone: '5555555555' },
                    { id: 5, country: 8, phone: '5566666666' },
                    { id: 6, country: 9, phone: '5577777777' },
                ]} columns={[
                    {
                        field: 'country',
                        type: 'string',
                    },
                    {
                        field: 'phone',
                        type: 'string',
                        valueFormatter: function (value) { return "+".concat(value.slice(0, 2), " ").concat(value.slice(2)); },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = ['', '', '', 'France (fr)', 'Germany', '8', '9'];
        it('default operator should behave like "contains"', function () {
            expect(getRows({ quickFilterValues: ['Fra'] })).to.deep.equal(['France (fr)']);
            // Case-insensitive
            expect(getRows({ quickFilterValues: ['fra'] })).to.deep.equal(['France (fr)']);
            // Number casting
            expect(getRows({ quickFilterValues: ['8'] })).to.deep.equal(['8']);
            expect(getRows({ quickFilterValues: ['9'] })).to.deep.equal(['9']);
            // Empty values
            expect(getRows({ quickFilterValues: [undefined] })).to.deep.equal(ALL_ROWS);
            expect(getRows({ quickFilterValues: [''] })).to.deep.equal(ALL_ROWS);
            // Value with regexp special literal
            expect(getRows({ quickFilterValues: ['[-[]{}()*+?.,\\^$|#s]'] })).to.deep.equal([]);
            expect(getRows({ quickFilterValues: ['(fr)'] })).to.deep.equal(['France (fr)']);
        });
        it('should filter considering the formatted value when a valueFormatter is used', function () {
            expect(getRows({ quickFilterValues: ['+55 44444444'] })).to.deep.equal(['France (fr)']);
            expect(getRows({ quickFilterValues: ['5544444444'] })).to.deep.equal([]);
        });
        describe('ignoreDiacritics', function () {
            function DiacriticsTestCase(_a) {
                var quickFilterValues = _a.quickFilterValues, props = __rest(_a, ["quickFilterValues"]);
                return (<TestCase {...props} filterModel={{
                        items: [],
                        quickFilterValues: quickFilterValues,
                    }} rows={[{ id: 0, label: 'Apă' }]} columns={[{ field: 'label', type: 'string' }]}/>);
            }
            it('should not ignore diacritics by default', function () {
                var unmount = render(<DiacriticsTestCase quickFilterValues={['apa']}/>).unmount;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                unmount();
                var unmount2 = render(<DiacriticsTestCase quickFilterValues={['apă']}/>).unmount;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                unmount2();
            });
            it('should ignore diacritics when `ignoreDiacritics` is enabled', function () {
                var unmount = render(<DiacriticsTestCase quickFilterValues={['apa']} ignoreDiacritics/>).unmount;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                unmount();
                var unmount2 = render(<DiacriticsTestCase quickFilterValues={['apă']} ignoreDiacritics/>).unmount;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apă']);
                unmount2();
            });
        });
    });
    describe('column type: number', function () {
        var getRows = function (_a) {
            var quickFilterValues = _a.quickFilterValues;
            var unmount = render(<TestCase filterModel={{
                    items: [],
                    quickFilterValues: quickFilterValues,
                }} rows={[
                    { id: 0, year: undefined },
                    { id: 1, year: null },
                    { id: 2, year: '' },
                    { id: 3, year: 0 },
                    {
                        id: 4,
                        year: 1954,
                    },
                    {
                        id: 5,
                        year: 1974,
                    },
                    {
                        id: 6,
                        year: 1984,
                    },
                ]} columns={[
                    {
                        field: 'year',
                        type: 'number',
                        // Avoid the localization of the number to simplify the checks
                        valueFormatter: function (value) { return value; },
                    },
                ]}/>).unmount;
            var values = (0, helperFn_1.getColumnValues)(0);
            unmount();
            return values;
        };
        var ALL_ROWS = ['', '', '', '0', '1954', '1974', '1984'];
        it('default operator should behave like "="', function () {
            expect(getRows({ quickFilterValues: ['1974'] })).to.deep.equal(['1974']);
            expect(getRows({ quickFilterValues: ['0'] })).to.deep.equal(['', '0']);
            expect(getRows({ quickFilterValues: [undefined] })).to.deep.equal(ALL_ROWS);
            expect(getRows({ quickFilterValues: [''] })).to.deep.equal(ALL_ROWS);
        });
    });
    describe('column type: singleSelect', function () {
        var getRows = function (_a) {
            var quickFilterValues = _a.quickFilterValues;
            var unmount = render(<TestCase filterModel={{
                    items: [],
                    quickFilterValues: quickFilterValues,
                }} rows={[
                    {
                        id: 0,
                        country: undefined,
                        year: undefined,
                    },
                    {
                        id: 1,
                        country: null,
                        year: null,
                    },
                    {
                        id: 2,
                        country: 'United States',
                        year: 1974,
                    },
                    {
                        id: 3,
                        country: 'Germany',
                        year: 1984,
                    },
                ]} columns={[
                    {
                        field: 'country',
                        type: 'singleSelect',
                        valueOptions: ['United States', 'Germany', 'France'],
                    },
                    {
                        field: 'year',
                        type: 'singleSelect',
                        valueOptions: [
                            { label: 'Year 1974', value: 1974 },
                            { label: 'Year 1984', value: 1984 },
                        ],
                    },
                ]}/>).unmount;
            var values = {
                country: (0, helperFn_1.getColumnValues)(0),
                year: (0, helperFn_1.getColumnValues)(1),
            };
            unmount();
            return values;
        };
        var ALL_ROWS_COUNTRY = ['', '', 'United States', 'Germany'];
        var ALL_ROWS_YEAR = ['', '', 'Year 1974', 'Year 1984'];
        it('should filter with operator "contains"', function () {
            // With simple options
            expect(getRows({ quickFilterValues: ['germa'] }).country).to.deep.equal(['Germany']);
            expect(getRows({ quickFilterValues: [''] }).country).to.deep.equal(ALL_ROWS_COUNTRY);
            expect(getRows({ quickFilterValues: ['erman'] }).country).to.deep.equal(['Germany']);
            // With object options
            expect(getRows({ quickFilterValues: ['1974'] }).year).to.deep.equal(['Year 1974']);
            expect(getRows({ quickFilterValues: ['year'] }).year).to.deep.equal([
                'Year 1974',
                'Year 1984',
            ]);
            expect(getRows({ quickFilterValues: ['97'] }).year).to.deep.equal(['Year 1974']);
            expect(getRows({ quickFilterValues: [undefined] }).year).to.deep.equal(ALL_ROWS_YEAR);
            expect(getRows({ quickFilterValues: [''] }).year).to.deep.equal(ALL_ROWS_YEAR);
        });
    });
    // https://github.com/mui/mui-x/issues/6783
    it('should not override user input when typing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var debounceMs, user, searchBox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debounceMs = 50;
                    user = render(<TestCase slotProps={{
                            toolbar: {
                                quickFilterProps: { debounceMs: debounceMs },
                            },
                        }}/>).user;
                    searchBox = internal_test_utils_1.screen.getByRole('searchbox');
                    expect(searchBox.value).to.equal('');
                    return [4 /*yield*/, user.type(searchBox, "a")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(debounceMs - 2); })];
                case 2:
                    _a.sent();
                    expect(searchBox.value).to.equal('a');
                    return [4 /*yield*/, user.type(searchBox, "b")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(10); })];
                case 4:
                    _a.sent();
                    expect(searchBox.value).to.equal('ab');
                    return [4 /*yield*/, user.type(searchBox, "c")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(debounceMs * 2); })];
                case 6:
                    _a.sent();
                    expect(searchBox.value).to.equal('abc');
                    return [2 /*return*/];
            }
        });
    }); });
    // https://github.com/mui/mui-x/issues/9666
    it('should not fail when the data changes', function () {
        var getApplyQuickFilterFn = function (value) {
            if (!value) {
                return null;
            }
            return function (cellValue) {
                return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
            };
        };
        var setProps = render(<TestCase columns={[
                {
                    field: 'brand',
                    getApplyQuickFilterFn: getApplyQuickFilterFn,
                },
            ]} filterModel={{
                items: [],
                quickFilterValues: ['adid'],
            }}/>).setProps;
        setProps({
            rows: [],
        });
    });
});
