# babel-plugin-mui-css

This Babel plugin finds all `css()` calls and replaces them with class names, extracting the CSS as a separate stylesheet.

## Example

```js
// component.ts: before
const styles = css(
  { prefix: 'MuiDataGrid-aggregationColumnHeader' },
  {
    root: {
      border: '1px solid red',
    },
    alignLeft: {},
  },
);

console.log(styles.root);
```

```js
// component.ts: after
const styles = {
  root: 'MuiDataGrid-aggregationColumnHeader',
  alignLeft: 'MuiDataGrid-aggregationColumnHeader--alignLeft',
};

console.log(styles.alignLeft);
```

## License

MIT

Forked from https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
