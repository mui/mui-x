import * as React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { textFieldClasses } from '@mui/material/TextField';

interface DemoGridProps {
  children: React.ReactNode;
  components: string[];
  sx?: SxProps<Theme>;
}

type PickersGridChildComponentType =
  | 'single-input-field'
  | 'multi-input-range-field'
  | 'single-input-range-field'
  | 'UI-view'
  | 'Tall-UI-view'
  | 'multi-panel-UI-view';

type PickersSupportedSections = 'date' | 'time' | 'date-time';

const getChildTypeFromChildName = (childName: string): PickersGridChildComponentType => {
  if (childName.match(/^([A-Za-z]+)Range(Calendar|Clock)$/)) {
    return 'multi-panel-UI-view';
  }

  if (childName.match(/^([A-Za-z]*)(DigitalClock)$/)) {
    return 'Tall-UI-view';
  }

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

interface DemoItemProps {
  label?: React.ReactNode;
  component?: string;
  children: React.ReactNode;
}
/**
 * WARNING: This is an internal component used in documentation to achieve a desired layout.
 * Please do not use it in your application.
 */
export function DemoItem(props: DemoItemProps) {
  const { label, children, component } = props;

  let spacing: StackProps['spacing'];
  let sx: StackProps['sx'];

  if (component && getChildTypeFromChildName(component) === 'multi-input-range-field') {
    spacing = 1.5;
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
      {label && <Typography variant="body2">{label}</Typography>}
      {children}
    </Stack>
  );
}

/**
 * WARNING: This is an internal component used in documentation to achieve a desired layout.
 * Please do not use it in your application.
 */
export function DemoContainer(props: DemoGridProps) {
  const { children, components, sx: sxProp } = props;

  const childrenTypes = new Set<PickersGridChildComponentType>();
  const childrenSupportedSections = new Set<PickersSupportedSections>();

  components.forEach((childName) => {
    childrenTypes.add(getChildTypeFromChildName(childName));
    childrenSupportedSections.add(getSupportedSectionFromChildName(childName));
  });

  const getSpacing = (direction: 'column' | 'row') => {
    if (direction === 'row') {
      return childrenTypes.has('UI-view') || childrenTypes.has('Tall-UI-view') ? 3 : 2;
    }

    return childrenTypes.has('UI-view') ? 4 : 3;
  };

  let direction: StackProps['direction'];
  let spacing: StackProps['spacing'];
  let sx: StackProps['sx'] = {
    overflow: 'auto',
    // Add padding as overflow can hide the outline text field label.
    pt: 1,
    ...sxProp,
  };

  if (
    components.length > 2 ||
    childrenTypes.has('multi-input-range-field') ||
    childrenTypes.has('single-input-range-field') ||
    childrenTypes.has('multi-panel-UI-view') ||
    childrenTypes.has('UI-view') ||
    childrenSupportedSections.has('date-time')
  ) {
    direction = 'column';
    spacing = getSpacing('column');
  } else {
    direction = { xs: 'column', lg: 'row' };
    spacing = { xs: getSpacing('column'), lg: getSpacing('row') };
  }

  if (childrenTypes.has('UI-view')) {
    // noop
  } else if (childrenTypes.has('single-input-range-field')) {
    if (!childrenSupportedSections.has('date-time')) {
      sx = {
        ...sx,
        [`& > .${textFieldClasses.root}`]: {
          minWidth: 300,
        },
      };
    } else {
      sx = {
        ...sx,
        [`& > .${textFieldClasses.root}`]: {
          minWidth: { xs: 300, md: 400 },
        },
      };
    }
  } else if (childrenSupportedSections.has('date-time')) {
    sx = { ...sx, [`& > .${textFieldClasses.root}`]: { minWidth: 270 } };
  } else {
    sx = { ...sx, [`& > .${textFieldClasses.root}`]: { minWidth: 200 } };
  }

  return (
    <Stack direction={direction} spacing={spacing} sx={sx}>
      {children}
    </Stack>
  );
}
