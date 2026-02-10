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
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var vitest_1 = require("vitest");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var d3_interpolate_1 = require("@mui/x-charts-vendor/d3-interpolate");
// It's not publicly exported, so, using a relative import
var useAnimateInternal_1 = require("./useAnimateInternal");
// Wait for the next animation frame
var waitNextFrame = function () {
    return new Promise(function (resolve) {
        requestAnimationFrame(function () { return resolve(); });
    });
};
describe('useAnimate', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function interpolateWidth(lastProps, newProps) {
        var interpolate = (0, d3_interpolate_1.interpolateNumber)(lastProps.width, newProps.width);
        return function (t) { return ({ width: interpolate(t) }); };
    }
    var applyProps = vitest_1.vi.fn(function (element, props) {
        element.setAttribute('width', props.width.toString());
    });
    var lastCallWidth = function () { var _a; return (_a = applyProps.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1].width; };
    var firstCallWidth = function () { var _a; return (_a = applyProps.mock.calls[0]) === null || _a === void 0 ? void 0 : _a[1].width; };
    var callCount = function () { return applyProps.mock.calls.length; };
    afterEach(function () {
        applyProps.mockClear();
    });
    it('starts animating from initial props', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent() {
            var _a = (0, useAnimateInternal_1.useAnimateInternal)({ width: 100 }, { initialProps: { width: 0 }, createInterpolator: interpolateWidth, applyProps: applyProps }), ref = _a[0], props = _a[1];
            // eslint-disable-next-line react-compiler/react-compiler
            providedProps = props;
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var providedProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    providedProps = null;
                    render((0, jsx_runtime_1.jsx)(TestComponent, {}));
                    expect(providedProps).to.deep.equal({ width: 0 });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.be.equal(100);
                        })];
                case 1:
                    _a.sent();
                    expect(callCount()).to.be.greaterThan(0);
                    expect(firstCallWidth()).to.be.lessThan(100);
                    return [2 /*return*/];
            }
        });
    }); });
    it('animates from current props to new props', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width;
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, { createInterpolator: interpolateWidth, applyProps: applyProps })[0];
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rerender = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 100 })).rerender;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.equal(100);
                        })];
                case 1:
                    _a.sent();
                    expect(callCount()).to.be.greaterThan(0);
                    rerender((0, jsx_runtime_1.jsx)(TestComponent, { width: 200 }));
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.equal(200);
                        })];
                case 2:
                    _a.sent();
                    expect(callCount()).to.be.greaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('animates from current state to new props if props change while animating', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width;
            var _b = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, { createInterpolator: interpolateWidth, applyProps: applyProps, initialProps: { width: 1000 } }), ref = _b[0], props = _b[1];
            // eslint-disable-next-line react-compiler/react-compiler
            providedProps = props;
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var providedProps, rerender, lastIncreasingCall;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    providedProps = null;
                    rerender = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 2000 })).rerender;
                    expect(providedProps).to.deep.equal({ width: 1000 });
                    expect(callCount()).to.be.equal(0);
                    return [4 /*yield*/, waitNextFrame()];
                case 1:
                    _a.sent();
                    expect(callCount()).to.be.equal(1);
                    lastIncreasingCall = lastCallWidth();
                    // Should be animating from 1000 to 2000
                    expect(lastCallWidth()).to.be.greaterThan(1000);
                    expect(lastCallWidth()).to.be.lessThan(2000);
                    rerender((0, jsx_runtime_1.jsx)(TestComponent, { width: 0 }));
                    expect(providedProps.width).to.be.greaterThan(1000);
                    expect(providedProps.width).to.be.lessThan(2000);
                    return [4 /*yield*/, waitNextFrame()];
                case 2:
                    _a.sent();
                    expect(lastCallWidth()).to.be.lessThan(lastIncreasingCall);
                    // Until the animation is complete
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.equal(0);
                        })];
                case 3:
                    // Until the animation is complete
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('jumps to end of animation if `skip` becomes true while animating', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width, _b = _a.skipAnimation, skipAnimation = _b === void 0 ? false : _b;
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, {
                createInterpolator: interpolateWidth,
                applyProps: applyProps,
                initialProps: { width: 1000 },
                skip: skipAnimation,
            })[0];
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rerender = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 2000 })).rerender;
                    expect(callCount()).to.be.equal(0);
                    return [4 /*yield*/, waitNextFrame()];
                case 1:
                    _a.sent();
                    expect(callCount()).to.be.equal(1);
                    // Should be animating from 1000 to 2000
                    expect(lastCallWidth()).to.be.greaterThan(1000);
                    expect(lastCallWidth()).to.be.lessThan(2000);
                    rerender((0, jsx_runtime_1.jsx)(TestComponent, { width: 0, skipAnimation: true }));
                    expect(callCount()).to.be.equal(1);
                    return [4 /*yield*/, waitNextFrame()];
                case 2:
                    _a.sent();
                    expect(callCount()).to.be.equal(2);
                    // Should jump to 0 immediately after first call
                    expect(lastCallWidth()).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not start animation if `skip` is true from the beginning', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width;
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, {
                createInterpolator: interpolateWidth,
                applyProps: applyProps,
                initialProps: { width: 0 },
                skip: true,
            })[0];
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(TestComponent, { width: 1000 }));
                    // Wait a frame to ensure the transition is stopped
                    return [4 /*yield*/, waitNextFrame()];
                case 1:
                    // Wait a frame to ensure the transition is stopped
                    _a.sent();
                    expect(callCount()).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('resumes animation if `skip` becomes false after having been true', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width, skip = _a.skip;
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, {
                createInterpolator: interpolateWidth,
                applyProps: applyProps,
                initialProps: { width: 0 },
                skip: skip,
            })[0];
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rerender = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 1000, skip: false })).rerender;
                    expect(callCount()).to.be.equal(0);
                    return [4 /*yield*/, waitNextFrame()];
                case 1:
                    _a.sent();
                    expect(callCount()).to.be.equal(1);
                    expect(lastCallWidth()).to.be.greaterThan(0);
                    expect(lastCallWidth()).to.be.lessThan(1000);
                    rerender((0, jsx_runtime_1.jsx)(TestComponent, { width: 2000, skip: true }));
                    expect(callCount()).to.be.equal(1);
                    // Transition finishes immediately
                    return [4 /*yield*/, waitNextFrame()];
                case 2:
                    // Transition finishes immediately
                    _a.sent();
                    expect(callCount()).to.be.equal(2);
                    expect(lastCallWidth()).to.equal(2000);
                    rerender((0, jsx_runtime_1.jsx)(TestComponent, { width: 1000, skip: false }));
                    expect(callCount()).to.be.equal(2);
                    return [4 /*yield*/, waitNextFrame()];
                case 3:
                    _a.sent();
                    expect(callCount()).to.be.equal(3);
                    expect(lastCallWidth()).to.be.lessThan(2000);
                    expect(lastCallWidth()).to.be.greaterThan(1000);
                    return [2 /*return*/];
            }
        });
    }); });
    it('stops animation when its ref is removed from the DOM', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width;
            var _b = React.useState(true), mountPath = _b[0], setMountPath = _b[1];
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, { createInterpolator: interpolateWidth, applyProps: applyProps, initialProps: { width: 0 } })[0];
            return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [(0, jsx_runtime_1.jsx)("svg", { children: mountPath ? (0, jsx_runtime_1.jsx)("path", { ref: ref }) : null }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                            callsAfterUnmount = callCount();
                            setMountPath(false);
                        }, children: "Unmount Path" })] }));
        }
        var callsAfterUnmount, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    callsAfterUnmount = 0;
                    user = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 1000 })).user;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.be.greaterThan(10);
                        })];
                case 1:
                    _a.sent();
                    expect(lastCallWidth()).to.be.lessThan(1000);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button'))];
                case 2:
                    _a.sent();
                    // Wait a frame to ensure the transition is stopped
                    return [4 /*yield*/, waitNextFrame()];
                case 3:
                    // Wait a frame to ensure the transition is stopped
                    _a.sent();
                    // Clicking the button is async, so at most one more call could have happened
                    expect(callCount()).to.lessThanOrEqual(callsAfterUnmount + (internal_test_utils_1.reactMajor > 18 ? 1 : 2));
                    return [2 /*return*/];
            }
        });
    }); });
    it('stops animation when the hook is unmounted', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestComponent(_a) {
            var width = _a.width;
            var ref = (0, useAnimateInternal_1.useAnimateInternal)({ width: width }, { createInterpolator: interpolateWidth, applyProps: applyProps, initialProps: { width: 0 } })[0];
            return ((0, jsx_runtime_1.jsx)("svg", { children: (0, jsx_runtime_1.jsx)("path", { ref: ref }) }));
        }
        var unmount, lastCallBeforeUnmount, numCallsBeforeUnmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unmount = render((0, jsx_runtime_1.jsx)(TestComponent, { width: 1000 })).unmount;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(lastCallWidth()).to.be.greaterThan(10);
                        })];
                case 1:
                    _a.sent();
                    lastCallBeforeUnmount = lastCallWidth();
                    numCallsBeforeUnmount = callCount();
                    expect(lastCallBeforeUnmount).to.be.lessThan(1000);
                    unmount();
                    // Wait a frame to ensure the transition is stopped
                    return [4 /*yield*/, waitNextFrame()];
                case 2:
                    // Wait a frame to ensure the transition is stopped
                    _a.sent();
                    expect(lastCallWidth()).to.equal(lastCallBeforeUnmount);
                    expect(callCount()).to.equal(numCallsBeforeUnmount);
                    return [2 /*return*/];
            }
        });
    }); });
});
