# Playwright Example Test

This is a sample test file to demonstrate the structure. Delete this file when you're ready to write your actual tests.

```typescript
import { test, expect } from "@playwright/test";

test.describe("Example Test Suite", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");
    
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Job Application/);
  });

  test("navigation works", async ({ page }) => {
    await page.goto("/");
    
    // Click a link
    await page.click("a[href='/login']");
    
    // Verify navigation
    await expect(page).toHaveURL(/.*login/);
  });
});
```

## Page Object Model Example

```typescript
// tests/e2e/pages/LoginPage.ts
import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// Usage in test
import { LoginPage } from "./pages/LoginPage";

test("login flow", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("user@example.com", "password");
  await expect(page).toHaveURL(/.*dashboard/);
});
```
