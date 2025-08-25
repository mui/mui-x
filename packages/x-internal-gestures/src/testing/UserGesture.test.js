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
var vitest_1 = require("vitest");
var PointerManager_1 = require("./PointerManager");
var UserGesture_1 = require("./UserGesture");
(0, vitest_1.describe)('UserGesture - Plugin System', function () {
    var userGesture;
    // Mock plugins for testing
    var mockGestureFunction;
    var mockPlugin;
    var target;
    (0, vitest_1.beforeEach)(function () {
        userGesture = new UserGesture_1.UserGesture('mouse');
        mockGestureFunction = vitest_1.vi.fn().mockResolvedValue(undefined);
        mockPlugin = {
            name: 'customGesture',
            gesture: mockGestureFunction,
        };
        // We need to reset DOM between tests
        document.body.innerHTML = '';
        target = document.createElement('div');
        document.body.appendChild(target);
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should register plugins during setup', function () {
        // Register a plugin
        userGesture.setup({
            plugins: [mockPlugin],
        });
        // Check if the plugin was registered correctly
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.customGesture).toBe('function');
    });
    (0, vitest_1.it)('should throw an error when registering a plugin with a name that already exists', function () {
        // First registration should succeed
        userGesture.setup({
            plugins: [mockPlugin],
        });
        // Second registration with the same name should fail
        var duplicatePlugin = {
            name: 'customGesture',
            gesture: vitest_1.vi.fn(),
        };
        (0, vitest_1.expect)(function () {
            userGesture.setup({
                plugins: [duplicatePlugin],
            });
        }).toThrow('Plugin with name "customGesture" already exists. Please use a unique name.');
    });
    (0, vitest_1.it)('should call the plugin gesture function with correct parameters when invoked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var testOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Register the plugin
                    userGesture.setup({
                        plugins: [mockPlugin],
                    });
                    testOptions = {
                        target: target,
                        customOption: 'test-value',
                    };
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    return [4 /*yield*/, userGesture.customGesture(testOptions)];
                case 1:
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    _a.sent();
                    // Verify the gesture function was called correctly
                    (0, vitest_1.expect)(mockGestureFunction).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockGestureFunction).toHaveBeenCalledWith(vitest_1.expect.any(PointerManager_1.PointerManager), testOptions, undefined);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should pass the advanceTimers function to the plugin gesture when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockAdvanceTimers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockAdvanceTimers = vitest_1.vi.fn().mockImplementation(function () { return Promise.resolve(); });
                    // Register the plugin with advanceTimers
                    userGesture.setup({
                        advanceTimers: mockAdvanceTimers,
                        plugins: [mockPlugin],
                    });
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    return [4 /*yield*/, userGesture.customGesture({})];
                case 1:
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    _a.sent();
                    // Verify advanceTimers was passed to the plugin
                    (0, vitest_1.expect)(mockGestureFunction).toHaveBeenCalledWith(vitest_1.expect.any(PointerManager_1.PointerManager), vitest_1.expect.anything(), mockAdvanceTimers);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should register multiple plugins at once', function () {
        // Create several mock plugins
        var mockPlugins = [
            {
                name: 'gestureOne',
                gesture: vitest_1.vi.fn().mockResolvedValue(undefined),
            },
            {
                name: 'gestureTwo',
                gesture: vitest_1.vi.fn().mockResolvedValue(undefined),
            },
            {
                name: 'gestureThree',
                gesture: vitest_1.vi.fn().mockResolvedValue(undefined),
            },
        ];
        // Register all plugins
        userGesture.setup({
            plugins: mockPlugins,
        });
        // Check all plugins were registered
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.gestureOne).toBe('function');
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.gestureTwo).toBe('function');
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.gestureThree).toBe('function');
    });
    (0, vitest_1.it)('should create a working plugin that can trigger DOM events', function () { return __awaiter(void 0, void 0, void 0, function () {
        var realPlugin, pointerDownHandler, pointerUpHandler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    realPlugin = {
                        name: 'testTap',
                        gesture: function (pointerManager, options, advanceTimers) { return __awaiter(void 0, void 0, void 0, function () {
                            var pluginTarget, tapHandler, rect, x, y;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        pluginTarget = options.target;
                                        if (!pluginTarget) {
                                            throw new Error('Target element is required');
                                        }
                                        tapHandler = vitest_1.vi.fn();
                                        pluginTarget.addEventListener('pointerdown', tapHandler);
                                        rect = pluginTarget.getBoundingClientRect();
                                        x = rect.left + rect.width / 2;
                                        y = rect.top + rect.height / 2;
                                        // Perform a tap
                                        pointerManager.pointerDown({ id: 1, target: pluginTarget, x: x, y: y });
                                        if (!advanceTimers) return [3 /*break*/, 2];
                                        return [4 /*yield*/, advanceTimers(10)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, new Promise(function (resolve) {
                                            setTimeout(resolve, 10);
                                        })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        pointerManager.pointerUp({ id: 1, target: pluginTarget, x: x, y: y });
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                    };
                    // Register the plugin
                    userGesture.setup({
                        plugins: [realPlugin],
                    });
                    pointerDownHandler = vitest_1.vi.fn();
                    pointerUpHandler = vitest_1.vi.fn();
                    target.addEventListener('pointerdown', pointerDownHandler);
                    target.addEventListener('pointerup', pointerUpHandler);
                    // @ts-expect-error, accessing dynamic property
                    return [4 /*yield*/, userGesture.testTap({ target: target })];
                case 1:
                    // @ts-expect-error, accessing dynamic property
                    _a.sent();
                    // Verify the events were triggered
                    (0, vitest_1.expect)(pointerDownHandler).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(pointerUpHandler).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('should allow plugins to be registered incrementally', function () {
        // First plugin
        var firstPlugin = {
            name: 'firstGesture',
            gesture: vitest_1.vi.fn().mockResolvedValue(undefined),
        };
        userGesture.setup({
            plugins: [firstPlugin],
        });
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.firstGesture).toBe('function');
        // Add second plugin later
        var secondPlugin = {
            name: 'secondGesture',
            gesture: vitest_1.vi.fn().mockResolvedValue(undefined),
        };
        userGesture.setup({
            plugins: [secondPlugin],
        });
        // Both plugins should be available
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.firstGesture).toBe('function');
        // @ts-expect-error, accessing dynamic property
        (0, vitest_1.expect)(typeof userGesture.secondGesture).toBe('function');
    });
    (0, vitest_1.it)('should preserve advanceTimers when adding plugins incrementally', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockAdvanceTimers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockAdvanceTimers = vitest_1.vi.fn().mockImplementation(function () { return Promise.resolve(); });
                    // Set up with advanceTimers but no plugins initially
                    userGesture.setup({
                        advanceTimers: mockAdvanceTimers,
                    });
                    // Add a plugin later
                    userGesture.setup({
                        plugins: [mockPlugin],
                    });
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    return [4 /*yield*/, userGesture.customGesture({})];
                case 1:
                    // Invoke the plugin
                    // @ts-expect-error, accessing dynamic property
                    _a.sent();
                    // Verify advanceTimers was still passed to the plugin
                    (0, vitest_1.expect)(mockGestureFunction).toHaveBeenCalledWith(vitest_1.expect.any(PointerManager_1.PointerManager), vitest_1.expect.anything(), mockAdvanceTimers);
                    return [2 /*return*/];
            }
        });
    }); });
});
