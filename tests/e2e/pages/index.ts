import {type Page}from "@playwright/test";

export class IndexPage{
    private readonly baseUrl='http://localhost:3000';
    constructor(private page:Page){}
    
    async navigate():Promise<void>{
        await this.page.goto(`${this.baseUrl}/`);
    }
    async navigateToJobRoles():Promise<void>{
        const jobRolesLink = this.page.getByRole("link",{name:"Job Roles"}).first();
        await Promise.all([
            this.page.waitForURL(`${this.baseUrl}/job-roles`),
            jobRolesLink.click(),
        ]);
    }
}