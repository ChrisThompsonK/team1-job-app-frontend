import { type Page } from "@playwright/test";

export class JobRolesPage {
  private readonly baseUrl = "http://localhost:3000";

  constructor(private page: Page) {}

  async clickJobRole(): Promise<void> {
    const viewJobDetailButton = this.page.locator(
      "(//div[contains(@class, 'job-role-card')])[12]//a[contains(@class, 'btn')]"
    );
    await viewJobDetailButton.click();
  }
  async downloadReport(): Promise<string> {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.page.click('a[href="/job-roles/export"]'),
    ]);
    return download.suggestedFilename();
  }
}
