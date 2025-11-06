"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridClipboard = void 0;
var React = require("react");
var utils_1 = require("../../utils");
var gridFocusStateSelector_1 = require("../focus/gridFocusStateSelector");
var csvSerializer_1 = require("../export/serializers/csvSerializer");
var keyboardUtils_1 = require("../../../utils/keyboardUtils");
var rowSelection_1 = require("../rowSelection");
function writeToClipboardPolyfill(data) {
    var span = document.createElement('span');
    span.style.whiteSpace = 'pre';
    span.style.userSelect = 'all';
    span.style.opacity = '0px';
    span.textContent = data;
    document.body.appendChild(span);
    var range = document.createRange();
    range.selectNode(span);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
        document.execCommand('copy');
    }
    finally {
        document.body.removeChild(span);
    }
}
function copyToClipboard(data) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(data).catch(function () {
            writeToClipboardPolyfill(data);
        });
    }
    else {
        writeToClipboardPolyfill(data);
    }
}
function hasNativeSelection(element) {
    var _a;
    // When getSelection is called on an <iframe> that is not displayed Firefox will return null.
    if ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString()) {
        return true;
    }
    // window.getSelection() returns an empty string in Firefox for selections inside a form element.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=85686.
    // Instead, we can use element.selectionStart that is only defined on form elements.
    if (element && (element.selectionEnd || 0) - (element.selectionStart || 0) > 0) {
        return true;
    }
    return false;
}
/**
 * @requires useGridCsvExport (method)
 * @requires useGridSelection (method)
 */
var useGridClipboard = function (apiRef, props) {
    var ignoreValueFormatterProp = props.ignoreValueFormatterDuringExport;
    var ignoreValueFormatter = (typeof ignoreValueFormatterProp === 'object'
        ? ignoreValueFormatterProp === null || ignoreValueFormatterProp === void 0 ? void 0 : ignoreValueFormatterProp.clipboardExport
        : ignoreValueFormatterProp) || false;
    var clipboardCopyCellDelimiter = props.clipboardCopyCellDelimiter;
    var handleCopy = React.useCallback(function (event) {
        if (!(0, keyboardUtils_1.isCopyShortcut)(event)) {
            return;
        }
        // Do nothing if there's a native selection
        if (hasNativeSelection(event.target)) {
            return;
        }
        var textToCopy = '';
        var selectedRowsCount = (0, rowSelection_1.gridRowSelectionCountSelector)(apiRef);
        if (selectedRowsCount > 0) {
            textToCopy = apiRef.current.getDataAsCsv({
                includeHeaders: false,
                delimiter: clipboardCopyCellDelimiter,
                shouldAppendQuotes: false,
                escapeFormulas: false,
            });
        }
        else {
            var focusedCell = (0, gridFocusStateSelector_1.gridFocusCellSelector)(apiRef);
            if (focusedCell) {
                var cellParams = apiRef.current.getCellParams(focusedCell.id, focusedCell.field);
                textToCopy = (0, csvSerializer_1.serializeCellValue)(cellParams, {
                    csvOptions: {
                        delimiter: clipboardCopyCellDelimiter,
                        shouldAppendQuotes: false,
                        escapeFormulas: false,
                    },
                    ignoreValueFormatter: ignoreValueFormatter,
                });
            }
        }
        textToCopy = apiRef.current.unstable_applyPipeProcessors('clipboardCopy', textToCopy);
        if (textToCopy) {
            copyToClipboard(textToCopy);
            apiRef.current.publishEvent('clipboardCopy', textToCopy);
        }
    }, [apiRef, ignoreValueFormatter, clipboardCopyCellDelimiter]);
    (0, utils_1.useGridNativeEventListener)(apiRef, function () { return apiRef.current.rootElementRef.current; }, 'keydown', handleCopy);
    (0, utils_1.useGridEventPriority)(apiRef, 'clipboardCopy', props.onClipboardCopy);
};
exports.useGridClipboard = useGridClipboard;
