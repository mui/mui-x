import { trTR as trTRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const trTRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Satır yok',
  // noResultsOverlayLabel: 'No results found.',
  errorOverlayDefaultLabel: 'Bir hata oluştu.',

  // Density selector toolbar button text
  toolbarDensity: 'Yoğunluk',
  toolbarDensityLabel: 'Yoğunluk',
  toolbarDensityCompact: 'Sıkı',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Rahat',

  // Columns selector toolbar button text
  toolbarColumns: 'Sütunlar',
  toolbarColumnsLabel: 'Sütun seç',

  // Filters toolbar button text
  toolbarFilters: 'Filtreler',
  toolbarFiltersLabel: 'Filtreleri göster',
  toolbarFiltersTooltipHide: 'Filtreleri gizle',
  toolbarFiltersTooltipShow: 'Filtreleri göster',
  toolbarFiltersTooltipActive: (count) => `${count} aktif filtre`,

  // Export selector toolbar button text
  toolbarExport: 'Dışa aktar',
  toolbarExportLabel: 'Dışa aktar',
  toolbarExportCSV: 'CSV olarak aktar',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Sütun ara',
  columnsPanelTextFieldPlaceholder: 'Sütun adı',
  columnsPanelDragIconLabel: 'Sütunları yeniden sırala',
  columnsPanelShowAllButton: 'Hepsini göster',
  columnsPanelHideAllButton: 'Hepsini gizle',

  // Filter panel text
  filterPanelAddFilter: 'Filtre Ekle',
  filterPanelDeleteIconLabel: 'Kaldır',
  filterPanelOperators: 'Operatör',
  filterPanelOperatorAnd: 'Ve',
  filterPanelOperatorOr: 'Veya',
  filterPanelColumns: 'Sütunlar',
  filterPanelInputLabel: 'Değer',
  filterPanelInputPlaceholder: 'Filtre değeri',

  // Filter operators text
  filterOperatorContains: 'içerir',
  filterOperatorEquals: 'eşittir',
  filterOperatorStartsWith: 'ile başlar',
  filterOperatorEndsWith: 'ile biter',
  filterOperatorIs: 'eşittir',
  filterOperatorNot: 'eşit değildir',
  filterOperatorAfter: 'büyük',
  filterOperatorOnOrAfter: 'büyük eşit',
  filterOperatorBefore: 'küçük',
  filterOperatorOnOrBefore: 'küçük eşit',
  filterOperatorIsEmpty: 'boş',
  filterOperatorIsNotEmpty: 'dolu',

  // Filter values text
  // filterValueAny: 'any',
  // filterValueTrue: 'true',
  // filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuShowColumns: 'Sütunları göster',
  columnMenuFilter: 'Filtre uygula',
  columnMenuHideColumn: 'Gizle',
  columnMenuUnsort: 'Sıralama',
  columnMenuSortAsc: 'Sırala - Artan',
  columnMenuSortDesc: 'Sırala - Azalan',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} filtre aktif`,
  columnHeaderFiltersLabel: 'Filtreleri göster',
  columnHeaderSortIconLabel: 'Sırala',

  // Rows selected footer text
  footerRowSelected: (count) => `${count.toLocaleString()} satır seçildi`,

  // Total rows footer text
  footerTotalRows: 'Toplam Satır:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  // checkboxSelectionHeaderName: 'Checkbox selection',

  // Boolean cell text
  // booleanCellTrueLabel: 'true',
  // booleanCellFalseLabel: 'false',

  // Actions cell more text
  // actionsCellMore: 'more',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',

  // Grouping columns
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
};

export const trTR: Localization = getGridLocalization(trTRGrid, trTRCore);
