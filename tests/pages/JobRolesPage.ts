import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class JobRolesPage extends BasePage {
  private locationSelect: Locator;
  private applyFiltersButton: Locator;
  private viewDetailsLink: Locator;
  private nextButton: Locator;

  constructor(page: Page) {
    super(page);
    this.locationSelect = page
      .locator("select")
      .filter({ hasText: "All Locations" })
      .first();
    this.applyFiltersButton = page.getByRole("button", {
      name: "Apply Filters",
    });
    this.viewDetailsLink = page
      .getByRole("link", { name: "View Details" })
      .first();
    this.nextButton = page.getByRole("link", { name: "Next" });
  }

  async navigateToJobRoles(): Promise<void> {
    const jobRolesLink = this.getJobRolesLink();
    const isVisible = await jobRolesLink.isVisible().catch(() => false);
    if (isVisible) {
      await jobRolesLink.click();
      await this.waitForNetworkIdle();
    } else {
      await this.page.goto("/job-roles", { waitUntil: "networkidle" });
    }
  }

  async selectLocation(index: number): Promise<void> {
    await this.locationSelect.selectOption({ index });
  }

  async applyFilters(): Promise<void> {
    await this.applyFiltersButton.click();
    await this.waitForNetworkIdle();
  }

  async viewFirstJobDetails(): Promise<void> {
    await this.viewDetailsLink.click();
    await this.waitForNetworkIdle();
  }

  async goToNextPageIfAvailable(): Promise<void> {
    const isVisible = await this.nextButton.isVisible().catch(() => false);
    if (isVisible) {
      await this.nextButton.click();
      await this.waitForNetworkIdle();
    }
  }

  async filterAndApply(locationIndex: number): Promise<void> {
    await this.selectLocation(locationIndex);
    await this.applyFilters();
  }

  async expectOnJobRolesPage(): Promise<void> {
    await this.expectUrl(/\/job-roles/);
  }

  async expectOnJobDetailPage(): Promise<void> {
    await this.expectUrl(/\/job-roles\/\d+/);
  }
}
