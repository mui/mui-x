import * as React from 'react';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { DateOrTimeView } from '../internals';
import { useUtils } from '../internals/hooks/useUtils';
import { VIEW_HEIGHT } from '../internals/constants/dimensions';
// import { useLocaleText } from '@mui/x-date-pickers/src/internals/hooks/useUtils';

interface PickersShortcutsItemGetValueParams<TValue> {
  value: TValue;
  view: any;
  isValid: (value: TValue) => boolean;
  adapter: any;
}

export interface PickersShortcutsItem<TValue> {
  label: string;
  getValue: (params: PickersShortcutsItemGetValueParams<TValue>) => TValue;
}

export interface PickersShortcutsProps<TValue, TView extends DateOrTimeView>
  extends Omit<ListProps, 'onChange'> {
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default `[]`
   */
  shortcuts?: PickersShortcutsItem<TValue>[];
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  value: TValue;
  view: TView | null;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
  isValid: (value: TValue) => boolean;
}

export function PickersShortcuts<TValue, TDate, TView extends DateOrTimeView>(
  props: PickersShortcutsProps<TValue, TView>,
) {
  const { shortcuts, isLandscape, onChange, value, view, onViewChange, isValid, views, ...other } =
    props;
  const utils = useUtils<TDate>();

  if (shortcuts == null || shortcuts.length === 0) {
    return null;
  }

  const items = shortcuts.map((item) => {
    const newValue = item.getValue({ value, view, isValid, adapter: utils });

    return {
      label: item.label,
      onClick: () => {
        onChange(newValue);
      },
      disabled: !isValid(newValue),
    };
  });

  return (
    <List
      dense
      sx={[
        { maxHeight: VIEW_HEIGHT, overflow: 'auto' },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
      {...other}
    >
      {items.map((item) => {
        return (
          <ListItem key={item.label}>
            <Chip {...item} />
          </ListItem>
        );
      })}
    </List>
  );
}
