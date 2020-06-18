import { generateLicence } from './generateLicense';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const program = require('commander');
const oneDayInMs = 1000 * 60 * 60 * 24;

export function licenseGenCli(args: any) {
  program
    .option('-o, --order <order>', 'Order number id')
    .option('-e, --expiry <expiry>', 'Number of days from now until expiry date', '366')
    .action(function() {
      if(!program.order) {
        throw new Error('You forgot to pass an order number. $ > licensegen -o order_123')
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
