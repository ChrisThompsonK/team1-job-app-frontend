import { type Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class LoginPage {
  private readonly baseUrl = "http://localhost:3000";

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/login`);
  }
  async expectOnLoginPage():Promise<void>{
    expect(this.page.url().split('?')[0]).toBe(`${this.baseUrl}/login`);
  }
  async login(email: string, password: string): Promise<void> {
    await this.page.fill('input[name=email]', email);
    await this.page.fill('input[name=password]', password);
    await Promise.all([
      this.page.waitForURL(`${this.baseUrl}/profile`),
      this.page.click('button[type=submit]'),
    ]);
  }
}
