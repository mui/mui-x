import { FeatureMode } from '../featureMode';

/**
 * Object passed as parameter of the page changed event handler.
 */
export interface PageChangedParams {
  /**
   * The new page.
   */
  page: number;
  /**
   * The total number of pages.
   */
  pageCount: number;
  /**
   * The number of rows in a page.
   */
  pageSize: number;
  /**
   * The total number of rows.
   */
  rowCount: number;
  paginationMode: FeatureMode;
}
