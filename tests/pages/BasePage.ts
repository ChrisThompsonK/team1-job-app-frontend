import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async expectUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await expect(this.page).toHaveURL(url);
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    // Ensure DOM is actually rendered, not just network idle
    await this.page.locator("body").waitFor({ state: "visible" });
  }

  async waitForElement(selector: string | Locator): Promise<void> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: "visible", timeout: 5000 });
  }

  async waitForFormResponse(): Promise<void> {
    // Wait for either an error message or page navigation to complete
    const errorAlert = this.page.locator(".alert.alert-error");
    const pageReady = this.page.locator("body");

    await Promise.race([
      errorAlert
        .waitFor({ state: "visible", timeout: 5000 })
        .catch(() => undefined),
      pageReady.waitFor({ state: "visible", timeout: 5000 }),
    ]);

    // Brief wait to ensure DOM is settled
    await this.page.waitForLoadState("networkidle");
  }

  async clickNavigationLink(linkName: RegExp | string): Promise<void> {
    const link = this.page.getByRole("link", { name: linkName });
    await link.click();
    await this.waitForNetworkIdle();
  }

  async changeLanguage(languageCode: string): Promise<void> {
    const languageButton = this.page.getByRole("button", {
      name: "Change language",
    });
    await languageButton.click();

    const languageNames: Record<string, RegExp> = {
      es: /🇪🇸 Español/,
      fr: /🇫🇷 Français/,
      pl: /🇵🇱 Polski/,
      en: /🇬🇧 English/,
    };

    const languageName = languageNames[languageCode];
    if (languageName) {
      const languageLink = this.page.getByRole("link", { name: languageName });
      // Wait for the language link to be visible before clicking
      await languageLink.waitFor({ state: "visible", timeout: 5000 });
      await languageLink.click();
      await this.waitForNetworkIdle();
    }
  }

  getLoginLink(): Locator {
    return this.page.getByRole("link", { name: /Login/ });
  }

  getJobRolesLink(): Locator {
    return this.page.getByRole("link", { name: /Job Roles|Jobs|Browse Jobs/ });
  }

  getApplicantsLink(): Locator {
    return this.page.getByRole("link", { name: /Manage Applicants/ });
  }
}
