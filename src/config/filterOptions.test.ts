import { describe, expect, it } from "vitest";
import { FILTER_OPTIONS } from "./filterOptions.js";

describe("filterOptions", () => {
  describe("FILTER_OPTIONS", () => {
    it("should have locations with empty default option", () => {
      expect(FILTER_OPTIONS.locations).toBeDefined();
      expect(FILTER_OPTIONS.locations.length).toBeGreaterThan(0);
      expect(FILTER_OPTIONS.locations[0].value).toBe("");
      expect(FILTER_OPTIONS.locations[0].label).toBe("filters.allLocations");
    });

    it("should have at least one real location option", () => {
      const realLocations = FILTER_OPTIONS.locations.filter(
        (loc) => loc.value !== ""
      );
      expect(realLocations.length).toBeGreaterThan(0);
    });

    it("should have capabilities with empty default option", () => {
      expect(FILTER_OPTIONS.capabilities).toBeDefined();
      expect(FILTER_OPTIONS.capabilities.length).toBeGreaterThan(0);
      expect(FILTER_OPTIONS.capabilities[0].value).toBe("");
      expect(FILTER_OPTIONS.capabilities[0].label).toBe(
        "filters.allCapabilities"
      );
    });

    it("should have at least one real capability option", () => {
      const realCapabilities = FILTER_OPTIONS.capabilities.filter(
        (cap) => cap.value !== ""
      );
      expect(realCapabilities.length).toBeGreaterThan(0);
    });

    it("should have bands with empty default option", () => {
      expect(FILTER_OPTIONS.bands).toBeDefined();
      expect(FILTER_OPTIONS.bands.length).toBeGreaterThan(0);
      expect(FILTER_OPTIONS.bands[0].value).toBe("");
      expect(FILTER_OPTIONS.bands[0].label).toBe("filters.allBands");
    });

    it("should have at least one real band option", () => {
      const realBands = FILTER_OPTIONS.bands.filter(
        (band) => band.value !== ""
      );
      expect(realBands.length).toBeGreaterThan(0);
    });

    it("should have statuses with empty default option", () => {
      expect(FILTER_OPTIONS.statuses).toBeDefined();
      expect(FILTER_OPTIONS.statuses.length).toBeGreaterThan(0);
      expect(FILTER_OPTIONS.statuses[0].value).toBe("");
      expect(FILTER_OPTIONS.statuses[0].label).toBe("filters.allStatuses");
    });

    it("should have at least one real status option", () => {
      const realStatuses = FILTER_OPTIONS.statuses.filter(
        (status) => status.value !== ""
      );
      expect(realStatuses.length).toBeGreaterThan(0);
    });

    it("should have all options with both value and label", () => {
      const allOptions = [
        ...FILTER_OPTIONS.locations,
        ...FILTER_OPTIONS.capabilities,
        ...FILTER_OPTIONS.bands,
        ...FILTER_OPTIONS.statuses,
      ];

      allOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
        expect(typeof option.value).toBe("string");
        expect(typeof option.label).toBe("string");
      });
    });

    it("should not have duplicate values in locations", () => {
      const values = FILTER_OPTIONS.locations.map((loc) => loc.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it("should not have duplicate values in capabilities", () => {
      const values = FILTER_OPTIONS.capabilities.map((cap) => cap.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it("should not have duplicate values in bands", () => {
      const values = FILTER_OPTIONS.bands.map((band) => band.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });

    it("should not have duplicate values in statuses", () => {
      const values = FILTER_OPTIONS.statuses.map((status) => status.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });
});
