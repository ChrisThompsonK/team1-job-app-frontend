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
}

export const FILTER_OPTIONS: FilterOptions = {
  locations: [
    { value: "", label: "All Locations" },
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
    { value: "", label: "All Capabilities" },
    { value: "Data & Analytics", label: "Data & Analytics" },
    { value: "Workday", label: "Workday" },
    { value: "Engineering", label: "Engineering" },
    { value: "Product", label: "Product" },
    { value: "Design", label: "Design" },
    { value: "Platform", label: "Platform" },
    { value: "Quality", label: "Quality" },
    { value: "Architecture", label: "Architecture" },
    { value: "Business Analysis", label: "Business Analysis" },
    { value: "Security", label: "Security" },
  ],
  bands: [
    { value: "", label: "All Bands" },
    { value: "Junior", label: "Junior" },
    { value: "Mid", label: "Mid" },
    { value: "Senior", label: "Senior" },
    { value: "Principal", label: "Principal" },
  ],
  statuses: [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ],
};
