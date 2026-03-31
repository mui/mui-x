export const getGridLocalization = (gridTranslations) => ({
    components: {
        MuiDataGrid: {
            defaultProps: {
                localeText: gridTranslations,
            },
        },
    },
});
export const formatNumber = (value, locale) => {
    const numValue = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(numValue)) {
        return String(value);
    }
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
        try {
            return new Intl.NumberFormat(locale).format(numValue);
        }
        catch {
            return String(numValue);
        }
    }
    return String(numValue);
};
// Helper to create formatNumber with a specific locale
export const buildLocaleFormat = (locale) => {
    return (value) => formatNumber(value, locale);
};
