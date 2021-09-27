/* eslint-disable no-console */
import * as yargs from 'yargs';
import { generateLicence } from './generateLicense';

const oneDayInMs = 1000 * 60 * 60 * 24;

interface HandlerArgv {
  order: string;
  expiry: string;
}

export function licenseGenCli() {
  yargs
    .command({
      command: '$0',
      describe: 'Generates Component.propTypes from TypeScript declarations',
      builder: (command) => {
        return command
          .option('order', {
            default: '',
            describe: 'Order number id.',
            type: 'string',
          })
          .option('expiry', {
            default: '366',
            describe: 'Number of days from now until expiry date.',
            type: 'string',
          });
      },
      handler: (argv: HandlerArgv) => {
        if (!argv.order) {
          throw new Error('MUI: You forgot to pass an order number. $ > licensegen -o order_123.');
        }

        const licenseDetails = {
          expiryDate: new Date(new Date().getTime() + parseInt(argv.expiry, 10) * oneDayInMs),
          orderNumber: argv.order,
        };

        console.log(
          `Generating new license number for order ${
            licenseDetails.orderNumber
          } with expiry date ${licenseDetails.expiryDate.toLocaleDateString()}`,
        );
        const license = generateLicence(licenseDetails);
        console.log(`New license: \n${license}`);
      },
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
}
