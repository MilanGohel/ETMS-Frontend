
export interface PaginatedList<T> {
  /** The items for the current page. */
  items: T[];

  /** The current page index (1-based). */
  pageIndex: number;

  /** The total number of pages. */
  totalPages: number;

  /** The total count of items across all pages. */
  totalCount: number;

  /** Indicates whether there is a previous page. */
  hasPreviousPage: boolean;

  /** Indicates whether there is a next page. */
  hasNextPage: boolean;
}

