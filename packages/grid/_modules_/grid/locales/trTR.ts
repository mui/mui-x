import { trTR as trTRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const trTRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Satır yok',
  noResultsOverlayLabel: 'Sonuç bulunamadı.',
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
  toolbarExportPrint: 'Yazdır',

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
  filterOperatorIsAnyOf: 'herhangi biri',

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
  checkboxSelectionHeaderName: 'Seçim',

  // Boolean cell text
  // booleanCellTrueLabel: 'true',
  // booleanCellFalseLabel: 'false',

  // Actions cell more text
  actionsCellMore: 'daha fazla',

  // Column pinning text
  pinToLeft: 'Sola sabitle',
  pinToRight: 'Sağa sabitle',
  unpin: 'Sabitlemeyi kaldır',

  // Tree Data
  treeDataGroupingHeaderName: 'Grup',
  treeDataExpand: 'göster',
  treeDataCollapse: 'gizle',

  // Grouping columns
  groupingColumnHeaderName: 'Grup',
  groupColumn: (name) => `${name} için grupla`,
  unGroupColumn: (name) => `${name} için gruplamayı kaldır`,

  // Master/detail
  expandDetailPanel: 'Genişlet',
  collapseDetailPanel: 'Gizle',
};

export const trTR: Localization = getGridLocalization(trTRGrid, trTRCore);
