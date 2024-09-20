# Charts Vendor

Vendored dependencies for @mui/x-charts.

An adaptation of the victory-vendor

## Background

D3 has released most of its libraries as ESM-only. This means that consumers in Node.js applications can no longer just `require()` anything with a d3 transitive dependency, including much of @mui/x-charts.

To help provide an easy path to folks still using CommonJS in their Node.js applications that consume @mui/x-charts, we now provide this package to vendor in various d3-related packages.

## Main difference with victory-vendor

Victory is using the `d3-voronoid` which is an archived project.
Our chart library relies on the `d3-delaunay` which is also ESM only and reuse `robust-predicates` which is also ESM only

## Packages

We presently provide the following top-level libraries:

- d3-color
- d3-delaunay
- d3-interpolate
- d3-scale
- d3-shape
- d3-time
- delaunator
- robust-predicate

This is the total list of top and transitive libraries we vendor:

- d3-array
- d3-color
- d3-delaunay
- d3-format
- d3-interpolate
- d3-path
- d3-scale
- d3-shape
- d3-time
- d3-time-format
- delaunator
- internmap
- robust-predicates

## How it works

We provide two alternate paths and behaviors -- for ESM and CommonJS

### ESM

If you do a Node.js import like:

```js
import { interpolate } from '@mui/x-charts-vendor/d3-interpolate';
```

under the hood it's going to just re-export and pass you through to `node_modules/d3-interpolate`, the **real** ESM library from D3.

### CommonJS

If you do a Node.js import like:

```js
const { interpolate } = require('@mui/x-charts-vendor/d3-interpolate');
```

under the hood, it will go to an alternate path that contains the transpiled version of the underlying d3 library found at `x-charts-vendor/lib-vendor/d3-interpolate/**/*.js`.
This further has internally consistent import references to other `x-charts-vendor/lib-vendor/<pkg-name>` paths.

Note that for some tooling (like Jest) that doesn't play well with `package.json:exports` routing to this CommonJS path, we **also** output a root file in the form of `x-charts-vendor/d3-interpolate.js`.

## Licenses

This project is released under the MIT license, but the vendored in libraries include other licenses (for example ISC) that we enumerate in our `package.json:license` field.
