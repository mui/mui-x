[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["lib/lodash/toNumber"](_lib_lodash_tonumber_.md)

# Module: "lib/lodash/toNumber"

## Index

### Variables

- [NAN](_lib_lodash_tonumber_.md#nan)
- [freeParseInt](_lib_lodash_tonumber_.md#freeparseint)
- [reIsBadHex](_lib_lodash_tonumber_.md#reisbadhex)
- [reIsBinary](_lib_lodash_tonumber_.md#reisbinary)
- [reIsOctal](_lib_lodash_tonumber_.md#reisoctal)
- [reTrim](_lib_lodash_tonumber_.md#retrim)

### Lang Functions

- [toNumber](_lib_lodash_tonumber_.md#tonumber)

## Variables

### NAN

• **NAN**: _number_ = 0 / 0

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:7](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L7)_

Used as references for various `Number` constants.

---

### freeParseInt

• **freeParseInt**: _parseInt_ = parseInt

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L22)_

Built-in method references without a dependency on `root`.

---

### reIsBadHex

• **reIsBadHex**: _RegExp‹›_ = /^[-+]0x[0-9a-f]+\$/i

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:13](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L13)_

Used to detect bad signed hexadecimal string values.

---

### reIsBinary

• **reIsBinary**: _RegExp‹›_ = /^0b[01]+\$/i

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:16](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L16)_

Used to detect binary string values.

---

### reIsOctal

• **reIsOctal**: _RegExp‹›_ = /^0o[0-7]+\$/i

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:19](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L19)_

Used to detect octal string values.

---

### reTrim

• **reTrim**: _RegExp‹›_ = /^\s+|\s+\$/g

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L10)_

Used to match leading and trailing whitespace.

## Lang Functions

### toNumber

▸ **toNumber**(`value`: any): _number_

_Defined in [packages/grid/x-grid-modules/lib/lodash/toNumber.js:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/lib/lodash/toNumber.js#L47)_

Converts `value` to a number.

**`static`**

**`memberof`** \_

**`since`** 4.0.0

**`example`**

\_.toNumber(3.2);
// => 3.2

\_.toNumber(Number.MIN_VALUE);
// => 5e-324

\_.toNumber(Infinity);
// => Infinity

\_.toNumber('3.2');
// => 3.2

**Parameters:**

| Name    | Type | Description           |
| ------- | ---- | --------------------- |
| `value` | any  | The value to process. |

**Returns:** _number_

Returns the number.
