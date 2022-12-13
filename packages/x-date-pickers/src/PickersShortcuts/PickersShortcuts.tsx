import * as React from 'react';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { DateOrTimeView, useUtils } from '../internals';
// import { useLocaleText } from '@mui/x-date-pickers/src/internals/hooks/useUtils';

export interface PickersShortcutsItems<TValue> {
  label: string;
  getValue: (value: TValue, view: any, isValid: (value: TValue) => boolean, adapter: any) => TValue;
}

export interface PickersShortcutsProps<TValue, TView extends DateOrTimeView>
  extends Omit<ListProps, 'onChange'> {
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default `[]`
   */
  shortcuts?: PickersShortcutsItems<TValue>[];
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
    const newValue = item.getValue(value, view, isValid, utils);
    console.log({ newValue });
    return {
      label: item.label,
      onClick: () => {
        console.log('click');
        onChange(newValue);
      },
    };
  });

  return (
    <List {...other}>
      {items.map((item) => {
        console.log(item);
        return (
          <ListItem key={item.label}>
            <Chip {...item} />
          </ListItem>
        );
      })}
    </List>
  );
}
