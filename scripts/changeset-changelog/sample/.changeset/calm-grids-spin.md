---
'@mui/x-data-grid': minor
tag: DataGrid
pr: 1234567895
author: FakeAuthor
---

Fix scrollbar disappearing after multiple resizes.

The virtualizer now recomputes the scrollbar size on every resize observer
callback instead of only on the first one, so rapid drag-resizes no longer
leave the grid without a scrollbar.
