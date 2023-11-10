---
productId: x-date-pickers
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v6 to v7.</p>

## Introduction

TBD

## Start using the new release

In `package.json`, change the version of the date pickers package to `next`.

```diff
-"@mui/x-date-pickers": "6.x.x",
+"@mui/x-date-pickers": "next",
```

## Breaking changes

Since `v7` is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.

### Rename `components` to `slots`

The `components` and `componentsProps` props are renamed to `slots` and `slotProps` props respectively.
This is a slow and ongoing effort between the different MUI libraries.
To smooth the transition, they were deprecated during the [v6](/x/migration/migration-pickers-v5/#rename-components-to-slots-optional).
And are removed from the v7.

If not already done, this modification can be handled by the codemod

```bash
npx @mui/x-codemod v7.0.0/pickers/ <path>
```

Take a look at [the RFC](https://github.com/mui/material-ui/issues/33416) for more information.

:::warning
If this codemod is applied on a component with both a `slots` and a `components` prop, the output will contain two `slots` props.
You are then responsible for merging those two props manually.

For example:

```tsx
// Before running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  components={{ toolbar: MyToolbar }}
/>

// After running the codemod
<DatePicker
  slots={{ textField: MyTextField }}
  slots={{ toolbar: MyToolbar }}
/>
```

The same applies to `slotProps` and `componentsProps`.
:::

## Field components

### Replace the section `hasLeadingZeros` property

:::success
This only impacts you if you are using the `unstableFieldRef` prop to imperatively access the section object.
:::

The property `hasLeadingZeros` has been removed from the sections in favor of the more precise `hasLeadingZerosInFormat` and `hasLeadingZerosInInput` properties.
To keep the same behavior, you can replace it by `hasLeadingZerosInFormat`

```diff
 const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

 React.useEffect(() => {
     const firstSection = fieldRef.current!.getSections()[0]
-    console.log(firstSection.hasLeadingZeros)
+    console.log(firstSection.hasLeadingZerosInFormat)
 }, [])

 return (
   <DateField unstableFieldRef={fieldRef} />
 );
```
