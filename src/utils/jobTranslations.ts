/**
 * Translation utilities for job role properties
 */

/**
 * Normalize capability strings to match translation keys
 */
function normalizeCapabilityKey(capability: string): string {
  if (!capability) return "";

  const normalized = capability.toLowerCase().replace(/\s+/g, "");

  // Handle specific mappings from backend to translation keys
  const mappings: { [key: string]: string } = {
    "data&analytics": "dataAnalytics",
    dataanalytics: "dataAnalytics",
    "data & analytics": "dataAnalytics",
    workday: "workday",
    engineering: "engineering",
    product: "product",
    design: "design",
    platform: "platform",
    quality: "quality",
    architecture: "architecture",
    businessanalysis: "businessAnalysis",
    "business analysis": "businessAnalysis",
    security: "security",
  };

  return mappings[normalized] || normalized;
}

/**
 * Normalize band strings to match translation keys
 */
function normalizeBandKey(band: string): string {
  if (!band) return "";
  return band.toLowerCase();
}

/**
 * Normalize status strings to match translation keys
 */
function normalizeStatusKey(status: string): string {
  if (!status) return "";
  return status.toLowerCase();
}

/**
 * Get translated capability name
 */
export function getTranslatedCapability(capability: string, t: any): string {
  const key = normalizeCapabilityKey(capability);
  const translationKey = `filters.capabilities.${key}`;

  // Get the translation, fallback to original if not found
  const translated = t(translationKey);
  return translated !== translationKey ? translated : capability;
}

/**
 * Get translated band name
 */
export function getTranslatedBand(band: string, t: any): string {
  const key = normalizeBandKey(band);
  const translationKey = `filters.bands.${key}`;

  // Get the translation, fallback to original if not found
  const translated = t(translationKey);
  return translated !== translationKey ? translated : band;
}

/**
 * Get translated status name
 */
export function getTranslatedStatus(status: string, t: any): string {
  const key = normalizeStatusKey(status);
  const translationKey = `filters.statuses.${key}`;

  // Get the translation, fallback to original if not found
  const translated = t(translationKey);
  return translated !== translationKey ? translated : status;
}

/**
 * Common job titles translations
 * These are for very common job titles that appear frequently
 */
export function getTranslatedJobTitle(jobTitle: string, t: any): string {
  if (!jobTitle) return "";

  // Normalize the job title for matching
  const normalized = jobTitle.toLowerCase().trim();

  // For job titles, we'll add specific translations for common ones
  // but fall back to the original title if no translation exists
  const translationKey = `jobTitles.${normalized.replace(/\s+/g, "_").replace(/[^\w]/g, "")}`;

  const translated = t(translationKey);
  return translated !== translationKey ? translated : jobTitle;
}

/**
 * Get translated job description
 */
export function getTranslatedDescription(jobTitle: string, t: any): string {
  if (!jobTitle) return "";

  // Normalize the job title for matching
  const normalized = jobTitle.toLowerCase().trim();
  const translationKey = `jobDescriptions.${normalized.replace(/\s+/g, "_").replace(/[^\w_]/g, "")}`;

  const translated = t(translationKey);
  return translated !== translationKey ? translated : "";
}

/**
 * Get translated job responsibilities
 */
export function getTranslatedResponsibilities(
  jobTitle: string,
  t: any
): string {
  if (!jobTitle) return "";

  // Normalize the job title for matching
  const normalized = jobTitle.toLowerCase().trim();
  const translationKey = `jobResponsibilities.${normalized.replace(/\s+/g, "_").replace(/[^\w_]/g, "")}`;

  const translated = t(translationKey);
  return translated !== translationKey ? translated : "";
}
