export const bgBG = {
  components: {
    MuiDataGrid: {
      defaultProps: {
        localeText: {
          // Root
          rootGridLabel: 'мрежа',
          noRowsLabel: 'Няма редове',
          errorOverlayDefaultLabel: 'Възникна грешка.',

          // Density selector toolbar button text
          toolbarDensity: 'Гъстота',
          toolbarDensityLabel: 'Гъстота',
          toolbarDensityCompact: 'Компактна',
          toolbarDensityStandard: 'Стандартна',
          toolbarDensityComfortable: 'Комфортна',

          // Columns selector toolbar button text
          toolbarColumns: 'Колони',
          toolbarColumnsLabel: 'Покажи селектора на колони',

          // Filters toolbar button text
          toolbarFilters: 'Филтри',
          toolbarFiltersLabel: 'Покажи Филтрите',
          toolbarFiltersTooltipHide: 'Скрий Филтрите',
          toolbarFiltersTooltipShow: 'Покажи Филтрите',
          toolbarFiltersTooltipActive: (count) => `${count} активни филтри`,

          // Columns panel text
          columnsPanelTextFieldLabel: 'Намери колона',
          columnsPanelTextFieldPlaceholder: 'Заглавие на колона',
          columnsPanelDragIconLabel: 'Пренареди на колона',
          columnsPanelShowAllButton: 'Покажи Всички',
          columnsPanelHideAllButton: 'Скрий Всички',

          // Filter panel text
          filterPanelAddFilter: 'Добави Филтър',
          filterPanelDeleteIconLabel: 'Изтрий',
          filterPanelOperators: 'Оператори',
          filterPanelOperatorAnd: 'И',
          filterPanelOperatorOr: 'Или',
          filterPanelColumns: 'Колони',

          // Filter operators text
          contains: 'съдържа',
          equals: 'равно',
          startsWith: 'започва с',
          endsWith: 'завършва с',
          is: 'е',
          not: 'не е',
          onOrAfter: 'е на или след',
          before: 'е преди',
          onOrBefore: 'е на или преди',

          // Column menu text
          columnMenuLabel: 'Меню',
          columnMenuShowColumns: 'Покажи колоните',
          columnMenuFilter: 'Филтри',
          columnMenuHideColumn: 'Скрий',
          columnMenuUnsort: 'Отмени сортирането',
          columnMenuSortAsc: 'Сортирай по възходящ ред',
          columnMenuSortDesc: 'Сортирай по низходящ ред',

          // Column header text
          columnHeaderFiltersTooltipActive: (count) => `${count} активни филтри`,
          columnHeaderFiltersLabel: 'Покажи Филтрите',
          columnHeaderSortIconLabel: 'Сортирай',

          // Rows selected footer text
          footerRowSelected: (count) =>
            count !== 1
              ? `${count.toLocaleString()} избрани редове`
              : `${count.toLocaleString()} избран ред`,

          // Total rows footer text
          footerTotalRows: 'Общо Rедове:',

          // Pagination footer text
          footerPaginationRowsPerPage: 'Редове на страница:',
        },
      },
    },
  },
};
