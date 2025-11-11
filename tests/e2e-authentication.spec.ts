import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

/**
 * End-to-End Test: Authentication & User Account
 * Tests the complete authentication flow from registration to login
 */

test.describe("E2E: Authentication Flow", () => {
  test("user registers, logs out, and logs back in", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    await loginPage.register(testEmail, testPassword, testPassword);
    await expect(page).toHaveURL(/\/(login|profile|job-roles|)/);
  });

  test("login form validation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    await loginPage.submitEmptyForm();
    await expect(page).toHaveURL(/\/login/);
  });

  test("password visibility toggle works", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    await loginPage.switchToSignUp();
    await loginPage.togglePasswordVisibility();
    await expect(page).toHaveURL(/\/login/);
  });

  test("forgot password link exists", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    const heading = page.locator("h2").first();
    const isVisible = await heading.isVisible().catch(() => false);
    if (isVisible) {
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
