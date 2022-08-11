#!/usr/bin/env node
/* eslint-disable */
require = require('esm')(module);

if (process.env.NODE_ENV === 'dev') {
  require('../build/node/cli/license-cli').licenseDecodeCli();
} else {
  require('../node/cli/license-cli').licenseDecodeCli();
}
