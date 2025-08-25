"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propValidatorsDataGrid = void 0;
exports.validateProps = validateProps;
var warning_1 = require("@mui/x-internals/warning");
var utils_1 = require("../../utils/utils");
var signature_1 = require("../../constants/signature");
exports.propValidatorsDataGrid = [
    function (props) {
        return (props.autoPageSize &&
            props.autoHeight &&
            [
                'MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.',
                'You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.',
                '',
                'Please remove one of these two props.',
            ].join('\n')) ||
            undefined;
    },
    function (props) {
        return (props.paginationMode === 'client' &&
            props.paginationMeta != null &&
            [
                'MUI X: Usage of the `paginationMeta` prop with client-side pagination (`paginationMode="client"`) has no effect.',
                '`paginationMeta` is only meant to be used with `paginationMode="server"`.',
            ].join('\n')) ||
            undefined;
    },
    function (props) {
        return (props.signature === signature_1.GridSignature.DataGrid &&
            props.paginationMode === 'client' &&
            (0, utils_1.isNumber)(props.rowCount) &&
            [
                'MUI X: Usage of the `rowCount` prop with client side pagination (`paginationMode="client"`) has no effect.',
                '`rowCount` is only meant to be used with `paginationMode="server"`.',
            ].join('\n')) ||
            undefined;
    },
    function (props) {
        return (props.paginationMode === 'server' &&
            props.rowCount == null &&
            !props.dataSource &&
            [
                "MUI X: The `rowCount` prop must be passed using `paginationMode='server'`",
                'For more detail, see http://mui.com/components/data-grid/pagination/#index-based-pagination',
            ].join('\n')) ||
            undefined;
    },
];
function validateProps(props, validators) {
    validators.forEach(function (validator) {
        var message = validator(props);
        if (message) {
            (0, warning_1.warnOnce)(message, 'error');
        }
    });
}
