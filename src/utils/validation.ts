import { Band, Capability, JobStatus } from "../models/job-role.js";
import type { JobRoleCreateData } from "../services/interfaces.js";

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

//Claude insists that unknown is appropriate here as the user entered data could be anything
export const validateJobRoleData = (data: unknown): ValidationResult => {
    const errors: ValidationError[] = [];

    // Type guard to safely access properties
    const dataObj = data as Record<string, unknown>;
    if (
        !dataObj.name ||
        typeof dataObj.name !== "string" ||
        dataObj.name.trim() === ""
    ) {
        errors.push({
            field: "name",
            message: "Name is required and must be a non-empty string",
        });
    }

    if (
        !dataObj.location ||
        typeof dataObj.location !== "string" ||
        dataObj.location.trim() === ""
    ) {
        errors.push({
            field: "location",
            message: "Location is required and must be a non-empty string",
        });
    }

    if (!dataObj.capability || typeof dataObj.capability !== "string") {
        errors.push({
            field: "capability",
            message: "Capability is required and must be a string",
        });
    } else if (
        !Object.values(Capability).includes(dataObj.capability as Capability)
    ) {
        errors.push({
            field: "capability",
            message: `Capability must be one of: ${Object.values(Capability).join(", ")}`,
        });
    }

    if (!dataObj.band || typeof dataObj.band !== "string") {
        errors.push({
            field: "band",
            message: "Band is required and must be a string",
        });
    } else if (!Object.values(Band).includes(dataObj.band as Band)) {
        errors.push({
            field: "band",
            message: `Band must be one of: ${Object.values(Band).join(", ")}`,
        });
    }

    if (!dataObj.closingDate) {
        errors.push({ field: "closingDate", message: "Closing date is required" });
    } else {
        const closingDate = new Date(dataObj.closingDate as string);
        if (Number.isNaN(closingDate.getTime())) {
            errors.push({
                field: "closingDate",
                message: "Closing date must be a valid date",
            });
        } else if (closingDate <= new Date()) {
            errors.push({
                field: "closingDate",
                message: "Closing date must be in the future",
            });
        }
    }

    if (
        dataObj.numberOfOpenPositions === undefined ||
        dataObj.numberOfOpenPositions === null
    ) {
        errors.push({
            field: "numberOfOpenPositions",
            message: "Number of open positions is required",
        });
    } else if (
        !Number.isInteger(dataObj.numberOfOpenPositions) ||
        (typeof dataObj.numberOfOpenPositions === "number" &&
            dataObj.numberOfOpenPositions < 1)
    ) {
        errors.push({
            field: "numberOfOpenPositions",
            message: "Number of open positions must be a positive integer",
        });
    }

    if (!dataObj.status || typeof dataObj.status !== "string") {
        errors.push({
            field: "status",
            message: "Status is required and must be a string",
        });
    } else if (!Object.values(JobStatus).includes(dataObj.status as JobStatus)) {
        errors.push({
            field: "status",
            message: `Status must be one of: ${Object.values(JobStatus).join(", ")}`,
        });
    }

    if (
        !dataObj.description ||
        typeof dataObj.description !== "string" ||
        dataObj.description.trim() === ""
    ) {
        errors.push({
            field: "description",
            message: "Description is required and must be a non-empty string",
        });
    }

    if (!dataObj.responsibilities) {
        errors.push({
            field: "responsibilities",
            message: "Responsibilities are required",
        });
    } else if (!Array.isArray(dataObj.responsibilities)) {
        errors.push({
            field: "responsibilities",
            message: "Responsibilities must be an array",
        });
    } else if (dataObj.responsibilities.length === 0) {
        errors.push({
            field: "responsibilities",
            message: "At least one responsibility is required",
        });
    } else {
        dataObj.responsibilities.forEach((resp: unknown, index: number) => {
            if (typeof resp !== "string" || resp.trim() === "") {
                errors.push({
                    field: `responsibilities[${index}]`,
                    message: "Each responsibility must be a non-empty string",
                });
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
//Claude insists that unknown is appropriate here as the user entered data could be anything
export const sanitizeJobRoleData = (data: unknown): JobRoleCreateData => {
    const dataObj = data as Record<string, unknown>;

    return {
        name: dataObj.name?.toString().trim() || "",
        location: dataObj.location?.toString().trim() || "",
        capability: dataObj.capability as Capability,
        band: dataObj.band as Band,
        closingDate: new Date((dataObj.closingDate as string) || ""),
        numberOfOpenPositions: Number(dataObj.numberOfOpenPositions) || 1,
        status: dataObj.status as JobStatus,
        description: dataObj.description?.toString().trim() || "",
        responsibilities: Array.isArray(dataObj.responsibilities)
            ? dataObj.responsibilities
                .map((resp) => resp?.toString().trim())
                .filter((item): item is string => Boolean(item))
            : [],
    };
};
