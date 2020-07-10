[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/models/gridApi"](../modules/_src_models_gridapi_.md) › [CoreApi](_src_models_gridapi_.coreapi.md)

# Interface: CoreApi

## Hierarchy

* EventEmitter

  ↳ **CoreApi**

## Index

### Constructors

* [constructor](_src_models_gridapi_.coreapi.md#constructor)

### Properties

* [isInitialised](_src_models_gridapi_.coreapi.md#isinitialised)
* [onResize](_src_models_gridapi_.coreapi.md#onresize)
* [onUnmount](_src_models_gridapi_.coreapi.md#onunmount)
* [registerEvent](_src_models_gridapi_.coreapi.md#registerevent)
* [resize](_src_models_gridapi_.coreapi.md#resize)
* [defaultMaxListeners](_src_models_gridapi_.coreapi.md#static-defaultmaxlisteners)
* [errorMonitor](_src_models_gridapi_.coreapi.md#static-readonly-errormonitor)

### Methods

* [addListener](_src_models_gridapi_.coreapi.md#addlistener)
* [emit](_src_models_gridapi_.coreapi.md#emit)
* [eventNames](_src_models_gridapi_.coreapi.md#eventnames)
* [getMaxListeners](_src_models_gridapi_.coreapi.md#getmaxlisteners)
* [listenerCount](_src_models_gridapi_.coreapi.md#listenercount)
* [listeners](_src_models_gridapi_.coreapi.md#listeners)
* [off](_src_models_gridapi_.coreapi.md#off)
* [on](_src_models_gridapi_.coreapi.md#on)
* [once](_src_models_gridapi_.coreapi.md#once)
* [prependListener](_src_models_gridapi_.coreapi.md#prependlistener)
* [prependOnceListener](_src_models_gridapi_.coreapi.md#prependoncelistener)
* [rawListeners](_src_models_gridapi_.coreapi.md#rawlisteners)
* [removeAllListeners](_src_models_gridapi_.coreapi.md#removealllisteners)
* [removeListener](_src_models_gridapi_.coreapi.md#removelistener)
* [setMaxListeners](_src_models_gridapi_.coreapi.md#setmaxlisteners)
* [listenerCount](_src_models_gridapi_.coreapi.md#static-listenercount)

## Constructors

###  constructor

\+ **new CoreApi**(`options?`: EventEmitterOptions): *[CoreApi](_src_models_gridapi_.coreapi.md)*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[constructor](_src_models_gridapi_.coreapi.md#constructor)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`options?` | EventEmitterOptions |

**Returns:** *[CoreApi](_src_models_gridapi_.coreapi.md)*

## Properties

###  isInitialised

• **isInitialised**: *boolean*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:64](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L64)*

___

###  onResize

• **onResize**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:67](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L67)*

#### Type declaration:

▸ (`handler`: function): *void*

**Parameters:**

▪ **handler**: *function*

▸ (`param`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`param` | any |

___

###  onUnmount

• **onUnmount**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:66](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L66)*

#### Type declaration:

▸ (`handler`: function): *void*

**Parameters:**

▪ **handler**: *function*

▸ (`param`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`param` | any |

___

###  registerEvent

• **registerEvent**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:65](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L65)*

#### Type declaration:

▸ (`event`: string, `handler`: function): *function*

**Parameters:**

▪ **event**: *string*

▪ **handler**: *function*

▸ (`param`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`param` | any |

▸ (): *void*

___

###  resize

• **resize**: *function*

*Defined in [packages/grid/x-grid-modules/src/models/gridApi.ts:68](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/models/gridApi.ts#L68)*

#### Type declaration:

▸ (): *void*

___

### `Static` defaultMaxListeners

▪ **defaultMaxListeners**: *number*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[defaultMaxListeners](_src_models_gridapi_.coreapi.md#static-defaultmaxlisteners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:45

___

### `Static` `Readonly` errorMonitor

▪ **errorMonitor**: *keyof symbol*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[errorMonitor](_src_models_gridapi_.coreapi.md#static-readonly-errormonitor)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:55

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

## Methods

###  addListener

▸ **addListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[addListener](_src_models_gridapi_.coreapi.md#addlistener)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:553

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  emit

▸ **emit**(`event`: string | symbol, ...`args`: any[]): *boolean*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[emit](_src_models_gridapi_.coreapi.md#emit)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:563

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |
`...args` | any[] |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹string | symbol›*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[eventNames](_src_models_gridapi_.coreapi.md#eventnames)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:568

**Returns:** *Array‹string | symbol›*

___

###  getMaxListeners

▸ **getMaxListeners**(): *number*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[getMaxListeners](_src_models_gridapi_.coreapi.md#getmaxlisteners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:560

**Returns:** *number*

___

###  listenerCount

▸ **listenerCount**(`type`: string | symbol): *number*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listenerCount](_src_models_gridapi_.coreapi.md#listenercount)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:564

**Parameters:**

Name | Type |
------ | ------ |
`type` | string &#124; symbol |

**Returns:** *number*

___

###  listeners

▸ **listeners**(`event`: string | symbol): *[Function](_src_utils_utils_.debouncedfunction.md#function)[]*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listeners](_src_models_gridapi_.coreapi.md#listeners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:561

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *[Function](_src_utils_utils_.debouncedfunction.md#function)[]*

___

###  off

▸ **off**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[off](_src_models_gridapi_.coreapi.md#off)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:557

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  on

▸ **on**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[on](_src_models_gridapi_.coreapi.md#on)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:554

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  once

▸ **once**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[once](_src_models_gridapi_.coreapi.md#once)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:555

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependListener

▸ **prependListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[prependListener](_src_models_gridapi_.coreapi.md#prependlistener)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:566

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  prependOnceListener

▸ **prependOnceListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[prependOnceListener](_src_models_gridapi_.coreapi.md#prependoncelistener)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:567

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  rawListeners

▸ **rawListeners**(`event`: string | symbol): *[Function](_src_utils_utils_.debouncedfunction.md#function)[]*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[rawListeners](_src_models_gridapi_.coreapi.md#rawlisteners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:562

**Parameters:**

Name | Type |
------ | ------ |
`event` | string &#124; symbol |

**Returns:** *[Function](_src_utils_utils_.debouncedfunction.md#function)[]*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: string | symbol): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[removeAllListeners](_src_models_gridapi_.coreapi.md#removealllisteners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:558

**Parameters:**

Name | Type |
------ | ------ |
`event?` | string &#124; symbol |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**(`event`: string | symbol, `listener`: function): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[removeListener](_src_models_gridapi_.coreapi.md#removelistener)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:556

**Parameters:**

▪ **event**: *string | symbol*

▪ **listener**: *function*

▸ (...`args`: any[]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *this*

___

###  setMaxListeners

▸ **setMaxListeners**(`n`: number): *this*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[setMaxListeners](_src_models_gridapi_.coreapi.md#setmaxlisteners)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/globals.d.ts:559

**Parameters:**

Name | Type |
------ | ------ |
`n` | number |

**Returns:** *this*

___

### `Static` listenerCount

▸ **listenerCount**(`emitter`: EventEmitter, `event`: string | symbol): *number*

*Inherited from [CoreApi](_src_models_gridapi_.coreapi.md).[listenerCount](_src_models_gridapi_.coreapi.md#static-listenercount)*

Defined in packages/grid/x-grid-modules/node_modules/@types/node/events.d.ts:44

**`deprecated`** since v4.0.0

**Parameters:**

Name | Type |
------ | ------ |
`emitter` | EventEmitter |
`event` | string &#124; symbol |

**Returns:** *number*
