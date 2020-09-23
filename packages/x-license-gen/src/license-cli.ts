/* eslint-disable no-console */
import * as program from 'commander';
import { generateLicence } from './generateLicense';

const oneDayInMs = 1000 * 60 * 60 * 24;

export function licenseGenCli(args: any) {
  program
    .option('-o, --order <order>', 'Order number id')
    .option('-e, --expiry <expiry>', 'Number of days from now until expiry date', '366')
    .action(() => {
      if (!program.order) {
        throw new Error(
          'Material-UI: You forgot to pass an order number. $ > licensegen -o order_123.',
        );
      }

      const licenseDetails = {
        expiryDate: new Date(new Date().getTime() + parseInt(program.expiry, 10) * oneDayInMs),
        orderNumber: program.order,
      };

      console.log(
        `Generating new license number for order ${
          licenseDetails.orderNumber
        } with expiry date ${licenseDetails.expiryDate.toLocaleDateString()}`,
      );
      const license = generateLicence(licenseDetails);
      console.log(`New license: \n${license}`);
    })
    .parse(args);
}
