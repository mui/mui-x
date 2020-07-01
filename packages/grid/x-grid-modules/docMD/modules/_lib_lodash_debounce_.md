[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/debounce"](_lib_lodash_debounce_.md)

# Module: "lib/lodash/debounce"

## Index

### Variables

* [FUNC_ERROR_TEXT](_lib_lodash_debounce_.md#func_error_text)
* [nativeMax](_lib_lodash_debounce_.md#nativemax)
* [nativeMin](_lib_lodash_debounce_.md#nativemin)

### Function Functions

* [debounce](_lib_lodash_debounce_.md#debounce)

## Variables

###  FUNC_ERROR_TEXT

• **FUNC_ERROR_TEXT**: *string* = "Expected a function"

*Defined in [packages/grid/x-grid-modules/lib/lodash/debounce.js:16](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/debounce.js#L16)*

Error message constants.

___

###  nativeMax

• **nativeMax**: *max* = Math.max

*Defined in [packages/grid/x-grid-modules/lib/lodash/debounce.js:19](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/debounce.js#L19)*

___

###  nativeMin

• **nativeMin**: *min* = Math.min

*Defined in [packages/grid/x-grid-modules/lib/lodash/debounce.js:20](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/debounce.js#L20)*

## Function Functions

###  debounce

▸ **debounce**(`func`: [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function), `wait`: undefined | number, `options`: undefined | object): *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

*Defined in [packages/grid/x-grid-modules/lib/lodash/debounce.js:76](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/lib/lodash/debounce.js#L76)*

Creates a debounced function that delays invoking `func` until after `wait`
milliseconds have elapsed since the last time the debounced function was
invoked. The debounced function comes with a `cancel` method to cancel
delayed `func` invocations and a `flush` method to immediately invoke them.
Provide `options` to indicate whether `func` should be invoked on the
leading and/or trailing edge of the `wait` timeout. The `func` is invoked
with the last arguments provided to the debounced function. Subsequent
calls to the debounced function return the result of the last `func`
invocation.

**Note:** If `leading` and `trailing` options are `true`, `func` is
invoked on the trailing edge of the timeout only if the debounced function
is invoked more than once during the `wait` timeout.

If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
until to the next tick, similar to `setTimeout` with a timeout of `0`.

See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
for details over the differences between `_.debounce` and `_.throttle`.

**`static`** 

**`memberof`** _

**`since`** 0.1.0

**`example`** 

// Avoid costly calculations while the window size is in flux.
jQuery(window).on('resize', _.debounce(calculateLayout, 150));

// Invoke `sendMail` when clicked, debouncing subsequent calls.
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));

// Ensure `batchLog` is invoked once after 1 second of debounced calls.
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);

// Cancel the trailing debounced invocation.
jQuery(window).on('popstate', debounced.cancel);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func` | [Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function) | The function to debounce. |
`wait` | undefined &#124; number | - |
`options` | undefined &#124; object | - |

**Returns:** *[Function](../interfaces/_src_utils_utils_.debouncedfunction.md#function)*

Returns the new debounced function.
