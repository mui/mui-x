"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIsFilled = exports.generateFilledQuantity = exports.randomName = exports.randomRating = exports.randomJobTitle = exports.randomUpdatedDate = exports.randomCreatedDate = exports.randomRateType = exports.randomContractType = exports.randomTaxCode = exports.randomCity = exports.randomAddress = exports.randomCurrency = exports.randomCountry = exports.randomCompanyName = exports.randomBrokerId = exports.randomTradeDate = exports.randomMaturityDate = exports.randomPnL = exports.randomStatusOptions = exports.randomIncoterm = exports.randomFeeRate = exports.randomQuantity = exports.randomUnitPriceCurrency = exports.randomUnitPrice = exports.randomPhoneNumber = exports.randomUrl = exports.randomEmail = exports.randomUserName = exports.randomTraderName = exports.randomCommodity = exports.randomDesk = exports.randomId = exports.randomColor = exports.randomBoolean = exports.randomArrayItem = exports.randomDate = exports.randomRate = exports.randomPrice = exports.randomInt = exports.random = void 0;
var chance_1 = require("chance");
var static_data_1 = require("./static-data");
var chance;
var chanceGuid;
if (typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM) {
    chance = new chance_1.Chance(function () { return 0.5; });
    chanceGuid = new chance_1.Chance(42);
}
else {
    chance = new chance_1.Chance();
    chanceGuid = chance;
}
/**
 * Wrap a data generator that returns a string and add a prefix if the value generated has already been given
 */
