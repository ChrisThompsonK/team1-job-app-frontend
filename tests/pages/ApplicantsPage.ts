import { Page, Locator, Download } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ApplicantsPage extends BasePage {
  private exportCSVLink: Locator;

  constructor(page: Page) {
    super(page);
    this.exportCSVLink = page.getByRole("link", { name: "Export CSV" });
  }

  async navigateToApplicants(): Promise<void> {
    const applicantsLink = this.getApplicantsLink();
    await applicantsLink.click();
    await this.waitForNetworkIdle();
  }

  async downloadCSV(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent("download", { timeout: 10000 }),
      this.exportCSVLink.click(),
    ]);
    return download;
  }

  async expectOnApplicantsPage(): Promise<void> {
    await this.expectUrl(/\/applicants/);
  }
}
