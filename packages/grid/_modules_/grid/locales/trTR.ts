import { trTR as trTRCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils';

const trTRGrid: Partial<GridLocaleText> = {
  // Root
  rootGridLabel: 'grid',
  noRowsLabel: 'Satır yok',
  errorOverlayDefaultLabel: 'Bir hata oluştu.',

  // Density selector toolbar button text
  toolbarDensity: 'Sıkılık',
  toolbarDensityLabel: 'Sıkılık',
  toolbarDensityCompact: 'Sıkı',
  toolbarDensityStandard: 'Standart',
  toolbarDensityComfortable: 'Rahat',

  // Columns selector toolbar button text
  toolbarColumns: 'Sütunlar',
  toolbarColumnsLabel: 'Sütun seç',

  // Filters toolbar button text
  toolbarFilters: 'Filtreler',
  toolbarFiltersLabel: 'Filtreleri göster',
  toolbarFiltersTooltipHide: 'Filtreleri Gizle',
  toolbarFiltersTooltipShow: 'Filtreleri göster',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} aktif filtre` : `${count} aktif filtre`,

  // Export selector toolbar button text
  toolbarExport: 'Dışa aktar',
  toolbarExportLabel: 'Dışa aktar',
  toolbarExportCSV: 'CSV olarak aktar',

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

  // Column menu text
  columnMenuLabel: 'Menü',
  columnMenuShowColumns: 'Sütunları göster',
  columnMenuFilter: 'Filtre uygula',
  columnMenuHideColumn: 'Gizle',
  columnMenuUnsort: 'Sıralama',
  columnMenuSortAsc: 'Sırala - Artan',
  columnMenuSortDesc: 'Sırala - Azalan',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtre aktif` : `${count} filtre aktif`,
  columnHeaderFiltersLabel: 'Filtreleri göster',
  columnHeaderSortIconLabel: 'Sırala',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} satır seçildi`
      : `${count.toLocaleString()} satır seçildi`,

  // Total rows footer text
  footerTotalRows: 'Toplam Satır:',
};

export const trTR: Localization = getGridLocalization(trTRGrid, trTRCore);
