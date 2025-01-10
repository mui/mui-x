export function useRangeGrid(parameters: useRangeGrid.Parameters): useRangeGrid.ReturnValue {}

export namespace useRangeGrid {
  export interface Parameters {
    /**
     * If `true`, editing dates by dragging is disabled.
     * @default false
     */
    disableDragEditing?: boolean;
    // TODO: Apply smart behavior based on the media que
    /**
     * If `true`, the hover preview is disabled.
     * The cells that would be selected if clicking on the hovered cell won't receive a data-preview attribute.
     * @default false
     */
    disableHoverPreview?: boolean;
  }

  export interface ReturnValue {}
}
