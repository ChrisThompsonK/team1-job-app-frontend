import { test } from "@playwright/test";
import { BasePage } from "./pages/BasePage";
import { JobRolesPage } from "./pages/JobRolesPage";

/**
 * End-to-End Test: Job Seeker Journey
 * Tests the complete flow of a user browsing and applying for a job
 */

test.describe("E2E: Job Seeker Journey", () => {
  test("complete job search and application flow", async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goto("/");
    await basePage.expectUrl("/");

    const jobRolesPage = new JobRolesPage(page);
    await jobRolesPage.navigateToJobRoles();
    await jobRolesPage.expectOnJobRolesPage();

    await jobRolesPage.filterAndApply(1);
    await jobRolesPage.viewFirstJobDetails();
    await jobRolesPage.expectOnJobDetailPage();
  });

  test("job seeker filters jobs", async ({ page }) => {
    const _basePage = new BasePage(page);
    const jobRolesPage = new JobRolesPage(page);
    await jobRolesPage.navigateToJobRoles();
    await jobRolesPage.expectOnJobRolesPage();

    await jobRolesPage.filterAndApply(1);
    await jobRolesPage.expectOnJobRolesPage();
  });

  test("job seeker navigates pagination", async ({ page }) => {
    const jobRolesPage = new JobRolesPage(page);
    await jobRolesPage.navigateToJobRoles();
    await jobRolesPage.expectOnJobRolesPage();

    await jobRolesPage.filterAndApply(1);
    await jobRolesPage.expectOnJobRolesPage();

    await jobRolesPage.goToNextPageIfAvailable();
  });
});
