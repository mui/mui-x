import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { textFieldClasses } from '@mui/material/TextField';

interface PickersGridProps {
  children: React.ReactNode;
}

type PickersGridChildComponentType = 'multi-input-field' | 'single-input-field' | 'UI-view';

const getChildComponentName = (child: any) => child.type?.render?.name ?? child.type?.name;

const getChildTypeFromChildName = (childName: string): PickersGridChildComponentType => {
  if (childName.match(/^Static([A-Za-z]+)/) || childName.match(/^([A-Za-z]+)(Calendar|Clock)$/)) {
    return 'UI-view';
  }
  if (
    childName.match(/^MultiInput([A-Za-z]+)Field$/) ||
    childName.match(/^([A-Za-z]+)RangePicker$/)
  ) {
    return 'multi-input-field';
  }

  return 'single-input-field';
};

export function PickersGrid(props: PickersGridProps) {
  const { children } = props;

  const childrenCount = React.Children.count(children);
  const childrenTypes = new Set<PickersGridChildComponentType>();

  React.Children.forEach(children, (child: any) => {
    let childName = getChildComponentName(child);

    if (childName === 'PickersGridItem') {
      const nestedChild = React.Children.toArray(child.props.children)[0] as any;
      childName = getChildComponentName(nestedChild);
    }

    childrenTypes.add(getChildTypeFromChildName(childName));
  });

  const getSpacing = (direction: 'column' | 'row') => {
    if (direction === 'row') {
      return childrenTypes.has('UI-view') ? 3 : 2;
    }

    return childrenTypes.has('UI-view') ? 4 : 3;
  };

  let direction: StackProps['direction'];
  let spacing: StackProps['spacing'];

  if (childrenCount > 2 || childrenTypes.has('multi-input-field')) {
    direction = 'column';
    spacing = getSpacing('column');
  } else if (childrenTypes.has('UI-view')) {
    direction = { xs: 'column', xl: 'row' };
    spacing = { xs: getSpacing('column'), xl: getSpacing('row') };
  } else {
    direction = { xs: 'column', lg: 'row' };
    spacing = { xs: getSpacing('column'), lg: getSpacing('row') };
  }

  return (
    <Stack direction={direction} spacing={spacing}>
      {children}
    </Stack>
  );
}

interface PickersGridItemProps {
  label: string;
  children: React.ReactNode;
}
export function PickersGridItem(props: PickersGridItemProps) {
  const { label, children } = props;

  const childName = getChildComponentName(React.Children.toArray(children)[0]);
  const childType = getChildTypeFromChildName(childName);

  let spacing: StackProps['spacing'];
  let sx: StackProps['sx'];

  if (childType === 'multi-input-field') {
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
