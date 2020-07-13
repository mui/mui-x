[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/autosizer/index"](_lib_autosizer_index_.md)

# Module: "lib/autosizer/index"

## Index

### Variables

- [AutoSizer](_lib_autosizer_index_.md#autosizer)
- [\_extends](_lib_autosizer_index_.md#_extends)
- [createClass](_lib_autosizer_index_.md#createclass)

### Functions

- [classCallCheck](_lib_autosizer_index_.md#classcallcheck)
- [createDetectElementResize](_lib_autosizer_index_.md#createdetectelementresize)
- [inherits](_lib_autosizer_index_.md#inherits)
- [possibleConstructorReturn](_lib_autosizer_index_.md#possibleconstructorreturn)

## Variables

### AutoSizer

• **AutoSizer**: _[AutoSizer](_lib_autosizer_index_.md#autosizer)_ = function (\_React$PureComponent) {
  inherits(AutoSizer, _React$PureComponent);

function AutoSizer() {
var \_ref;

    var _temp, _this, _ret;

    classCallCheck(this, AutoSizer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = AutoSizer.__proto__ || Object.getPrototypeOf(AutoSizer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      height: _this.props.defaultHeight || 0,
      width: _this.props.defaultWidth || 0
    }, _this._onResize = function () {
      var _this$props = _this.props,
          disableHeight = _this$props.disableHeight,
          disableWidth = _this$props.disableWidth,
          onResize = _this$props.onResize;

      if (_this._parentNode) {
        // Guard against AutoSizer component being removed from the DOM immediately after being added.
        // This can result in invalid style values which can result in NaN values if we don't handle them.
        // See issue #150 for more context.

        var _height = _this._parentNode.offsetHeight || 0;
        var _width = _this._parentNode.offsetWidth || 0;

        var _style = window.getComputedStyle(_this._parentNode) || {};
        var paddingLeft = parseInt(_style.paddingLeft, 10) || 0;
        var paddingRight = parseInt(_style.paddingRight, 10) || 0;
        var paddingTop = parseInt(_style.paddingTop, 10) || 0;
        var paddingBottom = parseInt(_style.paddingBottom, 10) || 0;

        var newHeight = _height - paddingTop - paddingBottom;
        var newWidth = _width - paddingLeft - paddingRight;

        if (!disableHeight && _this.state.height !== newHeight || !disableWidth && _this.state.width !== newWidth) {
          _this.setState({
            height: _height - paddingTop - paddingBottom,
            width: _width - paddingLeft - paddingRight
          });

          onResize({ height: _height, width: _width });
        }
      }
    }, _this._setRef = function (autoSizer) {
      _this._autoSizer = autoSizer;
    }, _temp), possibleConstructorReturn(_this, _ret);

}

createClass(AutoSizer, [{
key: 'componentDidMount',
value: function componentDidMount() {
var nonce = this.props.nonce;

      if (this._autoSizer && this._autoSizer.parentNode && this._autoSizer.parentNode.ownerDocument && this._autoSizer.parentNode.ownerDocument.defaultView && this._autoSizer.parentNode instanceof this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement) {
        // Delay access of parentNode until mount.
        // This handles edge-cases where the component has already been unmounted before its ref has been set,
        // As well as libraries like react-lite which have a slightly different lifecycle.
        this._parentNode = this._autoSizer.parentNode;

        // Defer requiring resize handler in order to support server-side rendering.
        // See issue #41
        this._detectElementResize = createDetectElementResize(nonce);
        this._detectElementResize.addResizeListener(this._parentNode, this._onResize);

        this._onResize();
      }
    }

}, {
key: 'componentWillUnmount',
value: function componentWillUnmount() {
if (this.\_detectElementResize && this.\_parentNode) {
this.\_detectElementResize.removeResizeListener(this.\_parentNode, this.\_onResize);
}
}
}, {
key: 'render',
value: function render() {
var \_props = this.props,
children = \_props.children,
className = \_props.className,
disableHeight = \_props.disableHeight,
disableWidth = \_props.disableWidth,
style = \_props.style;
var \_state = this.state,
height = \_state.height,
width = \_state.width;

      // Outer div should not force width/height since that may prevent containers from shrinking.
      // Inner component should overflow and use calculated width/height.
      // See issue #68 for more information.

      var outerStyle = { overflow: 'visible' };
      var childParams = {};

      // Avoid rendering children before the initial measurements have been collected.
      // At best this would just be wasting cycles.
      var bailoutOnChildren = false;

      if (!disableHeight) {
        if (height === 0) {
          bailoutOnChildren = true;
        }
        outerStyle.height = 0;
        childParams.height = height;
      }

      if (!disableWidth) {
        if (width === 0) {
          bailoutOnChildren = true;
        }
        outerStyle.width = 0;
        childParams.width = width;
      }

      return createElement(
        'div',
        {
          className: className,
          ref: this._setRef,
          style: _extends({}, outerStyle, style) },
        !bailoutOnChildren && children(childParams)
      );
    }

}]);
return AutoSizer;
}(PureComponent)

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:260](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L260)_

---

### \_extends

• **\_extends**: _assign_ = Object.assign || function (target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }

}

return target;
}

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:222](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L222)_

---

### createClass

• **createClass**: _(Anonymous function)_ = function () {
function defineProperties(target, props) {
for (var i = 0; i < props.length; i++) {
var descriptor = props[i];
descriptor.enumerable = descriptor.enumerable || false;
descriptor.configurable = true;
if ("value" in descriptor) descriptor.writable = true;
Object.defineProperty(target, descriptor.key, descriptor);
}
}

return function (Constructor, protoProps, staticProps) {
if (protoProps) defineProperties(Constructor.prototype, protoProps);
if (staticProps) defineProperties(Constructor, staticProps);
return Constructor;
};
}()

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:204](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L204)_

## Functions

### classCallCheck

▸ **classCallCheck**(`instance`: any, `Constructor`: any): _void_

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:198](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L198)_

**Parameters:**

| Name          | Type |
| ------------- | ---- |
| `instance`    | any  |
| `Constructor` | any  |

**Returns:** _void_

---

### createDetectElementResize

▸ **createDetectElementResize**(`nonce`: any): _object_

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:15](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L15)_

Detect Element Resize.
https://github.com/sdecima/javascript-detect-element-resize
Sebastian Decima

Forked from version 0.5.3; includes the following modifications:
1) Guard against unsafe 'window' and 'document' references (to support SSR).
2) Defer initialization code via a top-level function wrapper (to support SSR).

3. Avoid unnecessary reflows by not measuring size for scroll events bubbling from children.
4. Add nonce for style element.

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `nonce` | any  |

**Returns:** _object_

- **addResizeListener**: _addResizeListener_ = addResizeListener

- **removeResizeListener**: _removeResizeListener_ = removeResizeListener

---

### inherits

▸ **inherits**(`subClass`: any, `superClass`: any): _void_

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:236](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L236)_

**Parameters:**

| Name         | Type |
| ------------ | ---- |
| `subClass`   | any  |
| `superClass` | any  |

**Returns:** _void_

---

### possibleConstructorReturn

▸ **possibleConstructorReturn**(`self`: any, `call`: any): _any_

_Defined in [packages/grid/x-grid-modules/lib/autosizer/index.js:252](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/autosizer/index.js#L252)_

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `self` | any  |
| `call` | any  |

**Returns:** _any_
