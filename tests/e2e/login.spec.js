import {expect,test} from"@playwright/test";
import{LoginPage}from"./pages/LoginPage";
import{JobRolesPage}from"./pages/JobRolesPage";
import {IndexPage} from "./pages/index";
import {JobDetailsPage} from "./pages/jobDetails";
test.describe("Check the functionality of being sent to login page when not logged in and trying to apply for a job",()=>{
    test("User is redirected to login page when trying to apply for a job without being logged in",async({page})=>{
        const loginPage=new LoginPage(page);
        const jobRolesPage=new JobRolesPage(page);
        const indexPage=new IndexPage(page);
        const jobDetailsPage=new JobDetailsPage(page);
        await indexPage.navigate();
        await indexPage.navigateToJobRoles();
        await jobRolesPage.clickJobRole();
        await jobDetailsPage.applyForJob();
        await loginPage.expectOnLoginPage();
    });
})