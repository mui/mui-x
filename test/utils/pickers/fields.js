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
exports.getFieldSectionsContainer = exports.getFieldInputRoot = exports.getAllFieldInputRoot = exports.setValueOnFieldInput = exports.getCleanedSelectedContent = exports.cleanText = exports.buildFieldInteractions = exports.getTextbox = void 0;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var PickersSectionList_1 = require("@mui/x-date-pickers/PickersSectionList");
var PickersTextField_1 = require("@mui/x-date-pickers/PickersTextField");
var fireUserEvent_1 = require("../fireUserEvent");
var assertions_1 = require("./assertions");
var getTextbox = function () { return internal_test_utils_1.screen.getByRole('textbox'); };
exports.getTextbox = getTextbox;
var RTL_THEME = (0, styles_1.createTheme)({
    direction: 'rtl',
});
var buildFieldInteractions = function (_a) {
    var render = _a.render, Component = _a.Component;
    var renderWithProps = function (props, _a) {
        var _b = _a === void 0 ? {} : _a, hook = _b.hook, _c = _b.componentFamily, componentFamily = _c === void 0 ? 'field' : _c, _d = _b.direction, direction = _d === void 0 ? 'ltr' : _d;
        var fieldRef = { current: null };
        function WrappedComponent(propsFromRender) {
            var _a, _b;
            fieldRef = React.useRef(null);
            var hookResult = hook === null || hook === void 0 ? void 0 : hook(propsFromRender);
            var allProps = __assign(__assign({}, propsFromRender), hookResult);
            if (componentFamily === 'field') {
                allProps.unstableFieldRef = fieldRef;
            }
            else {
                if (!allProps.slotProps) {
                    allProps.slotProps = {};
                }
                if (!allProps.slotProps.field) {
                    allProps.slotProps.field = {};
                }
                var hasMultipleInputs = 
                // @ts-ignore
                Component.render.name.includes('Range') &&
                    ((_b = (_a = allProps.slots) === null || _a === void 0 ? void 0 : _a.field) === null || _b === void 0 ? void 0 : _b.fieldType) === 'multi-input';
                if (hasMultipleInputs) {
                    allProps.slotProps.field.unstableStartFieldRef = fieldRef;
                }
                else {
                    allProps.slotProps.field.unstableFieldRef = fieldRef;
                }
            }
            if (direction === 'rtl') {
                return (<styles_1.ThemeProvider theme={RTL_THEME}>
            <Component {...allProps}/>
          </styles_1.ThemeProvider>);
            }
            return <Component {...allProps}/>;
        }
        var result = render(<WrappedComponent {...props}/>);
        var getSectionsContainer = function () {
            if (!props.enableAccessibleFieldDOMStructure) {
                throw new Error('Cannot use fake input with v6 TextField');
            }
            return document.querySelector(".".concat(PickersSectionList_1.pickersSectionListClasses.root));
        };
        var getHiddenInput = function () {
            return document.querySelector('input');
        };
        var getSection = function (sectionIndex) {
            return getSectionsContainer().querySelector(".".concat(PickersSectionList_1.pickersSectionListClasses.section, "[data-sectionindex=\"").concat(sectionIndex, "\"] .").concat(PickersSectionList_1.pickersSectionListClasses.sectionContent));
        };
        var selectSection = function (selectedSection, index) {
            if (index === void 0) { index = 'first'; }
            var sectionIndexToSelect;
            if (selectedSection === undefined) {
                sectionIndexToSelect = 0;
            }
            else {
                var sections = fieldRef.current.getSections();
                sectionIndexToSelect = sections[index === 'first' ? 'findIndex' : 'findLastIndex'](function (section) { return section.type === selectedSection; });
            }
            (0, internal_test_utils_1.act)(function () {
                fieldRef.current.setSelectedSections(sectionIndexToSelect);
                if (!props.enableAccessibleFieldDOMStructure) {
                    (0, exports.getTextbox)().focus();
                }
            });
            (0, internal_test_utils_1.act)(function () {
                if (props.enableAccessibleFieldDOMStructure) {
                    getSection(sectionIndexToSelect).focus();
                }
            });
        };
        var selectSectionAsync = function (selectedSection_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(void 0, __spreadArray([selectedSection_1], args_1, true), void 0, function (selectedSection, index) {
                var sectionIndexToSelect, sections;
                if (index === void 0) { index = 'first'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (selectedSection === undefined) {
                                sectionIndexToSelect = 0;
                            }
                            else {
                                sections = fieldRef.current.getSections();
                                sectionIndexToSelect = sections[index === 'first' ? 'findIndex' : 'findLastIndex'](function (section) { return section.type === selectedSection; });
                            }
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        fieldRef.current.setSelectedSections(sectionIndexToSelect);
                                        if (!props.enableAccessibleFieldDOMStructure) {
                                            (0, exports.getTextbox)().focus();
                                        }
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (props.enableAccessibleFieldDOMStructure) {
                                            getSection(sectionIndexToSelect).focus();
                                        }
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        var getActiveSection = function (sectionIndex) {
            var activeElement = document.activeElement;
            if (sectionIndex !== undefined) {
                var activeSectionIndex = activeElement.parentElement.dataset.sectionindex;
                expect(activeSectionIndex).to.equal(sectionIndex.toString(), "The active section should be ".concat(sectionIndex.toString(), " instead of ").concat(activeSectionIndex));
            }
            return activeElement;
        };
        var pressKey = function (sectionIndex, key) {
            if (!props.enableAccessibleFieldDOMStructure) {
                throw new Error('`pressKey` is only available with v7 TextField');
            }
            var target = sectionIndex === null ? getSectionsContainer() : getActiveSection(sectionIndex);
            if ([
                'ArrowUp',
                'ArrowDown',
                'PageUp',
                'PageDown',
                'Home',
                'End',
                'Delete',
                'ArrowLeft',
                'ArrowRight',
            ].includes(key)) {
                fireUserEvent_1.fireUserEvent.keyPress(target, { key: key });
            }
            else {
                internal_test_utils_1.fireEvent.input(target, { target: { textContent: key } });
            }
        };
        return __assign({ selectSection: selectSection, selectSectionAsync: selectSectionAsync, getActiveSection: getActiveSection, getSection: getSection, pressKey: pressKey, getHiddenInput: getHiddenInput, getSectionsContainer: getSectionsContainer }, result);
    };
    var testFieldKeyPress = function (_a) {
        var key = _a.key, expectedValue = _a.expectedValue, selectedSection = _a.selectedSection, props = __rest(_a, ["key", "expectedValue", "selectedSection"]);
        // Test with accessible DOM structure
        var v7Response = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: true }));
        v7Response.selectSection(selectedSection);
        v7Response.pressKey(undefined, key);
        (0, assertions_1.expectFieldValueV7)(v7Response.getSectionsContainer(), expectedValue);
        v7Response.unmount();
        // Test with non-accessible DOM structure
        var v6Response = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: false }));
        v6Response.selectSection(selectedSection);
        var input = (0, exports.getTextbox)();
        fireUserEvent_1.fireUserEvent.keyPress(input, { key: key });
        (0, assertions_1.expectFieldValueV6)(input, expectedValue);
        v6Response.unmount();
    };
    var testFieldChange = function (_a) {
        var keyStrokes = _a.keyStrokes, selectedSection = _a.selectedSection, props = __rest(_a, ["keyStrokes", "selectedSection"]);
        // Test with accessible DOM structure
        var v7Response = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: true }));
        v7Response.selectSection(selectedSection);
        keyStrokes.forEach(function (keyStroke) {
            v7Response.pressKey(undefined, keyStroke.value);
            (0, assertions_1.expectFieldValueV7)(v7Response.getSectionsContainer(), keyStroke.expected, props.shouldRespectLeadingZeros ? 'singleDigit' : undefined);
        });
        v7Response.unmount();
        // Test with non-accessible DOM structure
        var v6Response = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: false }));
        v6Response.selectSection(selectedSection);
        var input = (0, exports.getTextbox)();
        keyStrokes.forEach(function (keyStroke) {
            internal_test_utils_1.fireEvent.change(input, { target: { value: keyStroke.value } });
            (0, assertions_1.expectFieldValueV6)(input, keyStroke.expected, props.shouldRespectLeadingZeros ? 'singleDigit' : undefined);
        });
        v6Response.unmount();
    };
    return { testFieldKeyPress: testFieldKeyPress, testFieldChange: testFieldChange, renderWithProps: renderWithProps };
};
exports.buildFieldInteractions = buildFieldInteractions;
var cleanText = function (text, specialCase) {
    var clean = text.replace(/\u202f/g, ' ');
    clean = text.replace(/\u200b/g, '');
    switch (specialCase) {
        case 'singleDigit':
            return clean.replace(/\u200e/g, '');
        case 'RTL':
            return clean.replace(/\u2066|\u2067|\u2068|\u2069/g, '');
        default:
            return clean;
    }
};
exports.cleanText = cleanText;
var getCleanedSelectedContent = function () {
    var _a, _b, _c, _d, _e;
    // In JSDOM env, document.getSelection() does not work on inputs.
    if (((_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.tagName) === 'INPUT') {
        var input = document.activeElement;
        return (0, exports.cleanText)(input.value.slice((_b = input.selectionStart) !== null && _b !== void 0 ? _b : 0, (_c = input.selectionEnd) !== null && _c !== void 0 ? _c : 0));
    }
    return (0, exports.cleanText)((_e = (_d = document.getSelection()) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '');
};
exports.getCleanedSelectedContent = getCleanedSelectedContent;
var setValueOnFieldInput = function (value, index) {
    if (index === void 0) { index = 0; }
    var hiddenInput = document.querySelectorAll(".".concat(PickersTextField_1.pickersInputBaseClasses.input))[index];
    internal_test_utils_1.fireEvent.change(hiddenInput, { target: { value: value } });
};
exports.setValueOnFieldInput = setValueOnFieldInput;
var getAllFieldInputRoot = function () {
    return document.querySelectorAll(".".concat(PickersTextField_1.pickersInputBaseClasses.root));
};
exports.getAllFieldInputRoot = getAllFieldInputRoot;
var getFieldInputRoot = function (index) {
    if (index === void 0) { index = 0; }
    return (0, exports.getAllFieldInputRoot)()[index];
};
exports.getFieldInputRoot = getFieldInputRoot;
var getFieldSectionsContainer = function (index) {
    if (index === void 0) { index = 0; }
    return document.querySelectorAll(".".concat(PickersSectionList_1.pickersSectionListClasses.root))[index];
};
exports.getFieldSectionsContainer = getFieldSectionsContainer;
