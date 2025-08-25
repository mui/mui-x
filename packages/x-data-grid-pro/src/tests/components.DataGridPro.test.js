"use strict";
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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var helperFn_1 = require("test/utils/helperFn");
describe('<DataGridPro/> - Components', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var data = (0, x_data_grid_generator_1.useBasicDemoData)(100, 1);
        return (<div style={{ width: 500, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...data} disableVirtualization {...props}/>
      </div>);
    }
    describe('footer', function () {
        it('should hide the row count if `hideFooterRowCount` prop is set', function () {
            render(<TestCase hideFooterRowCount/>);
            expect(document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.rowCount))).to.equal(null);
        });
        it('should throw a console error if hideFooterRowCount is used with pagination', function () {
            expect(function () { return render(<TestCase hideFooterRowCount pagination/>); }).toErrorDev('MUI X: The `hideFooterRowCount` prop has no effect when the pagination is enabled.');
        });
    });
    describe('components', function () {
        [
            ['onClick', 'cellClick'],
            ['onDoubleClick', 'cellDoubleClick'],
            ['onMouseDown', 'cellMouseDown'],
            ['onMouseUp', 'cellMouseUp'],
            ['onDragEnter', 'cellDragEnter'],
            ['onDragOver', 'cellDragOver'],
        ].forEach(function (_a) {
            var prop = _a[0], event = _a[1];
            it("should still publish the '".concat(event, "' event when overriding the '").concat(prop, "' prop in slots.cell"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var propHandler, eventHandler, eventToFire, cell;
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            propHandler = (0, sinon_1.spy)();
                            eventHandler = (0, sinon_1.spy)();
                            render(<TestCase slotProps={{ cell: (_a = {}, _a[prop] = propHandler, _a) }}/>);
                            (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent(event, eventHandler);
                            expect(propHandler.callCount).to.equal(0);
                            expect(eventHandler.callCount).to.equal(0);
                            eventToFire = prop.replace(/^on([A-Z])/, function (match) {
                                return match.slice(2).toLowerCase();
                            });
                            cell = (0, helperFn_1.getCell)(0, 0);
                            if (event !== 'cellMouseUp') {
                                internal_test_utils_1.fireEvent.mouseUp(cell);
                            }
                            internal_test_utils_1.fireEvent[eventToFire](cell);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(propHandler.callCount).to.equal(1);
                                })];
                        case 1:
                            _c.sent();
                            expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
                            expect(eventHandler.callCount).to.equal(1);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("should still publish the 'cellKeyDown' event when overriding the 'onKeyDown' prop in slots.cell", function () { return __awaiter(void 0, void 0, void 0, function () {
            var propHandler, eventHandler, user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        propHandler = (0, sinon_1.spy)();
                        eventHandler = (0, sinon_1.spy)();
                        user = render(<TestCase slotProps={{ cell: { onKeyDown: propHandler } }}/>).user;
                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('cellKeyDown', eventHandler);
                        expect(propHandler.callCount).to.equal(0);
                        expect(eventHandler.callCount).to.equal(0);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.keyboard('a')];
                    case 2:
                        _b.sent();
                        expect(propHandler.callCount).to.equal(1);
                        expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
                        expect(eventHandler.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        [
            ['onClick', 'rowClick'],
            ['onDoubleClick', 'rowDoubleClick'],
        ].forEach(function (_a) {
            var prop = _a[0], event = _a[1];
            it("should still publish the '".concat(event, "' event when overriding the '").concat(prop, "' prop in slots.row"), function () {
                var _a;
                var _b;
                var propHandler = (0, sinon_1.spy)();
                var eventHandler = (0, sinon_1.spy)();
                render(<TestCase slotProps={{ row: (_a = {}, _a[prop] = propHandler, _a) }}/>);
                (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.subscribeEvent(event, eventHandler);
                expect(propHandler.callCount).to.equal(0);
                expect(eventHandler.callCount).to.equal(0);
                var eventToFire = prop.replace(/^on([A-Z])/, function (match) {
                    return match.slice(2).toLowerCase();
                }); // for example onDoubleClick -> doubleClick
                internal_test_utils_1.fireEvent[eventToFire]((0, helperFn_1.getRow)(0));
                expect(propHandler.callCount).to.equal(1);
                expect(propHandler.lastCall.args[0]).not.to.equal(undefined);
                expect(eventHandler.callCount).to.equal(1);
            });
        });
    });
});
