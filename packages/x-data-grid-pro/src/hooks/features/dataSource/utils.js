import { GRID_ROOT_GROUP_ID, } from '@mui/x-data-grid';
const MAX_CONCURRENT_REQUESTS = Infinity;
export var RequestStatus;
(function (RequestStatus) {
    RequestStatus[RequestStatus["QUEUED"] = 0] = "QUEUED";
    RequestStatus[RequestStatus["PENDING"] = 1] = "PENDING";
    RequestStatus[RequestStatus["SETTLED"] = 2] = "SETTLED";
    RequestStatus[RequestStatus["UNKNOWN"] = 3] = "UNKNOWN";
})(RequestStatus || (RequestStatus = {}));
/**
 * Fetches row children from the server with option to limit the number of concurrent requests
 * Determines the status of a request based on the enum `RequestStatus`
 * Uses `GridRowId` to uniquely identify a request
 */
export class NestedDataManager {
    pendingRequests = new Set();
    queuedRequests = new Set();
    settledRequests = new Set();
    api;
    maxConcurrentRequests;
    constructor(privateApiRef, maxConcurrentRequests = MAX_CONCURRENT_REQUESTS) {
        this.api = privateApiRef.current;
        this.maxConcurrentRequests = maxConcurrentRequests;
    }
    processQueue = async () => {
        if (this.queuedRequests.size === 0 || this.pendingRequests.size >= this.maxConcurrentRequests) {
            return;
        }
        const loopLength = Math.min(this.maxConcurrentRequests - this.pendingRequests.size, this.queuedRequests.size);
        if (loopLength === 0) {
            return;
        }
        const fetchQueue = Array.from(this.queuedRequests);
        for (let i = 0; i < loopLength; i += 1) {
            const id = fetchQueue[i];
            this.queuedRequests.delete(id);
            this.pendingRequests.add(id);
            this.api.fetchRowChildren(id);
        }
    };
    queue = async (ids, options = {}) => {
        const { showChildrenLoading = true } = options;
        const loadingIds = {};
        ids.forEach((id) => {
            this.queuedRequests.add(id);
            if (showChildrenLoading) {
                loadingIds[id] = true;
            }
        });
        if (showChildrenLoading) {
            this.api.setState((state) => ({
                ...state,
                dataSource: {
                    ...state.dataSource,
                    loading: {
                        ...state.dataSource.loading,
                        ...loadingIds,
                    },
                },
            }));
        }
        this.processQueue();
    };
    setRequestSettled = (id) => {
        this.pendingRequests.delete(id);
        this.settledRequests.add(id);
        this.processQueue();
    };
    clear = () => {
        this.queuedRequests.clear();
        Array.from(this.pendingRequests).forEach((id) => this.clearPendingRequest(id));
    };
    clearPendingRequest = (id) => {
        this.api.dataSource.setChildrenLoading(id, false);
        this.pendingRequests.delete(id);
        this.processQueue();
    };
    getRequestStatus = (id) => {
        if (this.pendingRequests.has(id)) {
            return RequestStatus.PENDING;
        }
        if (this.queuedRequests.has(id)) {
            return RequestStatus.QUEUED;
        }
        if (this.settledRequests.has(id)) {
            return RequestStatus.SETTLED;
        }
        return RequestStatus.UNKNOWN;
    };
    getActiveRequestsCount = () => this.pendingRequests.size + this.queuedRequests.size;
}
export const getGroupKeys = (tree, rowId) => {
    const rowNode = tree[rowId];
    let currentNodeId = rowNode.parent;
    const groupKeys = [];
    while (currentNodeId && currentNodeId !== GRID_ROOT_GROUP_ID) {
        const currentNode = tree[currentNodeId];
        groupKeys.push(currentNode.groupingKey ?? '');
        currentNodeId = currentNode.parent;
    }
    return groupKeys.reverse();
};
