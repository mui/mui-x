"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AdapterDateFnsV2_1 = require("@mui/x-date-pickers/AdapterDateFnsV2");
var describeGregorianAdapter_1 = require("test/utils/pickers/describeGregorianAdapter");
var locale_1 = require("date-fns/locale");
describe('<AdapterDateFnsV2 />', function () {
    (0, describeGregorianAdapter_1.describeGregorianAdapter)(AdapterDateFnsV2_1.AdapterDateFns, {
        formatDateTime: 'yyyy-MM-dd HH:mm:ss',
        setDefaultTimezone: function () { },
        frenchLocale: locale_1.fr,
    });
});
