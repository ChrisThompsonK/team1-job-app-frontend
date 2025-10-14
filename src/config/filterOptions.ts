/**
 * Configuration for job role filter options
 * These define the available filter values shown in the UI
 */

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  locations: FilterOption[];
  capabilities: FilterOption[];
  bands: FilterOption[];
  statuses: FilterOption[];
  sortOptions: FilterOption[];
  sortOrders: FilterOption[];
}

export const FILTER_OPTIONS: FilterOptions = {
  locations: [
    { value: "", label: "filters.allLocations" },
    { value: "Belfast, UK", label: "Belfast, UK" },
    { value: "Birmingham, UK", label: "Birmingham, UK" },
    { value: "Birmingham, USA", label: "Birmingham, USA" },
    { value: "Bristol, UK", label: "Bristol, UK" },
    { value: "Bucharest, Romania", label: "Bucharest, Romania" },
    { value: "Cambridge, UK", label: "Cambridge, UK" },
    { value: "Cardiff, UK", label: "Cardiff, UK" },
    { value: "Dublin, Ireland", label: "Dublin, Ireland" },
    { value: "Edinburgh, UK", label: "Edinburgh, UK" },
    { value: "Gdansk, Poland", label: "Gdansk, Poland" },
    { value: "Glasgow, UK", label: "Glasgow, UK" },
    { value: "Leeds, UK", label: "Leeds, UK" },
    { value: "London, UK", label: "London, UK" },
    { value: "Manchester, UK", label: "Manchester, UK" },
    { value: "Munich, Germany", label: "Munich, Germany" },
    { value: "Oxford, UK", label: "Oxford, UK" },
    { value: "Remote, UK", label: "Remote, UK" },
    { value: "Toronto, Canada", label: "Toronto, Canada" },
  ],
  capabilities: [
    { value: "", label: "filters.allCapabilities" },
    { value: "Data & Analytics", label: "filters.capabilities.dataAnalytics" },
    { value: "Workday", label: "Workday" },
    { value: "Engineering", label: "filters.capabilities.engineering" },
    { value: "Product", label: "filters.capabilities.product" },
    { value: "Design", label: "filters.capabilities.design" },
    { value: "Platform", label: "filters.capabilities.platform" },
    { value: "Quality", label: "filters.capabilities.quality" },
    { value: "Architecture", label: "filters.capabilities.architecture" },
    { value: "Business Analysis", label: "filters.capabilities.businessAnalysis" },
    { value: "Security", label: "filters.capabilities.security" },
  ],
  bands: [
    { value: "", label: "filters.allBands" },
    { value: "Junior", label: "filters.bands.junior" },
    { value: "Mid", label: "filters.bands.mid" },
    { value: "Senior", label: "filters.bands.senior" },
    { value: "Principal", label: "filters.bands.principal" },
  ],
  statuses: [
    { value: "", label: "filters.allStatuses" },
    { value: "open", label: "filters.statuses.open" },
    { value: "closed", label: "filters.statuses.closed" },
  ],
  sortOptions: [
    { value: "", label: "filters.sortOptions.default" },
    { value: "jobRoleName", label: "filters.sortOptions.jobTitle" },
    { value: "closingDate", label: "filters.sortOptions.closingDate" },
    { value: "band", label: "filters.sortOptions.band" },
    { value: "capability", label: "filters.sortOptions.capability" },
    { value: "location", label: "filters.sortOptions.location" },
    { value: "createdDate", label: "filters.sortOptions.datePosted" },
  ],
  sortOrders: [
    { value: "asc", label: "filters.sortOrders.ascending" },
    { value: "desc", label: "filters.sortOrders.descending" },
  ],
};
