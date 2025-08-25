"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTreeViewLabelItemPlugin = void 0;
var React = require("react");
var TreeViewProvider_1 = require("../../TreeViewProvider");
var useSelector_1 = require("../../hooks/useSelector");
var useTreeViewLabel_selectors_1 = require("./useTreeViewLabel.selectors");
var useTreeViewLabelItemPlugin = function (_a) {
    var props = _a.props;
    var store = (0, TreeViewProvider_1.useTreeViewContext)().store;
    var label = props.label, itemId = props.itemId;
    var _b = React.useState(label), labelInputValue = _b[0], setLabelInputValue = _b[1];
    var isItemEditable = (0, useSelector_1.useSelector)(store, useTreeViewLabel_selectors_1.selectorIsItemEditable, itemId);
    var isItemBeingEdited = (0, useSelector_1.useSelector)(store, useTreeViewLabel_selectors_1.selectorIsItemBeingEdited, itemId);
    React.useEffect(function () {
        if (!isItemBeingEdited) {
            setLabelInputValue(label);
        }
    }, [isItemBeingEdited, label]);
    return {
        propsEnhancers: {
            label: function () { return ({ editable: isItemEditable }); },
            labelInput: function (_a) {
                var externalEventHandlers = _a.externalEventHandlers, interactions = _a.interactions;
                if (!isItemEditable) {
                    return {};
                }
                var handleKeydown = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    var target = event.target;
                    if (event.key === 'Enter' && target.value) {
                        interactions.handleSaveItemLabel(event, target.value);
                    }
                    else if (event.key === 'Escape') {
                        interactions.handleCancelItemLabelEditing(event);
                    }
                };
                var handleBlur = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onBlur) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    if (event.defaultMuiPrevented) {
                        return;
                    }
                    if (event.target.value) {
                        interactions.handleSaveItemLabel(event, event.target.value);
                    }
                };
                var handleInputChange = function (event) {
                    var _a;
                    (_a = externalEventHandlers.onChange) === null || _a === void 0 ? void 0 : _a.call(externalEventHandlers, event);
                    setLabelInputValue(event.target.value);
                };
                return {
                    value: labelInputValue !== null && labelInputValue !== void 0 ? labelInputValue : '',
                    'data-element': 'labelInput',
                    onChange: handleInputChange,
                    onKeyDown: handleKeydown,
                    onBlur: handleBlur,
                    autoFocus: true,
                    type: 'text',
                };
            },
        },
    };
};
exports.useTreeViewLabelItemPlugin = useTreeViewLabelItemPlugin;
