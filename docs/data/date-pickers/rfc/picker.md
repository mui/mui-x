---
productId: x-date-pickers
title: DX - Picker
---

# Picker

<p class="description">This page describes how people can use picker with Material UI and how they can build custom pickers.</p>

:::success
This page extends the initial proposal made in [#14718](https://github.com/mui/mui-x/issues/14718)
:::

## Basic usage

### With Material UI

TODO

### Without Material UI

```tsx
function CustomDatePicker(props) {
  const manager = useDateManager();

  return (
    <Popover.Root>
      <Picker.Root manager={manager} {...props}>
        <PickerField.Root>
          <PickerField.Root>
            {/** See field documentation */}
            <Popover.Trigger>📅</Popover.Trigger>
          </PickerField.Root>
        </PickerField.Root>
        <Popover.Backdrop />
        <Popover.Positioner>
          <Popover.Popup>
            <Picker.Views></Picker.Views>
          </Popover.Popup>
        </Popover.Positioner>
      </Picker.Root>
    </Popover.Root>
  );
}
```

## Add an action bar

### With Material UI

TODO

### Without Material UI

```tsx
<Picker.Layout>
  <Picker.Views>{/** See demo above */}</Picker.Views>
  <div>
    <Picker.Clear>Clear</Picker.Clear>
    <Popover.Close>Close</Popover.Close>
  </div>
</Picker.Layout>
```

## Add a toolbar

### With Material UI

TODO

### Without Material UI

```tsx
<Picker.Layout>
  <Picker.Toolbar.Root>
    <Picker.Toolbar.Title />
  </Picker.Toolbar.Root>
  <Picker.Views>{/** See demo above */}</Picker.Views>
</Picker.Layout>
```

```tsx
<Picker.Layout>
  <Picker.Toolbar.Root>
    <Picker.SetView target="year">
      <Picker.Toolbar.Title format="YYYY" />
    </Picker.SetView>
    <Picker.SetView target="day">
      <Picker.Toolbar.Title format="DD MMMM" />
    </Picker.SetView>
  </Picker.Toolbar.Root>
  <Picker.Views>{/** See demo above */}</Picker.Views>
</Picker.Layout>
```

## Add tabs

### With Material UI

TODO

### Without Material UI

TODO

## Add shortcuts

### With Material UI

TODO

### Without Material UI

TODO

## Anatomy of `Picker.*`

### `Picker.Root`

TODO

### `Picker.Clear`

TODO

### `Picker.SetValue`

TODO

### `Picker.SetView`

TODO

### `Picker.Layout`

TODO

### `Picker.Toolbar.Root`

TODO

### `Picker.Toolbar.Title`

TODO

### `Picker.Shortcuts.Root`

TODO

### `Picker.Shortcut.Item`

TODO
