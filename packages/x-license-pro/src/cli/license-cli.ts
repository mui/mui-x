/* eslint-disable no-console */
import * as yargs from 'yargs';
import { generateLicense } from '../generateLicense/generateLicense';
import { base64Decode } from '../encoding/base64';
import { LicenseScope } from '../utils/licenseScope';
import { LicensingModel } from '../utils/licensingModel';

const oneDayInMs = 1000 * 60 * 60 * 24;

interface LicenseGenArgv {
  order: string;
  expiry: string;
  scope: string;
}

interface LicenseDecodeArgv {
  key: string;
}

export function licenseDecodeCli() {
  yargs
    .command({
      command: '$0',
      describe: 'Decode a license key',
      builder: (command) => {
        return command.option('key', {
          default: '',
          alias: 'k',
          describe: 'License key.',
          type: 'string',
        });
      },
      handler: (argv: yargs.ArgumentsCamelCase<LicenseDecodeArgv>) => {
        if (!argv.key) {
          throw new Error('MUI: You forgot to pass a license key. $ > licensegen -k xxx');
        }

        console.log(`Decoding license key "${argv.key}"`);
        const license = base64Decode(argv.key.substr(32));
        console.log(`Decoded license: \n${license}`);
      },
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
}

export function licenseGenCli() {
  yargs
    .command({
      command: '$0',
      describe: 'Generates a license key',
      builder: (command) => {
        return command
          .option('order', {
            default: '',
            alias: 'o',
            describe: 'Order number id.',
            type: 'string',
          })
          .option('expiry', {
            default: '366',
            describe: 'Number of days from now until expiry date.',
            type: 'string',
          })
          .option('scope', {
            default: 'pro',
            alias: 's',
            describe: 'The license scope.',
            type: 'string',
          })
          .option('licensingModel', {
            default: 'subscription',
            alias: 'l',
            describe: 'The license sales model.',
            type: 'string',
          });
      },
      handler: (argv: yargs.ArgumentsCamelCase<LicenseGenArgv>) => {
        if (!argv.order) {
          throw new Error('MUI: You forgot to pass an order number. $ > licensegen -o order_123.');
        }

        const licenseDetails = {
          expiryDate: new Date(new Date().getTime() + parseInt(argv.expiry, 10) * oneDayInMs),
          orderNumber: argv.order,
          scope: argv.scope as LicenseScope | undefined,
          licensingModel: argv.licensingModel as LicensingModel | undefined,
        };

        console.log(
          `Generating new license number for order ${
            licenseDetails.orderNumber
          } with expiry date ${licenseDetails.expiryDate.toLocaleDateString()} and scope "${
            licenseDetails.scope
          }"`,
        );
        const license = generateLicense(licenseDetails);
        console.log(`New license: \n${license}`);
      },
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
}
