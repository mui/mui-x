---
productId: x-date-pickers
title: Frequently Asked Questions - Date and Time pickers
githubLabel: 'component: pickers'
packageName: '@mui/x-date-pickers'
---

# Frequently asked questions

<p class="description">Can't find what you are looking for? The FAQ section has answers to some of the most frequent questions and challenges.</p>

If you still have trouble, you can get in touch with us through our [support page](/x/introduction/support/).

## What is the DemoContainer?

The `<DemoContainer />` is an internal component used together with the `<DemoItem />` to display multiple components in a consistent layout throughout the demos. This helps avoid the repeated use of layout components, such as `<Box />` or `<Stack />`, while keeping the code minimal and clear, and allowing readers to focus on what is important - the demo itself.

## Why isn't the KeyboardDatePicker supported anymore?

There is no longer a separate date picker that only supports keyboard editing. All versions of the date and time pickers implement keyboard input for accessibility and also allow editing through the UI. Visit the [dedicated page](/x/react-date-pickers/base-concepts/) in our docs to get started.

```diff
-import { KeyboardDatePicker } from '@material-ui/pickers';
+import { DatePicker } from '@mui/x-date-pickers/DatePicker';
```

You can also use the field components, that let you enter a date or time with the keyboard, without using any popover or modal UI. For more information about the fields, you can refer to the [field components page](/x/react-date-pickers/fields/).
