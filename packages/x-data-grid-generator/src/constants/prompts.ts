import { PromptResponse } from '@mui/x-data-grid-premium';

export const mockPrompts = new Map<string, PromptResponse>([
  [
    'sort by name',
    {
      select: -1,
      filters: [],
      aggregation: {},
      sorting: [
        {
          column: 'name',
          direction: 'asc',
        },
      ],
      grouping: [],
      pivoting: {},
      error: null,
    },
  ],
  [
    'sort by company name and employee name',
    {
      select: -1,
      filters: [],
      aggregation: {},
      sorting: [
        {
          column: 'company',
          direction: 'asc',
        },
        {
          column: 'name',
          direction: 'asc',
        },
      ],
      grouping: [],
      pivoting: {},
      error: null,
    },
  ],
  [
    'show people from the eu',
    {
      select: -1,
      filters: [
        {
          column: 'country',
          operator: 'isAnyOf',
          value: [
            'AT',
            'BE',
            'BG',
            'CY',
            'CZ',
            'DE',
            'DK',
            'EE',
            'ES',
            'FI',
            'FR',
            'GR',
            'HR',
            'HU',
            'IE',
            'IT',
            'LT',
            'LU',
            'LV',
            'MT',
            'NL',
            'PL',
            'PT',
            'RO',
            'SE',
            'SI',
            'SK',
          ],
        },
      ],
      aggregation: {},
      sorting: [],
      grouping: [],
      pivoting: {},
      error: null,
    },
  ],
  [
    'order companies by amount of people',
    {
      select: -1,
      filters: [],
      aggregation: {
        id: 'size',
      },
      sorting: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      grouping: [
        {
          column: 'company',
        },
      ],
      pivoting: {},
      error: null,
    },
  ],
]);
