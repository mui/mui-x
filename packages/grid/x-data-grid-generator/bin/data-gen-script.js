#!/usr/bin/env node

// eslint-disable-next-line no-global-assign
require = require('esm')(module);

// eslint-disable-next-line import/no-unresolved, import/extensions
require('../build/index-cjs').datagenCli();
