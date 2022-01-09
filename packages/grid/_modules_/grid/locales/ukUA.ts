import { ukUA as ukUACore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const getPluralFormForFilter = (count) => {
  let pluralForm = 'активних фільтрів';
  const lastDigit = count % 10;

  if (lastDigit > 1 && lastDigit < 5) {
    pluralForm = 'активних фільтра';
  } else if (lastDigit === 1) {
    pluralForm = 'активний фільтр';
  }

  return `${count} ${pluralForm}`;
}

const ukUAGrid: Partial<GridLocaleText> =  {
  // Root
  noRowsLabel: 'Немає рядків',
  noResultsOverlayLabel: 'Дані не знайдено.',
  errorOverlayDefaultLabel: 'Виявлено помилку.',

  // Density selector toolbar button text
  toolbarDensity: 'Висота рядка',
  toolbarDensityLabel: 'Висота рядка',
  toolbarDensityCompact: 'Компактний',
  toolbarDensityStandard: 'Стандартний',
  toolbarDensityComfortable: 'Комфортний',

  // Columns selector toolbar button text
  toolbarColumns: 'Стовпці',
  toolbarColumnsLabel: 'Виділіть стовпці',

  // Filters toolbar button text
  toolbarFilters: 'Фільтри',
  toolbarFiltersLabel: 'Показати фільтри',
  toolbarFiltersTooltipHide: 'Приховати фільтри',
  toolbarFiltersTooltipShow: 'Показати фільтри',
  toolbarFiltersTooltipActive: getPluralFormForFilter,

  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',
  toolbarExportPrint: 'Друк',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Знайти стовпець',
  columnsPanelTextFieldPlaceholder: 'Заголовок стовпця',
  columnsPanelDragIconLabel: 'Змінити порядок стовпця',
  columnsPanelShowAllButton: 'Показати все',
  columnsPanelHideAllButton: 'Приховати все',

  // Filter panel text
  filterPanelAddFilter: 'Додати фільтр',
  filterPanelDeleteIconLabel: 'Видалити',
  filterPanelOperators: 'Оператори',
  filterPanelOperatorAnd: 'І',
  filterPanelOperatorOr: 'Або',
  filterPanelColumns: 'Стовпці',
  filterPanelInputLabel: 'Значення',
  filterPanelInputPlaceholder: 'Значення фільтра',

  // Filter operators text
  filterOperatorContains: 'містить',
  filterOperatorEquals: 'дорівнює',
  filterOperatorStartsWith: 'починається з',
  filterOperatorEndsWith: 'закінчується на',
  filterOperatorIs: 'дорівнює',
  filterOperatorNot: 'не дорівнює',
  filterOperatorAfter: 'більше ніж',
  filterOperatorOnOrAfter: 'більше або дорівнює',
  filterOperatorBefore: 'менше ніж',
  filterOperatorOnOrBefore: 'менше або дорівнює',
  filterOperatorIsEmpty: 'порожній',
  filterOperatorIsNotEmpty: 'не пустий',

  // Filter values text
  filterValueAny: 'будь-який',
  filterValueTrue: 'правда',
  filterValueFalse: 'брехня',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показати стовпці',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Приховати',
  columnMenuUnsort: 'Скасувати сортування',
  columnMenuSortAsc: 'Сортувати за зростанням',
  columnMenuSortDesc: 'Сортувати за спаданням',

  // Column header text
  columnHeaderFiltersTooltipActive: getPluralFormForFilter,
  columnHeaderFiltersLabel: 'Показати фільтри',
  columnHeaderSortIconLabel: 'Сортувати',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'рядків вибраних';
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'рядки вибрані';
    } else if (lastDigit === 1) {
      pluralForm = 'рядок вибрано';
    }

    return `${count} ${pluralForm}`;
  },

  // Total rows footer text
  footerTotalRows: 'Усього рядків:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} з ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Вибір прапорця',

  // Boolean cell text
  booleanCellTrueLabel: 'правда',
  booleanCellFalseLabel: 'брехня',

  // Actions cell more text
  actionsCellMore: 'більше',

  // Column pinning text
  pinToLeft: 'Закріпити ліворуч',
  pinToRight: 'Закріпити праворуч',
  unpin: 'Відкріпити',

  // Tree Data
  treeDataGroupingHeaderName: 'Група',
  treeDataExpand: 'показати дочірні елементи',
  treeDataCollapse: 'приховати дочірні елементи',
};

export const ukUA: Localization = getGridLocalization(ukUAGrid, ukUACore);
