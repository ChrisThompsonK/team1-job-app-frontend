import { test, expect } from "@playwright/test";
import { promises as fs } from "fs";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ApplicantsPage } from "./pages/ApplicantsPage";

test.describe("E2E: Admin Actions", () => {
  test("admin views job report", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    await loginPage.login("admin@jobapp.com", "password123");
    const profilePage = new ProfilePage(page);
    await profilePage.expectOnProfilePage();

    await profilePage.clickApplicantsCard();
    const applicantsPage = new ApplicantsPage(page);
    await applicantsPage.expectOnApplicantsPage();

    const download = await applicantsPage.downloadCSV();
    const suggested = download.suggestedFilename();
    await expect(suggested).toContain(".csv");

    const tempPath = await download.path();
    expect(tempPath).not.toBeNull();

    const content = await fs.readFile(String(tempPath), "utf-8");
    await expect(content).toContain("Email");
  });

  test("non admin cannot view report", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.expectUrl(/\/login/);

    await loginPage.login("john.doe@example.com", "password123");
    const profilePage = new ProfilePage(page);
    await profilePage.expectOnProfilePage();

    const isApplicantsVisible = await profilePage.isApplicantsCardVisible();
    expect(isApplicantsVisible).toBe(false);
  });
});
