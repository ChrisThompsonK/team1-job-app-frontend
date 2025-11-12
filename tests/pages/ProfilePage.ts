import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  private applicantsCard: Locator;

  constructor(page: Page) {
    super(page);
    this.applicantsCard = page.getByRole("link", { name: /Manage Applicants/ });
  }

  async expectOnProfilePage(): Promise<void> {
    await this.expectUrl(/\/profile/);
  }

  async isApplicantsCardVisible(): Promise<boolean> {
    return this.applicantsCard.isVisible().catch(() => false);
  }

  async clickApplicantsCard(): Promise<void> {
    await this.applicantsCard.click();
    await this.waitForNetworkIdle();
  }
}
