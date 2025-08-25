"use strict";
'use client';
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridAiAssistant = exports.aiAssistantStateInitializer = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridAiAssistantSelectors_1 = require("./gridAiAssistantSelectors");
var DEFAULT_SAMPLE_COUNT = 5;
var aiAssistantStateInitializer = function (state, props) {
    var _a, _b, _c, _d;
    if (!props.aiAssistant) {
        return __assign(__assign({}, state), { aiAssistant: {
                activeConversationIndex: 0,
                conversations: [],
            } });
    }
    return __assign(__assign({}, state), { aiAssistant: {
            activeConversationIndex: 0,
            conversations: (_d = (_a = props.aiAssistantConversations) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.aiAssistant) === null || _c === void 0 ? void 0 : _c.conversations) !== null && _d !== void 0 ? _d : [],
        } });
};
exports.aiAssistantStateInitializer = aiAssistantStateInitializer;
var useGridAiAssistant = function (apiRef, props) {
    var onPrompt = props.onPrompt, allowAiAssistantDataSampling = props.allowAiAssistantDataSampling, slots = props.slots, disableColumnFilter = props.disableColumnFilter, disableRowGrouping = props.disableRowGrouping, disableAggregation = props.disableAggregation, disableColumnSorting = props.disableColumnSorting, disablePivoting = props.disablePivoting;
    var columnsLookup = (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef);
    var columns = Object.values(columnsLookup);
    var rows = Object.values((0, x_data_grid_pro_1.gridRowsLookupSelector)(apiRef));
    var isAiAssistantAvailable = !!props.aiAssistant;
    apiRef.current.registerControlState({
        stateId: 'aiAssistantConversations',
        propModel: props.aiAssistantConversations,
        propOnChange: props.onAiAssistantConversationsChange,
        stateSelector: gridAiAssistantSelectors_1.gridAiAssistantConversationsSelector,
        changeEvent: 'aiAssistantConversationsChange',
    });
    apiRef.current.registerControlState({
        stateId: 'aiAssistantActiveConversationIndex',
        propModel: props.aiAssistantActiveConversationIndex,
        propOnChange: props.onAiAssistantActiveConversationIndexChange,
        stateSelector: gridAiAssistantSelectors_1.gridAiAssistantActiveConversationIndexSelector,
        changeEvent: 'aiAssistantActiveConversationIndexChange',
    });
    var preferencePanelPreProcessing = React.useCallback(function (initialValue, value) {
        if (isAiAssistantAvailable &&
            slots.aiAssistantPanel &&
            value === x_data_grid_pro_1.GridPreferencePanelsValue.aiAssistant) {
            return <slots.aiAssistantPanel />;
        }
        return initialValue;
    }, [isAiAssistantAvailable, slots]);
    var collectSampleData = React.useCallback(function () {
        var columnExamples = {};
        columns.forEach(function (column) {
            columnExamples[column.field] = Array.from({
                length: Math.min(DEFAULT_SAMPLE_COUNT, rows.length),
            }).map(function () {
                var row = rows[Math.floor(Math.random() * rows.length)];
                if (column.valueGetter) {
                    return column.valueGetter(row[column.field], row, column, apiRef);
                }
                return row[column.field];
            });
        });
        return columnExamples;
    }, [apiRef, columns, rows]);
    var getPromptContext = React.useCallback(function (allowDataSampling) {
        if (allowDataSampling === void 0) { allowDataSampling = false; }
        if (!isAiAssistantAvailable) {
            return '';
        }
        var examples = allowDataSampling ? collectSampleData() : {};
        var columnsContext = columns.map(function (column) {
            var _a, _b, _c, _d, _e, _f;
            return ({
                field: column.field,
                description: (_a = column.description) !== null && _a !== void 0 ? _a : null,
                examples: (_c = (_b = examples[column.field]) !== null && _b !== void 0 ? _b : column.examples) !== null && _c !== void 0 ? _c : [],
                type: (_d = column.type) !== null && _d !== void 0 ? _d : 'string',
                allowedOperators: (_f = (_e = column.filterOperators) === null || _e === void 0 ? void 0 : _e.map(function (operator) { return operator.value; })) !== null && _f !== void 0 ? _f : [],
            });
        });
        return JSON.stringify(columnsContext);
    }, [columns, collectSampleData, isAiAssistantAvailable]);
    var applyPromptResult = React.useCallback(function (result) {
        var _a;
        if (!isAiAssistantAvailable) {
            return;
        }
        var interestColumns = [];
        if (!disableColumnFilter) {
            apiRef.current.setFilterModel({
                items: result.filters.map(function (filter, index) {
                    var _a;
                    var item = {
                        id: index,
                        field: filter.column,
                        operator: filter.operator,
                        value: filter.value,
                    };
                    var column = columnsLookup[filter.column];
                    if (column.type === 'singleSelect') {
                        var options = (_a = (0, internals_1.getValueOptions)(column)) !== null && _a !== void 0 ? _a : [];
                        var found = options.find(function (option) { return typeof option === 'object' && option.label === filter.value; });
                        if (found) {
                            item.value = found.value;
                        }
                    }
                    return item;
                }),
                logicOperator: (_a = result.filterOperator) !== null && _a !== void 0 ? _a : x_data_grid_pro_1.GridLogicOperator.And,
                quickFilterValues: [],
            });
            interestColumns.push.apply(interestColumns, result.filters.map(function (f) { return f.column; }));
        }
        var appliedPivoting = false;
        if (!disablePivoting && 'columns' in result.pivoting) {
            apiRef.current.setPivotActive(true);
            apiRef.current.setPivotModel({
                columns: result.pivoting.columns.map(function (c) { return ({ field: c.column, sort: c.direction }); }),
                rows: result.pivoting.rows.map(function (r) { return ({ field: r }); }),
                values: result.pivoting.values.map(function (valueObj) {
                    var field = Object.keys(valueObj)[0];
                    return { field: field, aggFunc: valueObj[field] };
                }),
            });
            appliedPivoting = true;
        }
        else if ('columns' in result.pivoting) {
            // if pivoting is disabled and there are pivoting results, try to move them into grouping and aggregation
            result.pivoting.columns.forEach(function (c) {
                result.grouping.push({ column: c.column });
            });
            result.pivoting.rows.forEach(function (r) {
                result.grouping.push({ column: r });
            });
            result.pivoting.values.forEach(function (valueObj) {
                var field = Object.keys(valueObj)[0];
                result.aggregation[field] = valueObj[field];
            });
            // remove the pivoting results data
            result.pivoting = {};
        }
        if (!disableRowGrouping && !appliedPivoting) {
            apiRef.current.setRowGroupingModel(result.grouping.map(function (g) { return g.column; }));
        }
        if (!disableAggregation && !appliedPivoting) {
            apiRef.current.setAggregationModel(result.aggregation);
            interestColumns.push.apply(interestColumns, Object.keys(result.aggregation));
        }
        if (!disableColumnSorting) {
            apiRef.current.setSortModel(result.sorting.map(function (s) { return ({ field: s.column, sort: s.direction }); }));
        }
        var visibleRowsData = (0, internals_1.getVisibleRows)(apiRef);
        var rowSelectionModel = { type: 'include', ids: new Set() };
        if (result.select !== -1) {
            for (var i = 0; i < result.select; i += 1) {
                var row = visibleRowsData.rows[i];
                var id = apiRef.current.getRowId(row);
                rowSelectionModel.ids.add(id);
            }
        }
        apiRef.current.setRowSelectionModel(rowSelectionModel);
        var targetIndex = Number(columnsLookup[x_data_grid_pro_1.GRID_CHECKBOX_SELECTION_FIELD] !== undefined) +
            Number(result.grouping.length);
        interestColumns.reverse().forEach(function (c) { return apiRef.current.setColumnIndex(c, targetIndex); });
    }, [
        apiRef,
        disableColumnFilter,
        disableRowGrouping,
        disableAggregation,
        disableColumnSorting,
        disablePivoting,
        columnsLookup,
        isAiAssistantAvailable,
    ]);
    var setActiveConversationId = React.useCallback(function (id) {
        if (!isAiAssistantAvailable) {
            return;
        }
        var conversations = (0, gridAiAssistantSelectors_1.gridAiAssistantConversationsSelector)(apiRef);
        var activeConversationIndex = (0, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationIndexSelector)(apiRef);
        if (!conversations[activeConversationIndex]) {
            return;
        }
        conversations[activeConversationIndex].id = id;
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { aiAssistant: __assign(__assign({}, state.aiAssistant), { conversations: conversations }) })); });
    }, [apiRef, isAiAssistantAvailable]);
    var setConversationPrompts = React.useCallback(function (index, callback) {
        if (!isAiAssistantAvailable) {
            return;
        }
        var currentConversations = (0, gridAiAssistantSelectors_1.gridAiAssistantConversationsSelector)(apiRef);
        var targetConversation = currentConversations[index];
        var newPrompts = typeof callback === 'function'
            ? callback(targetConversation === undefined ? [] : targetConversation.prompts)
            : callback;
        var newConversations = currentConversations.toSpliced(targetConversation === undefined ? currentConversations.length : index, 1, __assign(__assign({}, targetConversation), { title: newPrompts[newPrompts.length - 1].value, prompts: newPrompts }));
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { aiAssistant: __assign(__assign({}, state.aiAssistant), { conversations: newConversations }) })); });
    }, [apiRef, isAiAssistantAvailable]);
    var processPrompt = React.useCallback(function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var activeConversationIndex, activeConversation, date, response_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onPrompt) {
                        return [2 /*return*/, undefined];
                    }
                    activeConversationIndex = (0, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationIndexSelector)(apiRef);
                    activeConversation = (0, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationSelector)(apiRef);
                    date = Date.now();
                    apiRef.current.setLoading(true);
                    setConversationPrompts(activeConversationIndex, function (prevPrompts) { return __spreadArray(__spreadArray([], prevPrompts, true), [
                        {
                            value: value,
                            createdAt: new Date(date),
                            variant: 'processing',
                            helperText: apiRef.current.getLocaleText('promptProcessing'),
                        },
                    ], false); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onPrompt(value, getPromptContext(allowAiAssistantDataSampling), activeConversation === null || activeConversation === void 0 ? void 0 : activeConversation.id)];
                case 2:
                    response_1 = _a.sent();
                    applyPromptResult(response_1);
                    setActiveConversationId(response_1.conversationId);
                    setConversationPrompts(activeConversationIndex, function (prevPrompts) {
                        return prevPrompts.map(function (item) {
                            return item.createdAt.getTime() === date
                                ? __assign(__assign({}, item), { response: response_1, variant: 'success', helperText: '' }) : item;
                        });
                    });
                    return [2 /*return*/, response_1];
                case 3:
                    error_1 = _a.sent();
                    setConversationPrompts(activeConversationIndex, function (prevPrompts) {
                        return prevPrompts.map(function (item) {
                            return item.createdAt.getTime() === date
                                ? __assign(__assign({}, item), { variant: 'error', helperText: error_1.message }) : item;
                        });
                    });
                    return [2 /*return*/, error_1];
                case 4:
                    apiRef.current.setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [
        apiRef,
        allowAiAssistantDataSampling,
        onPrompt,
        getPromptContext,
        applyPromptResult,
        setConversationPrompts,
        setActiveConversationId,
    ]);
    var setActiveConversationIndex = React.useCallback(function (index) {
        apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { aiAssistant: __assign(__assign({}, state.aiAssistant), { activeConversationIndex: index }) })); });
        var conversation = (0, gridAiAssistantSelectors_1.gridAiAssistantActiveConversationSelector)(apiRef);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        return conversation;
    }, [apiRef]);
    var setConversations = React.useCallback(function (callback) {
        if (!isAiAssistantAvailable) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a;
            return (__assign(__assign({}, state), { aiAssistant: __assign(__assign({}, state.aiAssistant), { conversations: typeof callback === 'function' ? callback((_a = state.aiAssistant) === null || _a === void 0 ? void 0 : _a.conversations) : callback }) }));
        });
    }, [apiRef, isAiAssistantAvailable]);
    React.useEffect(function () {
        if (props.aiAssistantConversations) {
            setConversations(props.aiAssistantConversations);
        }
    }, [apiRef, props.aiAssistantConversations, setConversations]);
    React.useEffect(function () {
        if (props.aiAssistantActiveConversationIndex) {
            setActiveConversationIndex(props.aiAssistantActiveConversationIndex);
        }
    }, [apiRef, props.aiAssistantActiveConversationIndex, setActiveConversationIndex]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, {
        aiAssistant: {
            processPrompt: processPrompt,
            setConversations: setConversations,
            setActiveConversationIndex: setActiveConversationIndex,
        },
    }, 'public');
};
exports.useGridAiAssistant = useGridAiAssistant;
