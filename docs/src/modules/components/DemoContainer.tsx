import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { textFieldClasses } from '@mui/material/TextField';

interface PickersGridProps {
  children: React.ReactNode;
}

type PickersGridChildComponentType =
  | 'single-input-field'
  | 'multi-input-range-field'
  | 'single-input-range-field'
  | 'UI-view';
type PickersSupportedSections = 'date' | 'time' | 'date-time';

const getChildComponentName = (child: any) => child.type?.render?.name ?? child.type?.name;

const getChildTypeFromChildName = (childName: string): PickersGridChildComponentType => {
  if (childName.match(/^Static([A-Za-z]+)/) || childName.match(/^([A-Za-z]+)(Calendar|Clock)$/)) {
    return 'UI-view';
  }

  if (
    childName.match(/^MultiInput([A-Za-z]+)RangeField$/) ||
    childName.match(/^([A-Za-z]+)RangePicker$/)
  ) {
    return 'multi-input-range-field';
  }

  if (childName.match(/^SingleInput([A-Za-z]+)RangeField$/)) {
    return 'single-input-range-field';
  }

  return 'single-input-field';
};

const getSupportedSectionFromChildName = (childName: string): PickersSupportedSections => {
  if (childName.includes('DateTime')) {
    return 'date-time';
  }

  if (childName.includes('Date')) {
    return 'date';
  }

  return 'time';
};

export function DemoContainer(props: PickersGridProps) {
  const { children } = props;

  const childrenCount = React.Children.count(children);
  const childrenTypes = new Set<PickersGridChildComponentType>();
  const childrenSupportedSections = new Set<PickersSupportedSections>();

  React.Children.forEach(children, (child: any) => {
    let childName = getChildComponentName(child);

    if (childName === 'DemoItem') {
      const nestedChild = React.Children.toArray(child.props.children)[0] as any;
      childName = getChildComponentName(nestedChild);
    }

    childrenTypes.add(getChildTypeFromChildName(childName));
    childrenSupportedSections.add(getSupportedSectionFromChildName(childName));
  });

  const getSpacing = (direction: 'column' | 'row') => {
    if (direction === 'row') {
      return childrenTypes.has('UI-view') ? 3 : 2;
    }

    return childrenTypes.has('UI-view') ? 4 : 3;
  };

  let direction: StackProps['direction'];
  let spacing: StackProps['spacing'];
  let sx: StackProps['sx'];

  if (
    childrenCount > 2 ||
    childrenTypes.has('multi-input-range-field') ||
    childrenTypes.has('single-input-range-field')
  ) {
    direction = 'column';
    spacing = getSpacing('column');
  } else if (childrenTypes.has('UI-view')) {
    direction = { xs: 'column', xl: 'row' };
    spacing = { xs: getSpacing('column'), xl: getSpacing('row') };
  } else {
    direction = { xs: 'column', lg: 'row' };
    spacing = { xs: getSpacing('column'), lg: getSpacing('row') };
  }

  if (childrenTypes.has('UI-view')) {
    sx = null;
  } else if (childrenTypes.has('single-input-range-field')) {
    sx = { [`& > .${textFieldClasses.root}`]: { minWidth: 400 } };
  } else if (childrenSupportedSections.has('date-time')) {
    sx = { [`& > .${textFieldClasses.root}`]: { minWidth: 256 } };
  } else {
    sx = { [`& > .${textFieldClasses.root}`]: { minWidth: 200 } };
  }

  return (
    <Stack direction={direction} spacing={spacing} sx={sx}>
      {children}
    </Stack>
  );
}

interface PickersGridItemProps {
  label: React.ReactNode;
  children: React.ReactNode;
}
export function DemoItem(props: PickersGridItemProps) {
  const { label, children } = props;

  const childName = getChildComponentName(React.Children.toArray(children)[0]);
  const childType = getChildTypeFromChildName(childName);

  let spacing: StackProps['spacing'];
  let sx: StackProps['sx'];

  if (childType === 'multi-input-range-field') {
    spacing = 2;
    sx = {
      [`& .${textFieldClasses.root}`]: {
        flexGrow: 1,
      },
    };
  } else {
    spacing = 1;
    sx = undefined;
  }

  return (
    <Stack direction="column" alignItems="stretch" spacing={spacing} sx={sx}>
      <Typography variant="body2">{label}</Typography>
      {children}
    </Stack>
  );
}
