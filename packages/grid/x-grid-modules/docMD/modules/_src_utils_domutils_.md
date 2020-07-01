[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/utils/domUtils"](_src_utils_domutils_.md)

# Module: "src/utils/domUtils"

## Index

### Variables

* [DATA_ATTRIBUTE_PREFIX](_src_utils_domutils_.md#const-data_attribute_prefix)

### Functions

* [findCellElementsFromCol](_src_utils_domutils_.md#findcellelementsfromcol)
* [findDataContainerFromCurrent](_src_utils_domutils_.md#finddatacontainerfromcurrent)
* [findGridRootFromCurrent](_src_utils_domutils_.md#findgridrootfromcurrent)
* [findParentElementFromClassName](_src_utils_domutils_.md#findparentelementfromclassname)
* [getCellElementFromIndexes](_src_utils_domutils_.md#getcellelementfromindexes)
* [getDataFromElem](_src_utils_domutils_.md#getdatafromelem)
* [getFieldFromHeaderElem](_src_utils_domutils_.md#getfieldfromheaderelem)
* [getIdFromRowElem](_src_utils_domutils_.md#getidfromrowelem)
* [isCell](_src_utils_domutils_.md#iscell)
* [isHeaderCell](_src_utils_domutils_.md#isheadercell)
* [isOverflown](_src_utils_domutils_.md#isoverflown)

## Variables

### `Const` DATA_ATTRIBUTE_PREFIX

• **DATA_ATTRIBUTE_PREFIX**: *"data-"* = "data-"

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:8](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L8)*

## Functions

###  findCellElementsFromCol

▸ **findCellElementsFromCol**(`col`: HTMLElement): *NodeListOf‹Element› | null*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:37](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`col` | HTMLElement |

**Returns:** *NodeListOf‹Element› | null*

___

###  findDataContainerFromCurrent

▸ **findDataContainerFromCurrent**(`elem`: Element): *HTMLDivElement | null*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:55](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

**Returns:** *HTMLDivElement | null*

___

###  findGridRootFromCurrent

▸ **findGridRootFromCurrent**(`elem`: Element): *HTMLDivElement | null*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:47](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

**Returns:** *HTMLDivElement | null*

___

###  findParentElementFromClassName

▸ **findParentElementFromClassName**(`elem`: Element, `className`: string): *Element | null*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:14](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`className` | string |

**Returns:** *Element | null*

___

###  getCellElementFromIndexes

▸ **getCellElementFromIndexes**(`root`: Element, `__namedParameters`: object): *HTMLDivElement*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:63](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L63)*

**Parameters:**

▪ **root**: *Element*

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`colIndex` | number |
`rowIndex` | number |

**Returns:** *HTMLDivElement*

___

###  getDataFromElem

▸ **getDataFromElem**(`elem`: Element, `field`: string): *string*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:26](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L26)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |
`field` | string |

**Returns:** *string*

___

###  getFieldFromHeaderElem

▸ **getFieldFromHeaderElem**(`colCellEl`: Element): *string*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:34](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`colCellEl` | Element |

**Returns:** *string*

___

###  getIdFromRowElem

▸ **getIdFromRowElem**(`rowEl`: Element): *string*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:30](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L30)*

**Parameters:**

Name | Type |
------ | ------ |
`rowEl` | Element |

**Returns:** *string*

___

###  isCell

▸ **isCell**(`elem`: Element | null): *boolean*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:18](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element &#124; null |

**Returns:** *boolean*

___

###  isHeaderCell

▸ **isHeaderCell**(`elem`: Element): *boolean*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:22](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`elem` | Element |

**Returns:** *boolean*

___

###  isOverflown

▸ **isOverflown**(`element`: Element): *boolean*

*Defined in [packages/grid/x-grid-modules/src/utils/domUtils.ts:10](https://github.com/mui-org/material-ui-x/blob/02342a6/packages/grid/x-grid-modules/src/utils/domUtils.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`element` | Element |

**Returns:** *boolean*
