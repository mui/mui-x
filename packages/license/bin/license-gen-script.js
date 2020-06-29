#!/usr/bin/env node

require = require('esm')(module /*, options*/);

// eslint-disable-next-line @typescript-eslint/no-var-requires

require('../dist/cjs/license-cli').licenseGenCli(process.argv);
