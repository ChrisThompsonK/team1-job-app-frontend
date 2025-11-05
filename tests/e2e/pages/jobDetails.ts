import { type Page } from "@playwright/test";

export class JobDetailsPage {
  constructor(private page: Page) {}

  async applyForJob(): Promise<void> {
    const applyButton = this.page.getByRole('link', { name: 'Apply Now' });
    await applyButton.click();
  }
}
