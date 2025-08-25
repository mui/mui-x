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
exports.testShortcuts = void 0;
var React = require("react");
var sinon_1 = require("sinon");
var pickers_1 = require("test/utils/pickers");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var testShortcuts = function (ElementToTest, options) {
    var componentFamily = options.componentFamily, render = options.render, renderWithProps = options.renderWithProps, values = options.values, emptyValue = options.emptyValue, setNewValue = options.setNewValue, pickerParams = __rest(options, ["componentFamily", "render", "renderWithProps", "values", "emptyValue", "setNewValue"]);
    describe.skipIf(componentFamily !== 'picker')('Picker shortcuts', function () {
        it('should call onClose, onChange and onAccept when picking a shortcut without explicit changeImportance', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, shortcut;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={values[0]} open closeOnSelect slotProps={{
                                shortcuts: {
                                    items: [
                                        {
                                            label: 'Test shortcut',
                                            getValue: function () { return values[1]; },
                                        },
                                    ],
                                },
                            }}/>);
                        return [4 /*yield*/, internal_test_utils_1.screen.findByRole('button', { name: 'Test shortcut' })];
                    case 1:
                        shortcut = _a.sent();
                        internal_test_utils_1.fireEvent.click(shortcut);
                        expect(onChange.callCount).to.equal(1);
                        (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onChange, values[1]);
                        expect(onAccept.callCount).to.equal(1);
                        (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onAccept, values[1]);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose and onChange when picking a shortcut with changeImportance="accept"', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={values[0]} open closeOnSelect slotProps={{
                    shortcuts: {
                        items: [
                            {
                                label: 'Test shortcut',
                                getValue: function () { return values[1]; },
                            },
                        ],
                        changeImportance: 'accept',
                    },
                }}/>);
            var shortcut = internal_test_utils_1.screen.getByRole('button', { name: 'Test shortcut' });
            internal_test_utils_1.fireEvent.click(shortcut);
            expect(onChange.callCount).to.equal(1);
            (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onChange, values[1]);
            expect(onAccept.callCount).to.equal(1);
            (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onAccept, values[1]);
            expect(onClose.callCount).to.equal(1);
        });
        it('should call onClose and onChange when picking a shortcut with changeImportance="set"', function () {
            var onChange = (0, sinon_1.spy)();
            var onAccept = (0, sinon_1.spy)();
            var onClose = (0, sinon_1.spy)();
            render(<ElementToTest onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={values[0]} open closeOnSelect slotProps={{
                    shortcuts: {
                        items: [
                            {
                                label: 'Test shortcut',
                                getValue: function () { return values[1]; },
                            },
                        ],
                        changeImportance: 'set',
                    },
                }}/>);
            var shortcut = internal_test_utils_1.screen.getByRole('button', { name: 'Test shortcut' });
            internal_test_utils_1.fireEvent.click(shortcut);
            expect(onChange.callCount).to.equal(1);
            (0, pickers_1.expectPickerChangeHandlerValue)(pickerParams.type, onChange, values[1]);
            expect(onAccept.callCount).to.equal(0);
            expect(onClose.callCount).to.equal(0);
        });
    });
};
exports.testShortcuts = testShortcuts;
