[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [CoreApi](_src_models_gridapi_.coreapi.md)

# Interface: CoreApi

## Hierarchy

- EventEmitter

  ↳ **CoreApi**

## Index

### Constructors

- [constructor](_src_models_gridapi_.coreapi.md#constructor)

### Properties

- [isInitialised](_src_models_gridapi_.coreapi.md#isinitialised)
- [onResize](_src_models_gridapi_.coreapi.md#onresize)
- [onUnmount](_src_models_gridapi_.coreapi.md#onunmount)
- [registerEvent](_src_models_gridapi_.coreapi.md#registerevent)
- [resize](_src_models_gridapi_.coreapi.md#resize)
- [defaultMaxListeners](_src_models_gridapi_.coreapi.md#static-defaultmaxlisteners)
- [errorMonitor](_src_models_gridapi_.coreapi.md#static-readonly-errormonitor)

### Methods

- [addListener](_src_models_gridapi_.coreapi.md#addlistener)
- [emit](_src_models_gridapi_.coreapi.md#emit)
- [eventNames](_src_models_gridapi_.coreapi.md#eventnames)
- [getMaxListeners](_src_models_gridapi_.coreapi.md#getmaxlisteners)
- [listenerCount](_src_models_gridapi_.coreapi.md#listenercount)
- [listeners](_src_models_gridapi_.coreapi.md#listeners)
- [off](_src_models_gridapi_.coreapi.md#off)
- [on](_src_models_gridapi_.coreapi.md#on)
- [once](_src_models_gridapi_.coreapi.md#once)
- [prependListener](_src_models_gridapi_.coreapi.md#prependlistener)
- [prependOnceListener](_src_models_gridapi_.coreapi.md#prependoncelistener)
- [rawListeners](_src_models_gridapi_.coreapi.md#rawlisteners)
- [removeAllListeners](_src_models_gridapi_.coreapi.md#removealllisteners)
- [removeListener](_src_models_gridapi_.coreapi.md#removelistener)
- [setMaxListeners](_src_models_gridapi_.coreapi.md#setmaxlisteners)
- [listenerCount](_src_models_gridapi_.coreapi.md#static-listenercount)

## Constructors

### constructor

\+ **new CoreApi**(`options?`: EventEmitterOptions): _[CoreApi](_src_models_gridapi_.coreapi.md)_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[constructor](_src_models_gridapi_.coreapi.md#constructor)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:41

**Parameters:**

| Name       | Type                |
| ---------- | ------------------- |
| `options?` | EventEmitterOptions |

**Returns:** _[CoreApi](_src_models_gridapi_.coreapi.md)_

## Properties

### isInitialised

• **isInitialised**: _boolean_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:64](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L64)_

---

### onResize

• **onResize**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:67](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L67)_

#### Type declaration:

▸ (`handler`: function): _void_

**Parameters:**

▪ **handler**: _function_

▸ (`param`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `param` | any  |

---

### onUnmount

• **onUnmount**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:66](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L66)_

#### Type declaration:

▸ (`handler`: function): _void_

**Parameters:**

▪ **handler**: _function_

▸ (`param`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `param` | any  |

---

### registerEvent

• **registerEvent**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:65](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L65)_

#### Type declaration:

▸ (`event`: string, `handler`: function): _function_

**Parameters:**

▪ **event**: _string_

▪ **handler**: _function_

▸ (`param`: any): _void_

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `param` | any  |

▸ (): _void_

---

### resize

• **resize**: _function_

_Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:68](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L68)_

#### Type declaration:

▸ (): _void_

---

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: _number_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[defaultMaxListeners](_src_models_gridapi_.coreapi.md#static-defaultmaxlisteners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:45

---

### `Static` `Readonly` errorMonitor

▪ **errorMonitor**: _keyof symbol_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[errorMonitor](_src_models_gridapi_.coreapi.md#static-readonly-errormonitor)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

### addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[addListener](_src_models_gridapi_.coreapi.md#addlistener)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:553

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): _boolean_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[emit](_src_models_gridapi_.coreapi.md#emit)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:563

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `event`   | string &#124; symbol |
| `...args` | any[]                |

**Returns:** _boolean_

---

### eventNames

▸ **eventNames**(): _Array‹string | symbol›_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[eventNames](_src_models_gridapi_.coreapi.md#eventnames)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:568

**Returns:** _Array‹string | symbol›_

---

### getMaxListeners

▸ **getMaxListeners**(): _number_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[getMaxListeners](_src_models_gridapi_.coreapi.md#getmaxlisteners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:560

**Returns:** _number_

---

### listenerCount

▸ **listenerCount**(`type`: string | symbol): _number_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listenerCount](_src_models_gridapi_.coreapi.md#listenercount)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:564

**Parameters:**

| Name   | Type                 |
| ------ | -------------------- |
| `type` | string &#124; symbol |

**Returns:** _number_

---

### listeners

▸ **listeners**(`event`: string | symbol): _[Function](_src_utils_utils_.debouncedfunction.md#function)[]_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listeners](_src_models_gridapi_.coreapi.md#listeners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:561

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _[Function](_src_utils_utils_.debouncedfunction.md#function)[]_

---

### off

▸ **off**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[off](_src_models_gridapi_.coreapi.md#off)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:557

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### on

▸ **on**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[on](_src_models_gridapi_.coreapi.md#on)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:554

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### once

▸ **once**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[once](_src_models_gridapi_.coreapi.md#once)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:555

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[prependListener](_src_models_gridapi_.coreapi.md#prependlistener)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:566

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[prependOnceListener](_src_models_gridapi_.coreapi.md#prependoncelistener)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:567

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### rawListeners

▸ **rawListeners**(`event`: string | symbol): _[Function](_src_utils_utils_.debouncedfunction.md#function)[]_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[rawListeners](_src_models_gridapi_.coreapi.md#rawlisteners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:562

**Parameters:**

| Name    | Type                 |
| ------- | -------------------- |
| `event` | string &#124; symbol |

**Returns:** _[Function](_src_utils_utils_.debouncedfunction.md#function)[]_

---

### removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[removeAllListeners](_src_models_gridapi_.coreapi.md#removealllisteners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:558

**Parameters:**

| Name     | Type                 |
| -------- | -------------------- |
| `event?` | string &#124; symbol |

**Returns:** _this_

---

### removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[removeListener](_src_models_gridapi_.coreapi.md#removelistener)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:556

**Parameters:**

▪ **event**: _string | symbol_

▪ **listener**: _function_

▸ (...`args`: any[]): _void_

**Parameters:**

| Name      | Type  |
| --------- | ----- |
| `...args` | any[] |

**Returns:** _this_

---

### setMaxListeners

▸ **setMaxListeners**(`n`: number): _this_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[setMaxListeners](_src_models_gridapi_.coreapi.md#setmaxlisteners)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:559

**Parameters:**

| Name | Type   |
| ---- | ------ |
| `n`  | number |

**Returns:** _this_

---

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): _number_

_Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listenerCount](_src_models_gridapi_.coreapi.md#static-listenercount)_

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

| Name      | Type                 |
| --------- | -------------------- |
| `emitter` | EventEmitter         |
| `event`   | string &#124; symbol |

**Returns:** _number_
