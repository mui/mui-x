export const FILTER_OPTIONS = ['holidays', 'vacation', 'sick'] as const;

export const FILTER_LABELS: Record<string, string> = {
  holidays: 'Public holidays',
  vacation: 'Vacation',
  sick: 'Sick leave',
};

export const FILTER_COLORS = {
  holidays: {
    background: '#edf2fe',
    text: '#2D4492',
    border: '#e1e9ff',
    dark: {
      background: '#1f2d5c',
      text: '#d2deff',
      border: '#3a5bc7',
    },
  },
  vacation: {
    background: '#e6f7ed',
    text: '#1F5F4D',
    border: '#d6f1e3',
    dark: {
      background: '#1d3b31',
      text: '#c3e9d7',
      border: '#208368',
    },
  },
  sick: {
    background: '#fff7f7',
    text: '#99222A',
    border: '#feebec',
    dark: {
      background: '#641723',
      text: '#ffdbdc',
      border: '#ce2c31',
    },
  },
};

const currentYear = new Date().getFullYear();

export const DATE_CONSTRAINTS = {
  minDate: new Date(currentYear, 0, 1),
  maxDate: new Date(currentYear, 11, 31),
};
