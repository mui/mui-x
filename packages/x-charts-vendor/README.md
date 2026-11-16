# Charts Vendor

Vendored dependencies for @mui/x-charts.

An adaptation of the victory-vendor

## Background

D3 has released most of its libraries as ESM-only. This means that consumers in Node.js applications can no longer just `require()` anything with a d3 transitive dependency, including much of @mui/x-charts.

To help provide an easy path to folks still using CommonJS in their Node.js applications that consume @mui/x-charts, we now provide this package to vendor in various d3-related packages.

Node.js 20.19+ and 22.12+ can `require()` ES modules, but Jest only can on Node.js 24.9+ with `--experimental-vm-modules`, so CommonJS users still need this package.

## Main difference with victory-vendor

Victory is using the `d3-voronoi` which is an archived project.

## Packages

Each dependency of this package is available as `@mui/x-charts-vendor/<package name>`:

- d3-array
- d3-color
- d3-format
- d3-geo
- d3-interpolate
- d3-path
- d3-scale
- d3-shape
- d3-time
- d3-time-format
- d3-timer
- flatqueue
- internmap

## How to add a new package

Install it as a dependency of this package, then run the build script.
Every transitive d3 dependency must also be a direct dependency, so the vendored copies can import each other.

Package names that do not start with `d3-` must be added to the `/^(d3-|internmap|flatqueue)/` filters in [./scripts/build.mjs](./scripts/build.mjs) and [./.babelrc.js](./.babelrc.js).

The build loads each CommonJS entry and fails if one is broken.

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

under the hood, it will go to an alternate path that contains a CommonJS copy of the package's ESM entry, read from its `package.json`, for example `x-charts-vendor/lib-vendor/d3-interpolate/dist/d3-interpolate.js`.
This further has internally consistent import references to other `x-charts-vendor/lib-vendor/<pkg-name>` paths.

Note that for some tooling (like Jest) that doesn't play well with `package.json:exports` routing to this CommonJS path, we **also** output a root file in the form of `x-charts-vendor/d3-interpolate.js`.

## Licenses

This project is released under the MIT license, but the vendored in libraries include other licenses (for example ISC) that we enumerate in our `package.json:license` field.
