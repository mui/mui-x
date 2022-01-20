import { ruRU as ruRUCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const ruRUGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Нет строк',
  noResultsOverlayLabel: 'Данные не найдены.',
  errorOverlayDefaultLabel: 'Обнаружена ошибка.',

  // Density selector toolbar button text
  toolbarDensity: 'Высота строки',
  toolbarDensityLabel: 'Высота строки',
  toolbarDensityCompact: 'Компактная',
  toolbarDensityStandard: 'Стандартная',
  toolbarDensityComfortable: 'Комфортная',

  // Columns selector toolbar button text
  toolbarColumns: 'Столбцы',
  toolbarColumnsLabel: 'Выделите столбцы',

  // Filters toolbar button text
  toolbarFilters: 'Фильтры',
  toolbarFiltersLabel: 'Показать фильтры',
  toolbarFiltersTooltipHide: 'Скрыть фильтры',
  toolbarFiltersTooltipShow: 'Показать фильтры',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'активных фильтров';
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'активных фильтра';
    } else if (lastDigit === 1) {
      pluralForm = 'активный фильтр';
    }

    return `${count} ${pluralForm}`;
  },

  // Export selector toolbar button text
  toolbarExport: 'Экспорт',
  toolbarExportLabel: 'Экспорт',
  toolbarExportCSV: 'Скачать в формате CSV',
  toolbarExportPrint: 'Печать',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Найти столбец',
  columnsPanelTextFieldPlaceholder: 'Заголовок столбца',
  columnsPanelDragIconLabel: 'Изменить порядок столбца',
  columnsPanelShowAllButton: 'Показать все',
  columnsPanelHideAllButton: 'Скрыть все',

  // Filter panel text
  filterPanelAddFilter: 'Добавить фильтр',
  filterPanelDeleteIconLabel: 'Удалить',
  filterPanelOperators: 'Операторы',
  filterPanelOperatorAnd: 'И',
  filterPanelOperatorOr: 'Или',
  filterPanelColumns: 'Столбцы',
  filterPanelInputLabel: 'Значение',
  filterPanelInputPlaceholder: 'Значение фильтра',

  // Filter operators text
  filterOperatorContains: 'содержит',
  filterOperatorEquals: 'равен',
  filterOperatorStartsWith: 'начинается с',
  filterOperatorEndsWith: 'заканчивается на',
  filterOperatorIs: 'равен',
  filterOperatorNot: 'не равен',
  filterOperatorAfter: 'больше чем',
  filterOperatorOnOrAfter: 'больше или равно',
  filterOperatorBefore: 'меньше чем',
  filterOperatorOnOrBefore: 'меньше или равно',
  filterOperatorIsEmpty: 'пустой',
  filterOperatorIsNotEmpty: 'не пустой',

  // Filter values text
  filterValueAny: 'любой',
  filterValueTrue: 'истина',
  filterValueFalse: 'ложь',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показать столбцы',
  columnMenuFilter: 'Фильтр',
  columnMenuHideColumn: 'Скрыть',
  columnMenuUnsort: 'Отменить сортировку',
  columnMenuSortAsc: 'Сортировать по возрастанию',
  columnMenuSortDesc: 'Сортировать по убыванию',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'активных фильтров';
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'активных фильтра';
    } else if (lastDigit === 1) {
      pluralForm = 'активный фильтр';
    }

    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Показать фильтры',
  columnHeaderSortIconLabel: 'Сортировать',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'строк выбрано';
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'строки выбраны';
    } else if (lastDigit === 1) {
      pluralForm = 'строка выбрана';
    }

    return `${count} ${pluralForm}`;
  },

  // Total rows footer text
  footerTotalRows: 'Всего строк:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} из ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Выбор флажка',

  // Boolean cell text
  booleanCellTrueLabel: 'истина',
  booleanCellFalseLabel: 'ложь',

  // Actions cell more text
  actionsCellMore: 'ещё',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  treeDataGroupingHeaderName: 'Группа',
  treeDataExpand: 'показать дочерние элементы',
  treeDataCollapse: 'скрыть дочерние элементы',

  // Grouping columns
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
};

export const ruRU: Localization = getGridLocalization(ruRUGrid, ruRUCore);
