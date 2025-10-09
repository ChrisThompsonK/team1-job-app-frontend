import { describe, expect, it } from "vitest";
import {
  buildPaginationData,
  buildPaginationUrl,
  buildQueryString,
} from "./urlBuilder.js";

describe("urlBuilder", () => {
  describe("buildQueryString", () => {
    it("should return empty string for empty filters", () => {
      const result = buildQueryString({});
      expect(result).toBe("");
    });

    it("should build query string with single filter", () => {
      const result = buildQueryString({ search: "engineer" });
      expect(result).toBe("?search=engineer");
    });

    it("should build query string with multiple filters", () => {
      const result = buildQueryString({
        search: "engineer",
        capability: "Engineering",
        band: "Senior",
      });
      expect(result).toContain("search=engineer");
      expect(result).toContain("capability=Engineering");
      expect(result).toContain("band=Senior");
      expect(result.startsWith("?")).toBe(true);
    });

    it("should handle special characters in filters", () => {
      const result = buildQueryString({
        search: "data & analytics",
      });
      expect(result).toBe("?search=data+%26+analytics");
    });

    it("should include pagination parameters", () => {
      const result = buildQueryString({
        page: 2,
        limit: 10,
      });
      expect(result).toBe("?page=2&limit=10");
    });

    it("should include sort parameters", () => {
      const result = buildQueryString({
        sortBy: "name",
        sortOrder: "asc",
      });
      expect(result).toBe("?sortBy=name&sortOrder=asc");
    });
  });

  describe("buildPaginationUrl", () => {
    it("should build URL with page number", () => {
      const result = buildPaginationUrl(2, {});
      expect(result).toBe("/job-roles?page=2");
    });

    it("should build URL with page number and filters", () => {
      const result = buildPaginationUrl(3, {
        search: "engineer",
        capability: "Engineering",
      });
      expect(result).toContain("/job-roles?");
      expect(result).toContain("page=3");
      expect(result).toContain("search=engineer");
      expect(result).toContain("capability=Engineering");
    });

    it("should preserve all current filters", () => {
      const result = buildPaginationUrl(2, {
        search: "test",
        capability: "Engineering",
        band: "Senior",
        location: "London",
        status: "open",
        sortBy: "name",
        sortOrder: "asc",
      });
      expect(result).toContain("search=test");
      expect(result).toContain("capability=Engineering");
      expect(result).toContain("band=Senior");
      expect(result).toContain("location=London");
      expect(result).toContain("status=open");
      expect(result).toContain("sortBy=name");
      expect(result).toContain("sortOrder=asc");
    });
  });

  describe("buildPaginationData", () => {
    it("should build pagination data for first page", () => {
      const result = buildPaginationData(1, 5, 50, {});

      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(5);
      expect(result.totalItems).toBe(50);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrevious).toBe(false);
      expect(result.nextUrl).toBe("/job-roles?page=2");
      expect(result.previousUrl).toBe(null);
    });

    it("should build pagination data for middle page", () => {
      const result = buildPaginationData(3, 5, 50, {});

      expect(result.currentPage).toBe(3);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrevious).toBe(true);
      expect(result.nextUrl).toBe("/job-roles?page=4");
      expect(result.previousUrl).toBe("/job-roles?page=2");
    });

    it("should build pagination data for last page", () => {
      const result = buildPaginationData(5, 5, 50, {});

      expect(result.currentPage).toBe(5);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(true);
      expect(result.nextUrl).toBe(null);
      expect(result.previousUrl).toBe("/job-roles?page=4");
    });

    it("should include active page in page links", () => {
      const result = buildPaginationData(3, 5, 50, {});

      const activePage = result.pageLinks.find((link) => link.isActive);
      expect(activePage).toBeDefined();
      expect(activePage?.page).toBe(3);
    });

    it("should include first and last pages in links", () => {
      const result = buildPaginationData(5, 10, 100, {});

      const pages = result.pageLinks
        .filter((link) => !link.isEllipsis)
        .map((link) => link.page);
      expect(pages).toContain(1);
      expect(pages).toContain(10);
    });

    it("should include pages near current page", () => {
      const result = buildPaginationData(5, 10, 100, {});

      const pages = result.pageLinks
        .filter((link) => !link.isEllipsis)
        .map((link) => link.page);
      expect(pages).toContain(4); // currentPage - 1
      expect(pages).toContain(5); // currentPage
      expect(pages).toContain(6); // currentPage + 1
    });

    it("should include ellipsis for gaps", () => {
      const result = buildPaginationData(5, 10, 100, {});

      const hasEllipsis = result.pageLinks.some((link) => link.isEllipsis);
      expect(hasEllipsis).toBe(true);
    });

    it("should preserve filters in pagination URLs", () => {
      const result = buildPaginationData(2, 5, 50, {
        search: "engineer",
        capability: "Engineering",
      });

      expect(result.nextUrl).toContain("search=engineer");
      expect(result.nextUrl).toContain("capability=Engineering");
      expect(result.previousUrl).toContain("search=engineer");
      expect(result.previousUrl).toContain("capability=Engineering");

      const pageLink = result.pageLinks.find((link) => link.page === 3);
      expect(pageLink?.url).toContain("search=engineer");
      expect(pageLink?.url).toContain("capability=Engineering");
    });

    it("should handle single page correctly", () => {
      const result = buildPaginationData(1, 1, 10, {});

      expect(result.hasNext).toBe(false);
      expect(result.hasPrevious).toBe(false);
      expect(result.nextUrl).toBe(null);
      expect(result.previousUrl).toBe(null);
      expect(result.pageLinks).toHaveLength(1);
    });
  });
});
