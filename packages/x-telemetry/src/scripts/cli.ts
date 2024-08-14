#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { TelemetryStorage } from '../internal/storage';

yargs(hideBin(process.argv))
  .scriptName('npx mui-x-telemetry')
  .command({
    command: 'enable',
    describe: 'Enable MUI X telemetry',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      config.setEnabled(true);

      console.log('[telemetry] MUI X telemetry enabled');
    },
  })
  .command({
    command: 'disable',
    describe: 'Disable MUI X telemetry',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      config.setEnabled(false);

      console.log(
        '[telemetry] MUI X telemetry disabled. If you want to enable it again, run `npx @mui/x-telemetry enable`',
      );
    },
  })
  .command({
    command: 'status',
    describe: 'Check the status of MUI X telemetry',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      console.log(`[telemetry] MUI X telemetry is ${config.isCollecting ? 'enabled' : 'disabled'}`);
    },
  })
  .command({
    command: 'config',
    describe: 'Get path where the global config is stored',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      console.log(`[telemetry] The config is at '${config.configPath}'`);
    },
  })
  .help()
  .strict(true)
  .version(false)
  .showHelpOnFail(true)
  .demandCommand(1, '')
  .recommendCommands()
  .parse();
