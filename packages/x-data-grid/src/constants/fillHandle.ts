// How a touch press on the fill handle of the cell selection starts a drag.
// `false`: after a long press, like the other touch drags. Swipes that start on the handle cell still scroll.
// `true`: at once. The handle cell gets `touch-action: none`, so a swipe that starts on it doesn't scroll.
export const FILL_HANDLE_IMMEDIATE_TOUCH_DRAG = false;
