export const FILTER_OPTIONS = ['holidays', 'vacation', 'sick'] as const;

export const FILTER_LABELS: Record<string, string> = {
  holidays: 'Public holidays',
  vacation: 'Vacation',
  sick: 'Sick leave',
};

export const FILTER_COLORS = {
  holidays: {
    background: '#edf2fe',
    text: '#3E63DD',
    border: '#e1e9ff',
    dark: {
      background: '#1f2d5c',
      text: '#d2deff',
      border: '#3a5bc7',
    },
  },
  vacation: {
    background: '#e6f7ed',
    text: '#208368',
    border: '#d6f1e3',
    dark: {
      background: '#1d3b31',
      text: '#c3e9d7',
      border: '#208368',
    },
  },
  sick: {
    background: '#ffffd8',
    text: '#726c1c',
    border: '#f0edc3',
    dark: {
      background: '#3b310b',
      text: '#FFE066',
      border: '#877320',
    },
  },
};

export const DEMO_YEAR = 2025;
export const DEMO_MONTH = 4;

export const DATE_CONSTRAINTS = {
  minDate: new Date(DEMO_YEAR, 0, 1),
  maxDate: new Date(DEMO_YEAR, 11, 31),
};
