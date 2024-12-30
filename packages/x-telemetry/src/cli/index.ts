#!/usr/bin/env node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { TelemetryStorage } from '../postinstall/storage';

async function postinstall() {
  // Rerun the postinstall script to update the context file
  await import('../postinstall/index');
}

yargs(hideBin(process.argv))
  .scriptName('npx mui-x-telemetry')
  .command({
    command: 'enable',
    describe: 'Enable MUI X telemetry',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      config.setEnabled(true);
      await postinstall();

      console.log('[telemetry] MUI X telemetry enabled');
    },
  })
  .command({
    command: 'disable',
    describe: 'Disable MUI X telemetry',
    handler: async () => {
      const config = new TelemetryStorage({ distDir: process.cwd() });
      config.setEnabled(false);
      await postinstall();

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