var uniquenessHandler = function (generator) {
    return function (data, context) {
        var _a;
        var rawValue = generator(data, context);
        if (!context.values) {
            return rawValue;
        }
        var valueCount = ((_a = context.values[rawValue]) !== null && _a !== void 0 ? _a : 0) + 1;
        context.values[rawValue] = valueCount + 1;
        if (valueCount > 1) {
            return "".concat(rawValue, " ").concat(valueCount);
        }
        return rawValue;
    };
};
function dateFuture(years, refDate) {
    var date = new Date();
    if (typeof refDate !== 'undefined') {
        date = new Date(Date.parse(refDate));
    }
    var range = {
        min: 1000,
        max: (years || 1) * 365 * 24 * 3600 * 1000,
    };
    // some time from now to N years later, in milliseconds
    var past = date.getTime() + chance.integer(range);
    date.setTime(past);
    return date;
}
function dateRecent(days, refDate) {
    var date = new Date();
    if (typeof refDate !== 'undefined') {
        date = new Date(Date.parse(refDate));
    }
    var range = {
        min: 1000,
        max: (days || 1) * 24 * 3600 * 1000,
    };
    // some time from now to N days ago, in milliseconds
    var past = date.getTime() - chance.integer(range);
    date.setTime(past);
    return date;
}
function datePast(years, refDate) {
    var date = new Date();
    if (typeof refDate !== 'undefined') {
        date = new Date(Date.parse(refDate));
    }
    var range = {
        min: 1000,
        max: (years || 1) * 365 * 24 * 3600 * 1000,
    };
    // some time from now to N years ago, in milliseconds
    var past = date.getTime() - chance.integer(range);
    date.setTime(past);
    return date;
}
var random = function (min, max) { return chance.floating({ min: min, max: max }); };
exports.random = random;
var randomInt = function (min, max) { return chance.integer({ min: min, max: max }); };
exports.randomInt = randomInt;
var randomPrice = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100000; }
    return Number((0, exports.random)(min, max).toFixed(2));
};
exports.randomPrice = randomPrice;
var randomRate = function () { return (0, exports.random)(0, 1); };
exports.randomRate = randomRate;
var randomDate = function (start, end) {
    return new Date(start.getTime() + chance.floating({ min: 0, max: 1 }) * (end.getTime() - start.getTime()));
};
exports.randomDate = randomDate;
var randomArrayItem = function (arr) { return arr[(0, exports.randomInt)(0, arr.length - 1)]; };
exports.randomArrayItem = randomArrayItem;
var randomBoolean = function () { return (0, exports.randomArrayItem)([true, false]); };
exports.randomBoolean = randomBoolean;
var randomColor = function () { return (0, exports.randomArrayItem)(static_data_1.COLORS); };
exports.randomColor = randomColor;
var randomId = function () { return chanceGuid.guid(); };
exports.randomId = randomId;
var randomDesk = function () { return "D-".concat(chance.integer({ min: 0, max: 10000 })); };
exports.randomDesk = randomDesk;
var randomCommodity = function () { return (0, exports.randomArrayItem)(static_data_1.COMMODITY_OPTIONS); };
exports.randomCommodity = randomCommodity;
var randomTraderName = function () { return chance.name(); };
exports.randomTraderName = randomTraderName;
var randomUserName = function () { return chance.twitter(); };
exports.randomUserName = randomUserName;
var randomEmail = function () { return chance.email(); };
exports.randomEmail = randomEmail;
var randomUrl = function () { return chance.url(); };
exports.randomUrl = randomUrl;
var randomPhoneNumber = function () { return chance.phone(); };
exports.randomPhoneNumber = randomPhoneNumber;
var randomUnitPrice = function () { return (0, exports.randomPrice)(1, 100); };
exports.randomUnitPrice = randomUnitPrice;
var randomUnitPriceCurrency = function () { return (0, exports.randomArrayItem)(static_data_1.CURRENCY_OPTIONS); };
exports.randomUnitPriceCurrency = randomUnitPriceCurrency;
var randomQuantity = function () { return (0, exports.randomInt)(1000, 100000); };
exports.randomQuantity = randomQuantity;
var randomFeeRate = function () { return Number((0, exports.random)(0.1, 0.4).toFixed(3)); };
exports.randomFeeRate = randomFeeRate;
var randomIncoterm = function () { return (0, exports.randomArrayItem)(static_data_1.INCOTERM_OPTIONS); };
exports.randomIncoterm = randomIncoterm;
var randomStatusOptions = function () { return (0, exports.randomArrayItem)(static_data_1.STATUS_OPTIONS); };
exports.randomStatusOptions = randomStatusOptions;
var randomPnL = function () { return (0, exports.random)(-100000000, 100000000); };
exports.randomPnL = randomPnL;
var randomMaturityDate = function () { return dateFuture(); };
exports.randomMaturityDate = randomMaturityDate;
var randomTradeDate = function () { return dateRecent(); };
exports.randomTradeDate = randomTradeDate;
var randomBrokerId = function () { return chance.guid(); };
exports.randomBrokerId = randomBrokerId;
var randomCompanyName = function () { return chance.company(); };
exports.randomCompanyName = randomCompanyName;
var randomCountry = function () { return (0, exports.randomArrayItem)(static_data_1.COUNTRY_ISO_OPTIONS); };
exports.randomCountry = randomCountry;
var randomCurrency = function () { return (0, exports.randomArrayItem)(static_data_1.CURRENCY_OPTIONS); };
exports.randomCurrency = randomCurrency;
var randomAddress = function () { return chance.address(); };
exports.randomAddress = randomAddress;
var randomCity = function () { return chance.city(); };
exports.randomCity = randomCity;
var randomTaxCode = function () { return (0, exports.randomArrayItem)(static_data_1.TAXCODE_OPTIONS); };
exports.randomTaxCode = randomTaxCode;
var randomContractType = function () { return (0, exports.randomArrayItem)(static_data_1.CONTRACT_TYPE_OPTIONS); };
exports.randomContractType = randomContractType;
var randomRateType = function () { return (0, exports.randomArrayItem)(static_data_1.RATE_TYPE_OPTIONS); };
exports.randomRateType = randomRateType;
var randomCreatedDate = function () { return datePast(); };
exports.randomCreatedDate = randomCreatedDate;
var randomUpdatedDate = function () { return dateRecent(); };
exports.randomUpdatedDate = randomUpdatedDate;
var randomJobTitle = function () { return chance.profession(); };
exports.randomJobTitle = randomJobTitle;
var randomRating = function () { return (0, exports.randomInt)(1, 5); };
exports.randomRating = randomRating;
exports.randomName = uniquenessHandler(function () { return chance.name(); });
var generateFilledQuantity = function (data) {
    return Number((data.quantity * (0, exports.randomRate)()).toFixed()) / data.quantity;
};
exports.generateFilledQuantity = generateFilledQuantity;
var generateIsFilled = function (data) {
    return data.quantity === data.filledQuantity;
};
exports.generateIsFilled = generateIsFilled;
