"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactToWebComponent = reactToWebComponent;
var renderSymbol = Symbol.for('render');
var connectedSymbol = Symbol.for('connected');
var contextSymbol = Symbol.for('context');
var propsSymbol = Symbol.for('props');
// This function creates a custom web component that wraps a React component.
// Adapted from https://github.com/bitovi/react-to-web-component/blob/b1372bfd7bc67fe49920db840f1ed9cf736b2724/packages/core/src/core.ts
function reactToWebComponent(ReactComponent, options, renderer) {
    var _a, _b;
    var ReactWebComponent = /** @class */ (function (_super) {
        __extends(ReactWebComponent, _super);
        function ReactWebComponent() {
            var _this = _super.call(this) || this;
            _this[_a] = true;
            _this[_b] = {};
            if (options.shadow) {
                _this.container = _this.attachShadow({
                    mode: options.shadow,
                });
            }
            else {
                _this.container = _this;
            }
            _this[propsSymbol].container = _this.container;
            return _this;
        }
        Object.defineProperty(ReactWebComponent, "observedAttributes", {
            get: function () {
                return [];
            },
            enumerable: false,
            configurable: true
        });
        ReactWebComponent.prototype.connectedCallback = function () {
            this[connectedSymbol] = true;
            this[renderSymbol]();
        };
        ReactWebComponent.prototype.disconnectedCallback = function () {
            this[connectedSymbol] = false;
            if (this[contextSymbol]) {
                renderer.unmount(this[contextSymbol]);
            }
            delete this[contextSymbol];
        };
        ReactWebComponent.prototype[(_a = connectedSymbol, _b = propsSymbol, renderSymbol)] = function () {
            if (!this[connectedSymbol]) {
                return;
            }
            if (!this[contextSymbol]) {
                this[contextSymbol] = renderer.mount(this.container, ReactComponent, this[propsSymbol]);
            }
        };
        return ReactWebComponent;
    }(HTMLElement));
    return ReactWebComponent;
}
