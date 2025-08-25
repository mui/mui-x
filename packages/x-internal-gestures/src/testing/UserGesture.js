"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGesture = void 0;
var PointerManager_1 = require("./PointerManager");
var UserGesture = /** @class */ (function () {
    /**
     * Creates a new UserGesture instance.
     */
    function UserGesture(pointerType) {
        this.pointerManager = new PointerManager_1.PointerManager(pointerType);
    }
    /**
     * Configures global options for the gestures.
     *
     * @param options - Global options for the gestures.
     * @returns This instance.
     */
    UserGesture.prototype.setup = function (options) {
        var _this = this;
        var _a;
        // Preserve advanceTimers if it was set previously and not overridden
        if ((options === null || options === void 0 ? void 0 : options.advanceTimers) !== undefined) {
            this.advanceTimers = options.advanceTimers;
        }
        // Register plugins if provided
        (_a = options === null || options === void 0 ? void 0 : options.plugins) === null || _a === void 0 ? void 0 : _a.forEach(function (plugin) {
            // @ts-expect-error, we are using a dynamic key
            if (_this[plugin.name]) {
                throw new Error("Plugin with name \"".concat(plugin.name, "\" already exists. Please use a unique name."));
            }
            // @ts-expect-error, we are using a dynamic key
            _this[plugin.name] = function (newOptions) {
                return plugin.gesture(_this.pointerManager, newOptions, _this.advanceTimers);
            };
        });
        return this;
    };
    return UserGesture;
}());
exports.UserGesture = UserGesture;
