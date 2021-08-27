import { generateUtilityClasses } from './utils/material-ui-utils';

export interface GridClasses {
  root: string;
  row: string;
  'row--editing': string;
  cell: string;
  withBorder: string;
  'cell--editing': string;
  'cell--editable': string;
  'cell--withRenderer': string;
  'cell--textLeft': string;
  'cell--textCenter': string;
  'cell--textRight': string;
  columnHeader: string;
  'columnHeader--dragging': string;
  columnHeaderWrapper: string;
  scrollArea: string;
  'scrollArea--left': string;
  'scrollArea--right': string;
  columnsContainer: string;
  toolbarContainer: string;
  overlay: string;
  main: string;
  dataContainer: string;
  window: string;
  windowContainer: string;
  viewport: string;
  autoHeight: string;
  columnHeaderCheckbox: string;
  cellCheckbox: string;
  'columnHeader--sorted': string;
  'columnHeader--sortable': string;
  'columnHeader--moving': string;
  'columnHeader--numeric': string;
  'columnHeader--alignLeft': string;
  'columnHeader--alignCenter': string;
  'columnHeader--alignRight': string;
  columnHeaderDraggableContainer: string;
  columnHeaderTitle: string;
  iconButtonContainer: string;
  sortIcon: string;
  filterIcon: string;
  menuIcon: string;
  menuIconButton: string;
  columnHeaderTitleContainer: string;
  columnSeparator: string;
  'columnSeparator--resizable': string;
  iconSeparator: string;
  menuOpen: string;
  editInputCell: string;
  editBooleanCell: string;
  booleanCell: string;
  checkboxInput: string;
  rowCount: string;
  selectedRowCount: string;
  footerContainer: string;
  columnHeaderDropZone: string;
  renderingZone: string;
}

export const gridClasses : GridClasses = generateUtilityClasses('MuiDataGrid', [
  'root',
  'row',
  'row--editing',
  'cell',
  'withBorder',
  'cell--editing',
  'cell--editable',
  'cell--withRenderer',
  'cell--textLeft',
  'cell--textCenter',
  'cell--textRight',
  'columnHeader',
  'columnHeader--dragging',
  'columnHeaderWrapper',
  'scrollArea',
  'scrollArea--left',
  'scrollArea--right',
  'columnsContainer',
  'toolbarContainer',
  'overlay',
  'main',
  'dataContainer',
  'window',
  'windowContainer',
  'viewport',
  'autoHeight',
  'columnHeaderCheckbox',
  'cellCheckbox',
  'columnHeader--sorted',
  'columnHeader--sortable',
  'columnHeader--moving',
  'columnHeader--numeric',
  'columnHeader--alignLeft',
  'columnHeader--alignCenter',
  'columnHeader--alignRight',
  'columnHeaderDraggableContainer',
  'columnHeaderTitle',
  'iconButtonContainer',
  'sortIcon',
  'filterIcon',
  'menuIcon',
  'menuIconButton',
  'columnHeaderTitleContainer',
  'columnSeparator',
  'columnSeparator--resizable',
  'iconSeparator',
  'menuOpen',
  'editInputCell',
  'editBooleanCell',
  'booleanCell',
  'checkboxInput',
  'rowCount',
  'selectedRowCount',
  'footerContainer',
  'columnHeaderDropZone',
  'renderingZone',
]);
