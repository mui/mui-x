export const FILTER_OPTIONS = ['holidays', 'vacation', 'sick'] as const;

export const FILTER_LABELS: Record<string, string> = {
  holidays: 'Public Holidays',
  vacation: 'Vacation',
  sick: 'Sick Leave',
};

export const FILTER_COLORS = {
  holidays: {
    background: '#D2DEFF',
    text: '#3E63DD',
    border: '#D2DEFF',
    dark: {
      background: '#1e2429',
      text: '#8BA4FF',
      border: '#1e2429',
    },
  },
  vacation: {
    background: '#C3E9D7',
    text: '#208368',
    border: '#C3E9D7',
    dark: {
      background: '#1e2429',
      text: '#4ECB9E',
      border: '#1e2429',
    },
  },
  sick: {
    background: '#fffaa0',
    text: '#807d50',
    border: '#fffaa0',
    dark: {
      background: '#1e2429',
      text: '#FFE066',
      border: '#1e2429',
    },
  },
};

export const DEMO_YEAR = 2025;
export const DEMO_MONTH = 4;

export const DATE_CONSTRAINTS = {
  minDate: new Date(DEMO_YEAR, 0, 1),
  maxDate: new Date(DEMO_YEAR, 11, 31),
};
