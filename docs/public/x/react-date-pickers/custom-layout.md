---
productId: x-date-pickers
title: Date and Time Pickers - Custom layout
components: PickersActionBar, PickersLayout
githubLabel: 'scope: pickers'
packageName: '@mui/x-date-pickers'
---

# Custom layout

The Date and Time Pickers let you reorganize the layout.

:::success
See [Common concepts—Slots and subcomponents](/x/common-concepts/custom-components/) to learn how to use slots.
:::

## Default layout structure

By default, pickers are made of 5 subcomponents present in the following order:

- The **toolbar** displaying the selected date. Can be enforced with `slotProps: { toolbar: { hidden: false } }` prop.
- The **shortcuts** allowing quick selection of some values. Can be added with [`slotProps.shortcuts`](/x/react-date-pickers/shortcuts/#adding-shortcuts)
- The **content** displaying the current view. Can be a calendar, or a clock.
- The **tabs** allowing to switch between day and time views in Date Time Pickers. Can be enforced with `slotProps: { tabs: { hidden: false } }` prop.
- The **action bar** allowing some interactions. Can be added with [`slotProps.actionBar`](/x/react-date-pickers/custom-components/#action-bar) prop.

By default the `content` and `tabs` are wrapped together in a `contentWrapper` to simplify the layout.

You can [customize those components](/x/react-date-pickers/custom-components/) individually by using `slots` and `slotProps`.

## Orientation

Toggling layout can be achieved by changing `orientation` prop value between `'portrait'` or `'landscape'`.

Here is a demonstration with the 3 main blocks outlined with color borders.

```jsx
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';

const highlighLayout = {
  sx: {
    [`& .${pickersLayoutClasses.toolbar}`]: {
      border: 'solid red 4px',
    },
    [`& .${pickersLayoutClasses.contentWrapper}`]: {
      border: 'solid green 4px',
    },
    [`& .${pickersLayoutClasses.actionBar}`]: {
      border: 'solid blue 4px',
    },
  },
};

export default function LayoutBlocks() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [currentComponent, setCurrentComponent] = React.useState('date');
  const [orientation, setOrientation] = React.useState('portrait');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            px: 3,
            pb: 2,
            minWidth: '150px',
          }}
        >
          <Stack spacing={2} alignItems="center" direction="column">
            <ToggleButtonGroup
              size="small"
              fullWidth
              color="primary"
              value={currentComponent}
              orientation={isDesktop ? 'vertical' : 'horizontal'}
              onChange={(event, value) => {
                if (value !== null) {
                  setCurrentComponent(value);
                }
              }}
              exclusive
            >
              <ToggleButton value={'date'}>date picker</ToggleButton>
              <ToggleButton value={'time'}>time picker</ToggleButton>
              <ToggleButton value={'date-time'}>date time picker</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              size="small"
              fullWidth
              color="primary"
              value={orientation}
              orientation={isDesktop ? 'vertical' : 'horizontal'}
              onChange={(event, value) => {
                if (value !== null) {
                  setOrientation(value);
                }
              }}
              exclusive
            >
              <ToggleButton value={'landscape'}>landscape</ToggleButton>
              <ToggleButton value={'portrait'}>portrait</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
        <Divider orientation={isDesktop ? 'vertical' : 'horizontal'} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 999,
            minWidth: 0,
            p: 3,
          }}
        >
          <Box sx={{ margin: 'auto' }}>
            {currentComponent === 'date' && (
              <StaticDatePicker
                orientation={orientation}
                slotProps={{
                  layout: highlighLayout,
                }}
              />
            )}

            {currentComponent === 'time' && (
              <Box sx={{ position: 'relative' }}>
                <StaticTimePicker
                  orientation={orientation}
                  slotProps={{
                    layout: highlighLayout,
                  }}
                />
              </Box>
            )}

            {currentComponent === 'date-time' && (
              <StaticDateTimePicker
                orientation={orientation}
                slotProps={{
                  layout: highlighLayout,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

```

## Layout structure

A `<PickersLayoutRoot />` wraps all the subcomponents to provide the structure.
By default it renders a `div` with `display: grid`.
Such that all subcomponents are placed in a 3 by 3 [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout).

```jsx
<PickersLayoutRoot>
  {toolbar}
  {shortcuts}
  <PickersLayoutContentWrapper>
    {tabs}
    {content}
  </PickersLayoutContentWrapper>
  {actionBar}
</PickersLayoutRoot>
```

## CSS customization

To move an element, you can override its position in the layout with [`gridColumn`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [`gridRow`](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) properties.

In the next example, the action bar is replaced by a list and then placed on the left side of the content.
It's achieved by applying the `{ gridColumn: 1, gridRow: 2 }` style.

:::warning
If you are using custom components, you should pay attention to `className`.
To make CSS selectors work, you can either propagate `className` to the root element like in the demo, or use your own CSS class.
:::

```tsx
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

function ActionList(props: PickersActionBarProps) {
  const { className } = props;
  const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges } =
    usePickerActionsContext();

  const actions = [
    { text: 'Accept', method: acceptValueChanges },
    { text: 'Clear', method: clearValue },
    { text: 'Cancel', method: cancelValueChanges },
    { text: 'Today', method: setValueToToday },
  ];

  return (
    // Propagate the className such that CSS selectors can be applied
    <List className={className}>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default function MovingActions() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slotProps={{
          layout: {
            sx: {
              [`.${pickersLayoutClasses.actionBar}`]: {
                gridColumn: 1,
                gridRow: 2,
              },
            },
          },
        }}
        slots={{
          actionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}

```

## DOM customization

It's important to note that by modifying the layout with CSS, the new positions can lead to inconsistencies between the visual render and the DOM structure.
In the previous demonstration, the tab order is broken because the action bar appears before the calendar, whereas in the DOM the action bar is still after.

To modify the DOM structure, you can create a custom `Layout` wrapper.
Use the `usePickerLayout` hook to get the subcomponents React nodes.
Then you can fully customize the DOM structure.

```jsx
import {
  usePickerLayout,
  PickersLayoutRoot,
  pickersLayoutClasses,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';

function MyCustomLayout(props) {
  const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout(props);

  // Put the action bar before the content
  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={ownerState}>
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}
```

:::info
This slot can also be used to add additional information in the layout.
:::

Here is the complete example with a fix for the tabulation order and an external element added to the layout.
Notice the use of `pickersLayoutClasses`, `PickersLayoutRoot`, and `PickersLayoutContentWrapper` to avoid rewriting the default CSS.

```tsx
import * as React from 'react';
import { Dayjs } from 'dayjs';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
import { usePickerActionsContext } from '@mui/x-date-pickers/hooks';

function ActionList(props: PickersActionBarProps) {
  const { className } = props;
  const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges } =
    usePickerActionsContext();

  const actions = [
    { text: 'Accept', method: acceptValueChanges },
    { text: 'Clear', method: clearValue },
    { text: 'Cancel', method: cancelValueChanges },
    { text: 'Today', method: setValueToToday },
  ];

  return (
    <List className={className}>
      {actions.map(({ text, method }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={method}>
            <ListItemText primary={text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

function RestaurantHeader() {
  return (
    <Box
      sx={{
        // Place the element in the grid layout
        gridColumn: 1,
        gridRow: 1,
        // Center the icon
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <RestaurantIcon />
    </Box>
  );
}

function CustomLayout(props: PickersLayoutProps<Dayjs | null>) {
  const { toolbar, tabs, content, actionBar, ownerState } = usePickerLayout(props);

  return (
    <PickersLayoutRoot
      ownerState={ownerState}
      sx={{
        overflow: 'auto',
        [`.${pickersLayoutClasses.actionBar}`]: {
          gridColumn: 1,
          gridRow: 2,
        },
        [`.${pickersLayoutClasses.toolbar}`]: {
          gridColumn: 2,
          gridRow: 1,
        },
      }}
    >
      <RestaurantHeader />
      {toolbar}
      {actionBar}
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
        ownerState={ownerState}
      >
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}
export default function AddComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        slots={{
          layout: CustomLayout,
          actionBar: ActionList,
        }}
      />
    </LocalizationProvider>
  );
}

```
