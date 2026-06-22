import * as React from 'react';
import {
  DataGrid,
  GridFilterInputMultipleValue,
  type GridFilterInputMultipleValueProps,
  type GridFilterModel,
  GridPreferencePanelsValue,
  getGridStringOperators,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['commodity', 'traderName', 'quantity', 'filledQuantity'];

type RootSlotProps = NonNullable<
  NonNullable<GridFilterInputMultipleValueProps['slotProps']>['root']
>;
type PasteableRootSlotProps = RootSlotProps & {
  onPaste?: React.ClipboardEventHandler;
};

function normalizeArrayValues(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.flatMap((entry) => {
    const entryType = typeof entry;
    if (
      entryType === 'string' ||
      entryType === 'number' ||
      entryType === 'boolean'
    ) {
      const normalizedEntry = String(entry).trim();
      return normalizedEntry === '' ? [] : [normalizedEntry];
    }

    return [];
  });
}

function parseStringArrayLiteral(value: string): string[] | undefined {
  let index = 0;
  const result: string[] = [];

  const skipWhitespace = () => {
    while (index < value.length && /\s/.test(value[index])) {
      index += 1;
    }
  };

  const readQuotedString = (quote: "'" | '"') => {
    let currentValue = '';
    index += 1;

    while (index < value.length) {
      const character = value[index];

      if (character === '\\') {
        index += 1;

        if (index >= value.length) {
          return undefined;
        }

        const escapedCharacter = value[index];

        switch (escapedCharacter) {
          case 'n':
            currentValue += '\n';
            break;
          case 'r':
            currentValue += '\r';
            break;
          case 't':
            currentValue += '\t';
            break;
          default:
            currentValue += escapedCharacter;
            break;
        }

        index += 1;
        continue;
      }

      if (character === quote) {
        index += 1;
        return currentValue.trim();
      }

      currentValue += character;
      index += 1;
    }

    return undefined;
  };

  skipWhitespace();

  if (value[index] !== '[') {
    return undefined;
  }

  index += 1;

  while (index < value.length) {
    skipWhitespace();

    if (value[index] === ']') {
      index += 1;
      skipWhitespace();
      return index === value.length ? result : undefined;
    }

    const quote = value[index];
    if (quote !== "'" && quote !== '"') {
      return undefined;
    }

    const parsedValue = readQuotedString(quote);
    if (parsedValue == null) {
      return undefined;
    }

    if (parsedValue !== '') {
      result.push(parsedValue);
    }

    skipWhitespace();

    if (value[index] === ',') {
      index += 1;
      continue;
    }

    if (value[index] === ']') {
      continue;
    }

    return undefined;
  }

  return undefined;
}

function parsePastedArray(value: string): string[] | undefined {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return undefined;
  }

  if (!trimmedValue.startsWith('[') || !trimmedValue.endsWith(']')) {
    return undefined;
  }

  try {
    return normalizeArrayValues(JSON.parse(trimmedValue));
  } catch {
    return parseStringArrayLiteral(trimmedValue);
  }
}

function PasteableFilterInput(props: GridFilterInputMultipleValueProps) {
  const { applyValue, item, slotProps, ...other } = props;
  const rootSlotProps = slotProps?.root as PasteableRootSlotProps | undefined;

  const handlePaste = React.useCallback<React.ClipboardEventHandler>(
    (event) => {
      rootSlotProps?.onPaste?.(event);

      if (event.defaultPrevented) {
        return;
      }

      const pastedValues = parsePastedArray(event.clipboardData.getData('text'));

      if (pastedValues == null) {
        return;
      }

      event.preventDefault();

      const currentValues = Array.isArray(item.value) ? item.value.map(String) : [];
      const nextValues = Array.from(new Set([...currentValues, ...pastedValues]));

      applyValue({
        ...item,
        value: nextValues,
      });
    },
    [applyValue, item, rootSlotProps],
  );

  return (
    <GridFilterInputMultipleValue
      {...other}
      item={item}
      applyValue={applyValue}
      slotProps={{
        ...slotProps,
        root: {
          ...rootSlotProps,
          onPaste: handlePaste,
        } as RootSlotProps,
      }}
    />
  );
}

const commodityFilterOperators = getGridStringOperators().map((operator) =>
  operator.value === 'isAnyOf'
    ? {
        ...operator,
        InputComponent: PasteableFilterInput,
      }
    : operator,
);

export default function PasteListIntoIsAnyOf() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        id: 1,
        field: 'commodity',
        operator: 'isAnyOf',
        value: ['Oats', 'Cocoa', 'Coffee C'],
      },
    ],
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) =>
        column.field === 'commodity'
          ? {
              ...column,
              minWidth: 200,
              filterOperators: commodityFilterOperators,
            }
          : column,
      ),
    [data.columns],
  );

  return (
    <div style={{ height: 460, width: '100%' }}>
      <DataGrid
        rows={data.rows}
        columns={columns}
        loading={loading}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}
