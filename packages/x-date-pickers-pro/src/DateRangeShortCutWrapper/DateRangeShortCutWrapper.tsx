import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export interface DateRangeShortCutWrapperProps {
  children?: React.ReactNode;
  isDateDisabled: any;
  position: 'start' | 'end' | 'top' | 'bottom',
  onSetValue: any;
}

const DateRangeShortCutWrapperRoot = styled('div')<{
  ownerState: Pick<DateRangeShortCutWrapperProps, 'position'>;
}>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: ['start', 'end'].includes(ownerState.position) ? 'row' : 'column',
}));

const DateRangeShortCutWrapperContainer = styled('div')<{
  ownerState: Pick<DateRangeShortCutWrapperProps, 'position'>;
}>(({ theme, ownerState }) => ({ padding: ['start', 'end'].includes(ownerState.position) ? theme.spacing(2) : theme.spacing(1) }));

export interface RangeItem<TValue> extends Omit<DateRangeShortCutWrapperProps, 'children' | 'position'> {
  label: string;
  value: TValue;
  closeOnSelect?: boolean;
}

const DateRangeShortCutItem = (props: RangeItem<any>) => {
  const { label, value, onSetValue, closeOnSelect = false } = props;

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onSetValue(value, closeOnSelect)}>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

const DateRangeShortCutButton = (props: RangeItem<any>) => {
  const { label, value, onSetValue, closeOnSelect = false } = props;

  return (
    <Button onClick={() => onSetValue(value, closeOnSelect)}>
      {label}
    </Button>
  );
};

const DateRangeVerticalShortcut = (props: Omit<DateRangeShortCutWrapperProps, 'children'>) => {
  const { onSetValue, isDateDisabled, position } = props
  return <React.Fragment> <DateRangeShortCutWrapperContainer ownerState={{ position }}>
    <Typography variant="overline">Date range shortcuts</Typography>
    <List>
      {[{ label: 'clear', value: [null, null] }].map((options) => (
        <DateRangeShortCutItem
          key={options.label}
          {...options}
          onSetValue={onSetValue}
          isDateDisabled={isDateDisabled}
        />
      ))}
    </List>
  </DateRangeShortCutWrapperContainer>
    <Divider orientation="vertical" />
  </React.Fragment>
}

const DateRangeHorizontalShortcut = (props: Omit<DateRangeShortCutWrapperProps, 'children'>) => {
  const { onSetValue, isDateDisabled, position } = props

  return <React.Fragment>
    <Divider />
    <DateRangeShortCutWrapperContainer ownerState={{ position }}>
      <Stack direction='row' spacing={1}>
        {[{ label: 'clear', value: [null, null] }].map((options) => (
          <DateRangeShortCutButton
            key={options.label}
            {...options}
            onSetValue={onSetValue}
            isDateDisabled={isDateDisabled}
          />
        ))}
      </Stack >
    </DateRangeShortCutWrapperContainer>
  </React.Fragment>
}



export function DateRangeShortCutWrapper(props: DateRangeShortCutWrapperProps) {
  const {
    children,
    isDateDisabled,
    onSetValue,
    position,
    // ...other
  } = props;

  const isVerticalShortcut = ['start', 'end'].includes(position)
  const isShortcutFirst = ['start', 'top'].includes(position)

  const ShortCutComponent = isVerticalShortcut ? DateRangeVerticalShortcut : DateRangeHorizontalShortcut

  return (
    <DateRangeShortCutWrapperRoot ownerState={{ position }}>
      {isShortcutFirst && <ShortCutComponent
        onSetValue={onSetValue}
        isDateDisabled={isDateDisabled}
        position={position} />}
      {children}
      {!isShortcutFirst && <ShortCutComponent
        onSetValue={onSetValue}
        isDateDisabled={isDateDisabled}
        position={position} />}
    </DateRangeShortCutWrapperRoot>
  );
}
