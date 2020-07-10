[@material-ui/x-grid-modules](../README.md) › [Globals](../globals.md) › ["src/components/row-cells"](_src_components_row_cells_.md)

# Module: "src/components/row-cells"

## Index

### Interfaces

* [RowCellsProps](../interfaces/_src_components_row_cells_.rowcellsprops.md)

### Variables

* [RowCells](_src_components_row_cells_.md#const-rowcells)

### Functions

* [applyCssClassRules](_src_components_row_cells_.md#applycssclassrules)
* [getCellParams](_src_components_row_cells_.md#getcellparams)

## Variables

### `Const` RowCells

• **RowCells**: *React.FC‹[RowCellsProps](../interfaces/_src_components_row_cells_.rowcellsprops.md)›* = React.memo(props => {
  const {
    scrollSize,
    hasScroll,
    lastColIdx,
    firstColIdx,
    columns,
    row,
    rowIndex,
    domIndex,
  } = props;
  const api = React.useContext(ApiContext);

  const cellProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const isLastColumn = firstColIdx + colIdx === columns.length - 1;
    const removeScrollWidth = isLastColumn && hasScroll.y && hasScroll.x;
    const width = removeScrollWidth ? column.width! - scrollSize : column.width!;
    const removeLastBorderRight = isLastColumn && hasScroll.x && !hasScroll.y;
    const showRightBorder = !isLastColumn
      ? props.showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    let value = row.data[column.field!];
    if (column.valueGetter) {
      const params: ValueGetterParams = getCellParams(row, column, rowIndex, value, api!.current!);
      //Value getter override the original value
      value = column.valueGetter(params);
    }

    let formattedValueProp = {};
    if (column.valueFormatter) {
      const params: ValueFormatterParams = getCellParams(
        row,
        column,
        rowIndex,
        value,
        api!.current!,
      );
      formattedValueProp = { formattedValue: column.valueFormatter(params) };
    }

    let cssClassProp = { cssClass: '' };
    if (column.cellClass) {
      if (!isFunction(column.cellClass)) {
        cssClassProp = { cssClass: classnames(column.cellClass) };
      } else {
        const params: CellClassParams = getCellParams(row, column, rowIndex, value, api!.current!);
        cssClassProp = { cssClass: column.cellClass(params) as string };
      }
    }

    if (column.cellClassRules) {
      const params: CellClassParams = getCellParams(row, column, rowIndex, value, api!.current!);
      const cssClass = applyCssClassRules(column.cellClassRules, params);
      cssClassProp = { cssClass: cssClassProp.cssClass + ' ' + cssClass };
    }

    let cellComponent: React.ReactElement | null = null;
    if (column.cellRenderer) {
      const params: CellParams = getCellParams(row, column, rowIndex, value, api!.current!);
      cellComponent = column.cellRenderer(params);
      cssClassProp = { cssClass: cssClassProp.cssClass + ' with-renderer' };
    }

    const cellProps: GridCellProps & { children: any } = {
      value: value,
      field: column.field,
      width: width,
      showRightBorder: showRightBorder,
      ...formattedValueProp,
      align: column.align,
      ...cssClassProp,
      tabIndex: domIndex === 0 && colIdx === 0 ? 0 : -1,
      rowIndex: rowIndex,
      colIndex: colIdx + firstColIdx,
      children: cellComponent,
    };

    return cellProps;
  });

  return (
    <>
      {cellProps.map(props => (
        <Cell key={props.field} {...props} />
      ))}
    </>
  );
})

*Defined in [packages/grid/x-grid-modules/src/components/row-cells.tsx:57](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/row-cells.tsx#L57)*

## Functions

###  applyCssClassRules

▸ **applyCssClassRules**(`cellClassRules`: [CellClassRules](_src_models_coldef_coldef_.md#cellclassrules), `params`: [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams)): *string*

*Defined in [packages/grid/x-grid-modules/src/components/row-cells.tsx:36](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/row-cells.tsx#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`cellClassRules` | [CellClassRules](_src_models_coldef_coldef_.md#cellclassrules) |
`params` | [CellClassParams](_src_models_coldef_coldef_.md#cellclassparams) |

**Returns:** *string*

___

###  getCellParams

▸ **getCellParams**(`rowModel`: [RowModel](../interfaces/_src_models_rows_.rowmodel.md), `col`: [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md), `rowIndex`: number, `value`: [CellValue](_src_models_rows_.md#cellvalue), `api`: [GridApi](_src_models_gridapi_.md#gridapi)): *[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)*

*Defined in [packages/grid/x-grid-modules/src/components/row-cells.tsx:18](https://github.com/mui-org/material-ui-x/blob/a679779/packages/grid/x-grid-modules/src/components/row-cells.tsx#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`rowModel` | [RowModel](../interfaces/_src_models_rows_.rowmodel.md) |
`col` | [ColDef](../interfaces/_src_models_coldef_coldef_.coldef.md) |
`rowIndex` | number |
`value` | [CellValue](_src_models_rows_.md#cellvalue) |
`api` | [GridApi](_src_models_gridapi_.md#gridapi) |

**Returns:** *[CellParams](../interfaces/_src_models_coldef_coldef_.cellparams.md)*
