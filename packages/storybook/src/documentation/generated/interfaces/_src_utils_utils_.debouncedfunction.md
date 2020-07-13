[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/utils"](../modules/_src_utils_utils_.md) › [DebouncedFunction](_src_utils_utils_.debouncedfunction.md)

# Interface: DebouncedFunction

## Hierarchy

- [Function](_src_utils_utils_.debouncedfunction.md#function)

  ↳ **DebouncedFunction**

## Index

### Properties

- [Function](_src_utils_utils_.debouncedfunction.md#function)
- [arguments](_src_utils_utils_.debouncedfunction.md#arguments)
- [caller](_src_utils_utils_.debouncedfunction.md#caller)
- [cancel](_src_utils_utils_.debouncedfunction.md#cancel)
- [flush](_src_utils_utils_.debouncedfunction.md#flush)
- [length](_src_utils_utils_.debouncedfunction.md#readonly-length)
- [name](_src_utils_utils_.debouncedfunction.md#readonly-name)
- [prototype](_src_utils_utils_.debouncedfunction.md#prototype)

### Methods

- [[Symbol.hasInstance]](_src_utils_utils_.debouncedfunction.md#[symbol.hasinstance])
- [apply](_src_utils_utils_.debouncedfunction.md#apply)
- [bind](_src_utils_utils_.debouncedfunction.md#bind)
- [call](_src_utils_utils_.debouncedfunction.md#call)
- [toString](_src_utils_utils_.debouncedfunction.md#tostring)

## Properties

### Function

• **Function**: _FunctionConstructor_

Defined in node_modules/typescript/lib/lib.es5.d.ts:316

---

### arguments

• **arguments**: _any_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[arguments](_src_utils_utils_.debouncedfunction.md#arguments)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:302

---

### caller

• **caller**: _[Function](_src_utils_utils_.debouncedfunction.md#function)_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[caller](_src_utils_utils_.debouncedfunction.md#caller)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:303

---

### cancel

• **cancel**: _function_

_Defined in [packages/grid/x-grid-modules/src/utils/utils.ts:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/utils.ts#L7)_

#### Type declaration:

▸ (): _void_

---

### flush

• **flush**: _function_

_Defined in [packages/grid/x-grid-modules/src/utils/utils.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/utils.ts#L8)_

#### Type declaration:

▸ (): _void_

---

### `Readonly` length

• **length**: _number_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[length](_src_utils_utils_.debouncedfunction.md#readonly-length)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:299

---

### `Readonly` name

• **name**: _string_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[name](_src_utils_utils_.debouncedfunction.md#readonly-name)_

Defined in node_modules/typescript/lib/lib.es2015.core.d.ts:97

Returns the name of the function. Function names are read-only and can not be changed.

---

### prototype

• **prototype**: _any_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[prototype](_src_utils_utils_.debouncedfunction.md#prototype)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:298

## Methods

### [Symbol.hasInstance]

▸ **[Symbol.hasInstance]**(`value`: any): _boolean_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[[Symbol.hasInstance]](_src_utils_utils_.debouncedfunction.md#[symbol.hasinstance])_

Defined in node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:157

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

**Parameters:**

| Name    | Type |
| ------- | ---- |
| `value` | any  |

**Returns:** _boolean_

---

### apply

▸ **apply**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, `argArray?`: any): _any_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[apply](_src_utils_utils_.debouncedfunction.md#apply)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:278

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

**Parameters:**

| Name        | Type                                                        | Description                                      |
| ----------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `this`      | [Function](_src_utils_utils_.debouncedfunction.md#function) | -                                                |
| `thisArg`   | any                                                         | The object to be used as the this object.        |
| `argArray?` | any                                                         | A set of arguments to be passed to the function. |

**Returns:** _any_

---

### bind

▸ **bind**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, ...`argArray`: any[]): _any_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[bind](_src_utils_utils_.debouncedfunction.md#bind)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:293

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

**Parameters:**

| Name          | Type                                                        | Description                                                            |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| `this`        | [Function](_src_utils_utils_.debouncedfunction.md#function) | -                                                                      |
| `thisArg`     | any                                                         | An object to which the this keyword can refer inside the new function. |
| `...argArray` | any[]                                                       | A list of arguments to be passed to the new function.                  |

**Returns:** _any_

---

### call

▸ **call**(`this`: [Function](_src_utils_utils_.debouncedfunction.md#function), `thisArg`: any, ...`argArray`: any[]): _any_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[call](_src_utils_utils_.debouncedfunction.md#call)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:285

Calls a method of an object, substituting another object for the current object.

**Parameters:**

| Name          | Type                                                        | Description                                     |
| ------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `this`        | [Function](_src_utils_utils_.debouncedfunction.md#function) | -                                               |
| `thisArg`     | any                                                         | The object to be used as the current object.    |
| `...argArray` | any[]                                                       | A list of arguments to be passed to the method. |

**Returns:** _any_

---

### toString

▸ **toString**(): _string_

_Inherited from [DebouncedFunction](_src_utils_utils_.debouncedfunction.md).[toString](_src_utils_utils_.debouncedfunction.md#tostring)_

Defined in node_modules/typescript/lib/lib.es5.d.ts:296

Returns a string representation of a function.

**Returns:** _string_
