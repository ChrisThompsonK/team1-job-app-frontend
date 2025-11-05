import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { JobRolesPage } from "./pages/JobRolesPage";
import { ProfilePage } from "./pages/profile";

test.describe("Check the ability to generate and view reports", () => {
  test("Admin can download a report", async ({ page }) => {
    const adminEmail = "admin@jobapp.com";
    const adminPassword = "password123";

    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const jobRolesPage = new JobRolesPage(page);

    await loginPage.navigate();
    await loginPage.login(adminEmail, adminPassword);
    await profilePage.navigateToJobRoles();

    const filename = await jobRolesPage.downloadReport();
    expect(filename.length).toBeGreaterThan(0);
  });
});