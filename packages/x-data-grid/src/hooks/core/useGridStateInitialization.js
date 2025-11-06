"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridStateInitialization = void 0;
var React = require("react");
var utils_1 = require("../utils");
var utils_2 = require("../../utils/utils");
var useGridStateInitialization = function (apiRef) {
    var controlStateMapRef = React.useRef({});
    var registerControlState = React.useCallback(function (controlStateItem) {
        controlStateMapRef.current[controlStateItem.stateId] = controlStateItem;
    }, []);
    var setState = React.useCallback(function (state, reason) {
        var newState;
        if ((0, utils_2.isFunction)(state)) {
            newState = state(apiRef.current.state);
        }
        else {
            newState = state;
        }
        if (apiRef.current.state === newState) {
            return false;
        }
        var apiRefWithNewState = {
            current: {
                state: newState,
            },
        };
        var ignoreSetState = false;
        // Apply the control state constraints
        var updatedControlStateIds = [];
        Object.keys(controlStateMapRef.current).forEach(function (stateId) {
            var controlState = controlStateMapRef.current[stateId];
            var oldSubState = controlState.stateSelector(apiRef);
            var newSubState = controlState.stateSelector(apiRefWithNewState);
            if (newSubState === oldSubState) {
                return;
            }
            updatedControlStateIds.push({
                stateId: controlState.stateId,
                hasPropChanged: newSubState !== controlState.propModel,
            });
            // The state is controlled, the prop should always win
            if (controlState.propModel !== undefined && newSubState !== controlState.propModel) {
                ignoreSetState = true;
            }
        });
        if (updatedControlStateIds.length > 1) {
            // Each hook modify its own state, and it should not leak
            // Events are here to forward to other hooks and apply changes.
            // You are trying to update several states in a no isolated way.
            throw new Error("You're not allowed to update several sub-state in one transaction. You already updated ".concat(updatedControlStateIds[0].stateId, ", therefore, you're not allowed to update ").concat(updatedControlStateIds
                .map(function (el) { return el.stateId; })
                .join(', '), " in the same transaction."));
        }
        if (!ignoreSetState) {
            // We always assign it as we mutate rows for perf reason.
            apiRef.current.state = newState;
            apiRef.current.publishEvent('stateChange', newState);
            apiRef.current.store.update(newState);
        }
        if (updatedControlStateIds.length === 1) {
            var _a = updatedControlStateIds[0], stateId = _a.stateId, hasPropChanged = _a.hasPropChanged;
            var controlState = controlStateMapRef.current[stateId];
            var model = controlState.stateSelector(apiRefWithNewState);
            if (controlState.propOnChange && hasPropChanged) {
                controlState.propOnChange(model, {
                    reason: reason,
                    api: apiRef.current,
                });
            }
            if (!ignoreSetState) {
                apiRef.current.publishEvent(controlState.changeEvent, model, { reason: reason });
            }
        }
        return !ignoreSetState;
    }, [apiRef]);
    var updateControlState = React.useCallback(function (key, state, reason) {
        return apiRef.current.setState(function (previousState) {
            var _a;
            return __assign(__assign({}, previousState), (_a = {}, _a[key] = state(previousState[key]), _a));
        }, reason);
    }, [apiRef]);
    var publicStateApi = {
        setState: setState,
    };
    var privateStateApi = {
        updateControlState: updateControlState,
        registerControlState: registerControlState,
    };
    (0, utils_1.useGridApiMethod)(apiRef, publicStateApi, 'public');
    (0, utils_1.useGridApiMethod)(apiRef, privateStateApi, 'private');
};
exports.useGridStateInitialization = useGridStateInitialization;
