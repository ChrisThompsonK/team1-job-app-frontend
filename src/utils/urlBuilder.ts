import type { JobFilterParams } from "../services/interfaces.js";

/**
 * Builds a query string from filter parameters
 */
export function buildQueryString(filters: JobFilterParams): string {
  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.capability) {
    params.append("capability", filters.capability);
  }
  if (filters.band) {
    params.append("band", filters.band);
  }
  if (filters.location) {
    params.append("location", filters.location);
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append("sortOrder", filters.sortOrder);
  }
  if (filters.page) {
    params.append("page", filters.page.toString());
  }
  if (filters.limit) {
    params.append("limit", filters.limit.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Builds a pagination URL with the current filters and a specific page number
 */
export function buildPaginationUrl(
  page: number,
  currentFilters: JobFilterParams
): string {
  const filters = { ...currentFilters, page };
  return `/job-roles${buildQueryString(filters)}`;
}

/**
 * Builds pagination data for the view including URLs for each page
 */
export interface PaginationLink {
  page: number;
  url: string;
  isActive: boolean;
  isEllipsis?: boolean;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextUrl: string | null;
  previousUrl: string | null;
  pageLinks: PaginationLink[];
}

export function buildPaginationData(
  currentPage: number,
  totalPages: number,
  totalItems: number,
  currentFilters: JobFilterParams
): PaginationData {
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  const nextUrl = hasNext
    ? buildPaginationUrl(currentPage + 1, currentFilters)
    : null;
  const previousUrl = hasPrevious
    ? buildPaginationUrl(currentPage - 1, currentFilters)
    : null;

  const pageLinks: PaginationLink[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const isActive = pageNum === currentPage;
    const isFirstOrLast = pageNum === 1 || pageNum === totalPages;
    const isNearCurrent =
      pageNum >= currentPage - 1 && pageNum <= currentPage + 1;

    if (isActive || isFirstOrLast || isNearCurrent) {
      pageLinks.push({
        page: pageNum,
        url: buildPaginationUrl(pageNum, currentFilters),
        isActive,
      });
    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
      // Add ellipsis markers
      if (pageLinks[pageLinks.length - 1]?.isEllipsis !== true) {
        pageLinks.push({
          page: pageNum,
          url: "",
          isActive: false,
          isEllipsis: true,
        });
      }
    }
  }

  return {
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrevious,
    nextUrl,
    previousUrl,
    pageLinks,
  };
}
