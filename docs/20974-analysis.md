# Issue #20974 Analysis

## Root Cause

When sort/filter model changes with server-side row grouping:

1. `sortModelChange` event fires
2. `debouncedFetchRows()` fetches **root level** rows only
3. `handleGroupedDataUpdate` updates root rows via `updateRows()`
4. **BUT** expanded children (previously fetched) still show OLD sort order
5. Children data is cached with OLD sort model and NOT re-fetched

## The Problem Code

In `useGridDataSourceBasePro.ts`, `handleGroupedDataUpdate`:
```typescript
if (keepChildrenExpanded === false) {
  apiRef.current.setRows(response.rows);  // Clears everything
} else {
  // Only updates ROOT level, children remain unchanged!
  apiRef.current.updateRows(response.rows.concat(rowsToDelete));
}
```

## Solution Options

### Option A: Collapse all groups on sort/filter change
When sort/filter model changes, pass `keepChildrenExpanded: false` to clear all and let user re-expand.

### Option B: Re-fetch all expanded children
After updating root rows, detect expanded groups and re-queue them for fetching with new sort/filter params.

### Option C: Clear children cache + re-fetch
Clear the cache for children data and trigger re-fetch for expanded groups.

## Recommended Fix (Option B/C hybrid)

1. In the base events, when `sortModelChange` or `filterModelChange` fires:
   - Clear the cache
   - Call `fetchRows()` with `keepChildrenExpanded: true`
2. After root update in `handleGroupedDataUpdate`:
   - Get all currently expanded group IDs
   - Re-queue them for fetching via `nestedDataManager.queue()`

This keeps groups expanded but refreshes their children with new sort/filter.
