[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/utils"](../modules/_src_utils_utils_.md) › [DebouncedFunction](_src_utils_utils_.debouncedfunction.md)

# Interface: DebouncedFunction

## Hierarchy

* [Function](_src_utils_utils_.debouncedfunction.md#function)

  ↳ **DebouncedFunction**

## Index

### Properties

* [Function](_src_utils_utils_.debouncedfunction.md#function)
* [arguments](_src_utils_utils_.debouncedfunction.md#arguments)
* [caller](_src_utils_utils_.debouncedfunction.md#caller)
* [cancel](_src_utils_utils_.debouncedfunction.md#cancel)
* [flush](_src_utils_utils_.debouncedfunction.md#flush)
* [length](_src_utils_utils_.debouncedfunction.md#readonly-length)
* [name](_src_utils_utils_.debouncedfunction.md#readonly-name)
* [prototype](_src_utils_utils_.debouncedfunction.md#prototype)

### Methods

* [[Symbol.hasInstance]](_src_utils_utils_.debouncedfunction.md#[symbol.hasinstance])
* [apply](_src_utils_utils_.debouncedfunction.md#apply)
* [bind](_src_utils_utils_.debouncedfunction.md#bind)
* [call](_src_utils_utils_.debouncedfunction.md#call)
* [toString](_src_utils_utils_.debouncedfunction.md#tostring)

## Properties

###  Function

• **Function**: *FunctionConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:316

___

###  arguments

• **arguments**: *any*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[arguments](_src_utils_utils_.debouncedfunction.md#arguments)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:302

___

###  caller

• **caller**: *[Function](_src_utils_utils_.debouncedfunction.md#function)*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[caller](_src_utils_utils_.debouncedfunction.md#caller)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:303

___

###  cancel

• **cancel**: *function*

*Defined in [packages/grid/x-grid-modules/src/utils/utils.ts:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/utils.ts#L7)*

#### Type declaration:

▸ (): *void*

___

###  flush

• **flush**: *function*

*Defined in [packages/grid/x-grid-modules/src/utils/utils.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/utils.ts#L8)*

#### Type declaration:

▸ (): *void*

___

### `Readonly` length

• **length**: *number*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[length](_src_utils_utils_.debouncedfunction.md#readonly-length)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:299

___

### `Readonly` name

• **name**: *string*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[name](_src_utils_utils_.debouncedfunction.md#readonly-name)*

Defined in node_modules/typescript/lib/lib.es2015.core.d.ts:97

Returns the name of the function. Function names are read-only and can not be changed.

___

###  prototype

• **prototype**: *any*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[prototype](_src_utils_utils_.debouncedfunction.md#prototype)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:298

## Methods

###  [Symbol.hasInstance]

▸ **[Symbol.hasInstance]**(`value`: any): *boolean*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[[Symbol.hasInstance]](_src_utils_utils_.debouncedfunction.md#[symbol.hasinstance])*

Defined in node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:157

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

###  apply

▸ **apply**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, `argArray?`: any): *any*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[apply](_src_utils_utils_.debouncedfunction.md#apply)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:278

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [Function](_src_utils_utils_.debouncedfunction.md#function) | - |
`thisArg` | any | The object to be used as the this object. |
`argArray?` | any | A set of arguments to be passed to the function.  |

**Returns:** *any*

___

###  bind

▸ **bind**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[bind](_src_utils_utils_.debouncedfunction.md#bind)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:293

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [Function](_src_utils_utils_.debouncedfunction.md#function) | - |
`thisArg` | any | An object to which the this keyword can refer inside the new function. |
`...argArray` | any[] | A list of arguments to be passed to the new function.  |

**Returns:** *any*

___

###  call

▸ **call**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[call](_src_utils_utils_.debouncedfunction.md#call)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:285

Calls a method of an object, substituting another object for the current object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | [Function](_src_utils_utils_.debouncedfunction.md#function) | - |
`thisArg` | any | The object to be used as the current object. |
`...argArray` | any[] | A list of arguments to be passed to the method.  |

**Returns:** *any*

___

###  toString

▸ **toString**(): *string*

*Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[toString](_src_utils_utils_.debouncedfunction.md#tostring)*

Defined in node_modules/typescript/lib/lib.es5.d.ts:296

Returns a string representation of a function.

**Returns:** *string*
