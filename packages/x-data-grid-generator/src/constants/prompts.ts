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
      error: null,
    },
  ],
]);
