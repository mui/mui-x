# babel-plugin-mui-css

This Babel plugin finds all `css()` calls and replaces them with class names, extracting the CSS as a separate stylesheet.

## Example

Before:

```js
/* component.ts */
const styles = css('MuiDataGrid-panel', {
  root: {
    border: '1px solid black',
  },
  focused: {
    border: '1px solid blue',
  },
});
```

After:

```js
/* component.ts */
const styles = {
  root: 'MuiDataGrid-panel',
  focused: 'MuiDataGrid-panel--focused',
};
```

```css
/* output.css */
.MuiDataGrid-panel {
  border: 1px solid black;
}
.MuiDataGrid-panel--focused {
  border: 1px solid blue;
}
```

## License

MIT

Forked from https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
