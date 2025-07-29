export interface PTOData {
  [key: string]: {
    ptoDates: string[];
    sickDates: string[];
    nationality: string;
    team: string;
    birthday: string;
    avatar: string;
  };
}

export interface RowData {
  id: number;
  employee: string;
  [key: string]:
    | string
    | number
    | boolean
    | {
        hasPTO: boolean;
        hasSick: boolean;
        hasHoliday: boolean;
        show: boolean;
      };
}

export type FilterType = 'holidays' | 'vacation' | 'sick';

export interface HolidayData {
  [country: string]: {
    [date: string]: string;
  };
}

export interface EmployeeStatus {
  isOutToday: boolean;
  isPresentToday: boolean;
}
