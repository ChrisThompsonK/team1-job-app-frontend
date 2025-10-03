import {Request, Response} from "express";
import type { JobRoleAPIService } from "../services/interfaces.js";

export class JobRoleAPIController {
    constructor(private jobRoleAPIService: JobRoleAPIService) {}
    
    public getJobRoles=async(_Req:Request,res:Response):Promise<void>=>{
        try{
            const jobRoles = await this.jobRoleAPIService.getAllJobs();
            if(jobRoles.length>0){
                res.status(200).json(jobRoles);
            }else{
                res.status(404).json({ message: "No job roles found" });
            }
        }catch(error){
            res.status(500).json({ message: "Internal server error" });
        }
    }
}