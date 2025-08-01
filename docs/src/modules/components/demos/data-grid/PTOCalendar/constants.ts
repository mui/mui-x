export const FILTER_OPTIONS = ['holidays', 'vacation', 'sick'] as const;

export const FILTER_LABELS: Record<string, string> = {
  holidays: 'Public holidays',
  vacation: 'Vacation',
  sick: 'Sick leave',
};

export const FILTER_COLORS: Record<
  (typeof FILTER_OPTIONS)[number],
  { light: React.CSSProperties; dark: React.CSSProperties }
> = {
  holidays: {
    light: {
      backgroundColor: '#edf2fe',
      color: '#2D4492',
      borderColor: '#e1e9ff',
    },
    dark: {
      backgroundColor: '#1f2d5c',
      color: '#d2deff',
      borderColor: '#3a5bc7',
    },
  },
  vacation: {
    light: {
      backgroundColor: '#e6f7ed',
      color: '#1F5F4D',
      borderColor: '#d6f1e3',
    },
    dark: {
      backgroundColor: '#1d3b31',
      color: '#c3e9d7',
      borderColor: '#208368',
    },
  },
  sick: {
    light: {
      backgroundColor: '#fff7f7',
      color: '#99222A',
      borderColor: '#feebec',
    },
    dark: {
      backgroundColor: '#641723',
      color: '#ffdbdc',
      borderColor: '#ce2c31',
    },
  },
};

const currentYear = new Date().getFullYear();

export const DATE_CONSTRAINTS = {
  minDate: new Date(currentYear, 0, 1),
  maxDate: new Date(currentYear, 11, 31),
};
