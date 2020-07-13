[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/domUtils"](_src_utils_domutils_.md)

# Module: "src/utils/domUtils"

## Index

### Variables

- [DATA_ATTRIBUTE_PREFIX](_src_utils_domutils_.md#const-data_attribute_prefix)

### Functions

- [findCellElementsFromCol](_src_utils_domutils_.md#findcellelementsfromcol)
- [findDataContainerFromCurrent](_src_utils_domutils_.md#finddatacontainerfromcurrent)
- [findGridRootFromCurrent](_src_utils_domutils_.md#findgridrootfromcurrent)
- [findParentElementFromClassName](_src_utils_domutils_.md#findparentelementfromclassname)
- [getCellElementFromIndexes](_src_utils_domutils_.md#getcellelementfromindexes)
- [getDataFromElem](_src_utils_domutils_.md#getdatafromelem)
- [getFieldFromHeaderElem](_src_utils_domutils_.md#getfieldfromheaderelem)
- [getIdFromRowElem](_src_utils_domutils_.md#getidfromrowelem)
- [isCell](_src_utils_domutils_.md#iscell)
- [isHeaderCell](_src_utils_domutils_.md#isheadercell)
- [isOverflown](_src_utils_domutils_.md#isoverflown)

## Variables

### `Const` DATA_ATTRIBUTE_PREFIX

• **DATA_ATTRIBUTE_PREFIX**: _"data-"_ = "data-"

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:8](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L8)_

## Functions

### findCellElementsFromCol

▸ **findCellElementsFromCol**(`col`: HTMLElement): _NodeListOf‹Element› | null_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:37](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L37)_

**Parameters:**

| Name  | Type        |
| ----- | ----------- |
| `col` | HTMLElement |

**Returns:** _NodeListOf‹Element› | null_

---

### findDataContainerFromCurrent

▸ **findDataContainerFromCurrent**(`elem`: Element): _HTMLDivElement | null_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:55](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L55)_

**Parameters:**

| Name   | Type    |
| ------ | ------- |
| `elem` | Element |

**Returns:** _HTMLDivElement | null_

---

### findGridRootFromCurrent

▸ **findGridRootFromCurrent**(`elem`: Element): _HTMLDivElement | null_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:47](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L47)_

**Parameters:**

| Name   | Type    |
| ------ | ------- |
| `elem` | Element |

**Returns:** _HTMLDivElement | null_

---

### findParentElementFromClassName

▸ **findParentElementFromClassName**(`elem`: Element, `className`: string): _Element | null_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:14](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L14)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| `elem`      | Element |
| `className` | string  |

**Returns:** _Element | null_

---

### getCellElementFromIndexes

▸ **getCellElementFromIndexes**(`root`: Element, `__namedParameters`: object): _HTMLDivElement_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:63](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L63)_

**Parameters:**

▪ **root**: _Element_

▪ **\_\_namedParameters**: _object_

| Name       | Type   |
| ---------- | ------ |
| `colIndex` | number |
| `rowIndex` | number |

**Returns:** _HTMLDivElement_

---

### getDataFromElem

▸ **getDataFromElem**(`elem`: Element, `field`: string): _string_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:26](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L26)_

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `elem`  | Element |
| `field` | string  |

**Returns:** _string_

---

### getFieldFromHeaderElem

▸ **getFieldFromHeaderElem**(`colCellEl`: Element): _string_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:34](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L34)_

**Parameters:**

| Name        | Type    |
| ----------- | ------- |
| `colCellEl` | Element |

**Returns:** _string_

---

### getIdFromRowElem

▸ **getIdFromRowElem**(`rowEl`: Element): _string_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:30](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L30)_

**Parameters:**

| Name    | Type    |
| ------- | ------- |
| `rowEl` | Element |

**Returns:** _string_

---

### isCell

▸ **isCell**(`elem`: Element | null): _boolean_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L18)_

**Parameters:**

| Name   | Type                |
| ------ | ------------------- |
| `elem` | Element &#124; null |

**Returns:** _boolean_

---

### isHeaderCell

▸ **isHeaderCell**(`elem`: Element): _boolean_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:22](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L22)_

**Parameters:**

| Name   | Type    |
| ------ | ------- |
| `elem` | Element |

**Returns:** _boolean_

---

### isOverflown

▸ **isOverflown**(`element`: Element): _boolean_

_Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:10](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/utils/domUtils.ts#L10)_

**Parameters:**

| Name      | Type    |
| --------- | ------- |
| `element` | Element |

**Returns:** _boolean_
