export function roundToDecimalPlaces(value, decimals) {
    return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
