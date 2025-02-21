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

// component.ts: after
const styles = {
  root: 'MuiDataGrid-aggregationColumnHeader',
  alignLeft: 'MuiDataGrid-aggregationColumnHeader--alignLeft',
};

console.log(styles.alignLeft);
```

## Installation

```console
npm install --save-dev babel-plugin-mui-css
```

**Include plugin in `.babelrc`**

```json
{
  "plugins": ["css-modules-transform"]
}
```

**With custom options [css-modules-require-hook options](https://github.com/css-modules/css-modules-require-hook#tuning-options)**

```js
{
    "plugins": [
        [
            "css-modules-transform", {
                "append": [
                    "npm-module-name",
                    "./path/to/module-exporting-a-function.js"
                ],
                "camelCase": false,
                "createImportedName": "npm-module-name",
                "createImportedName": "./path/to/module-exporting-a-function.js",
                "devMode": false,
                "extensions": [".css", ".scss", ".less"], // list extensions to process; defaults to .css
                "generateScopedName": "[name]__[local]___[hash:base64:5]", // in case you don't want to use a function
                "generateScopedName": "./path/to/module-exporting-a-function.js", // in case you want to use a function
                "generateScopedName": "npm-module-name",
                "hashPrefix": "string",
                "ignore": "*css",
                "ignore": "./path/to/module-exporting-a-function-or-regexp.js",
                "preprocessCss": "./path/to/module-exporting-a-function.js",
                "preprocessCss": "npm-module-name",
                "processCss": "./path/to/module-exporting-a-function.js",
                "processCss": "npm-module-name",
                "processorOpts": "npm-module-name",
                "processorOpts": "./path/to/module/exporting-a-plain-object.js",
                "mode": "string",
                "prepend": [
                    "npm-module-name",
                    "./path/to/module-exporting-a-function.js"
                ],
                "extractCss": "./dist/stylesheets/combined.css"
            }
        ]
    ]
}
```

## Using a preprocessor

When using this plugin with a preprocessor, you'll need to configure it as such:

```js
// ./path/to/module-exporting-a-function.js
var sass = require('node-sass');
var path = require('path');

module.exports = function processSass(data, filename) {
  var result;
  result = sass.renderSync({
    data: data,
    file: filename,
  }).css;
  return result.toString('utf8');
};
```

and then add any relevant extensions to your plugin config:

```js
{
    "plugins": [
        [
            "css-modules-transform", {
                "preprocessCss": "./path/to/module-exporting-a-function.js",
                "extensions": [".css", ".scss"]
            }
        ]
    ]
}

```

## Extract CSS Files

When you publish a library, you might want to ship compiled css files as well to
help integration in other projects.

An more complete alternative is to use
[babel-plugin-webpack-loaders](https://github.com/istarkov/babel-plugin-webpack-loaders)
but be aware that a new webpack instance is run for each css file, this has a
huge overhead. If you do not use fancy stuff, you might consider using
[babel-plugin-mui-css](https://github.com/michalkvasnicak/babel-plugin-mui-css)
instead.

To combine all css files in a single file, give its name:

```js
{
    "plugins": [
        [
            "css-modules-transform", {
                "extractCss": "./dist/stylesheets/combined.css"
            }
        ]
    ]
}
```

To extract all files in a single directory, give an object:

```js
{
    "plugins": [
        [
            "css-modules-transform", {
                "extractCss": {
                    "dir": "./dist/stylesheets/",
                    "relativeRoot": "./src/",
                    "filename": "[path]/[name].css"
                }
            }
        ]
    ]
}
```

Note that `relativeRoot` is used to resolve relative directory names, available
as `[path]` in `filename` pattern.

## Keeping import

To keep import statements you should set option `keepImport` to _true_. In this way, simultaneously with the converted values, the import will be described as unassigned call expression.

```js
// before
const styles = require('./test.css');
```

```js
// after
require('./test.css');

const styles = {
  someClass: 'Test__someClass___2Frqu',
};
```

## License

MIT

Forked from https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
