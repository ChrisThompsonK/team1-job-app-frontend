import { IjobRole } from "../models/job-role";
import { jobRoleservice } from "./interfaces";

export class jobRole implements jobRoleservice{
    private jobRoles:IjobRole[]=[];

    constructor(initialJobRoles:IjobRole[]){
        this.jobRoles=[...initialJobRoles]
    }
    getAllJobs():IjobRole[]{
        return this.jobRoles;
    }
}