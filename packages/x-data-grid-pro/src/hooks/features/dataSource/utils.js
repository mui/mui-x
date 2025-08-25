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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupKeys = exports.NestedDataManager = exports.RequestStatus = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var MAX_CONCURRENT_REQUESTS = Infinity;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus[RequestStatus["QUEUED"] = 0] = "QUEUED";
    RequestStatus[RequestStatus["PENDING"] = 1] = "PENDING";
    RequestStatus[RequestStatus["SETTLED"] = 2] = "SETTLED";
    RequestStatus[RequestStatus["UNKNOWN"] = 3] = "UNKNOWN";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Determines the status of a request based on the enum `RequestStatus`
 * Uses `GridRowId` to uniquely identify a request
 */
var NestedDataManager = /** @class */ (function () {
    function NestedDataManager(privateApiRef, maxConcurrentRequests) {
        if (maxConcurrentRequests === void 0) { maxConcurrentRequests = MAX_CONCURRENT_REQUESTS; }
        var _this = this;
        this.pendingRequests = new Set();
        this.queuedRequests = new Set();
        this.settledRequests = new Set();
        this.processQueue = function () { return __awaiter(_this, void 0, void 0, function () {
            var loopLength, fetchQueue, i, id;
            return __generator(this, function (_a) {
                if (this.queuedRequests.size === 0 || this.pendingRequests.size >= this.maxConcurrentRequests) {
                    return [2 /*return*/];
                }
                loopLength = Math.min(this.maxConcurrentRequests - this.pendingRequests.size, this.queuedRequests.size);
                if (loopLength === 0) {
                    return [2 /*return*/];
                }
                fetchQueue = Array.from(this.queuedRequests);
                for (i = 0; i < loopLength; i += 1) {
                    id = fetchQueue[i];
                    this.queuedRequests.delete(id);
                    this.pendingRequests.add(id);
                    this.api.fetchRowChildren(id);
                }
                return [2 /*return*/];
            });
        }); };
        this.queue = function (ids) { return __awaiter(_this, void 0, void 0, function () {
            var loadingIds;
            var _this = this;
            return __generator(this, function (_a) {
                loadingIds = {};
                ids.forEach(function (id) {
                    _this.queuedRequests.add(id);
                    loadingIds[id] = true;
                });
                this.api.setState(function (state) { return (__assign(__assign({}, state), { dataSource: __assign(__assign({}, state.dataSource), { loading: __assign(__assign({}, state.dataSource.loading), loadingIds) }) })); });
                this.processQueue();
                return [2 /*return*/];
            });
        }); };
        this.setRequestSettled = function (id) {
            _this.pendingRequests.delete(id);
            _this.settledRequests.add(id);
            _this.processQueue();
        };
        this.clear = function () {
            _this.queuedRequests.clear();
            Array.from(_this.pendingRequests).forEach(function (id) { return _this.clearPendingRequest(id); });
        };
        this.clearPendingRequest = function (id) {
            _this.api.dataSource.setChildrenLoading(id, false);
            _this.pendingRequests.delete(id);
            _this.processQueue();
        };
        this.getRequestStatus = function (id) {
            if (_this.pendingRequests.has(id)) {
                return RequestStatus.PENDING;
            }
            if (_this.queuedRequests.has(id)) {
                return RequestStatus.QUEUED;
            }
            if (_this.settledRequests.has(id)) {
                return RequestStatus.SETTLED;
            }
            return RequestStatus.UNKNOWN;
        };
        this.getActiveRequestsCount = function () { return _this.pendingRequests.size + _this.queuedRequests.size; };
        this.api = privateApiRef.current;
        this.maxConcurrentRequests = maxConcurrentRequests;
    }
    return NestedDataManager;
}());
exports.NestedDataManager = NestedDataManager;
var getGroupKeys = function (tree, rowId) {
    var _a;
    var rowNode = tree[rowId];
    var currentNodeId = rowNode.parent;
    var groupKeys = [];
    while (currentNodeId && currentNodeId !== x_data_grid_1.GRID_ROOT_GROUP_ID) {
        var currentNode = tree[currentNodeId];
        groupKeys.push((_a = currentNode.groupingKey) !== null && _a !== void 0 ? _a : '');
        currentNodeId = currentNode.parent;
    }
    return groupKeys.reverse();
};
exports.getGroupKeys = getGroupKeys;
