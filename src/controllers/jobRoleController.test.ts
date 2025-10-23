import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  Band,
  Capability,
  type JobRole,
  JobStatus,
} from "../models/job-role.js";
import type { JobRoleservice } from "../services/interfaces.js";
import { JobRoleMemoryService } from "../services/jobRoleMemoryService.js";
import { JobRoleValidator } from "../validators/JobRoleValidator.js";
import { JobRoleController } from "./jobRoleController.js";

describe("JobRoleController", () => {
  let controller: JobRoleController;
  let mockJobRoleService: JobRoleMemoryService;
  let mockJobRoleValidator: JobRoleValidator;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJobRoles: JobRole[];

  beforeEach(() => {
    // Setup mock data
    mockJobRoles = [
      {
        id: 1,
        name: "Software Engineer",
        location: "London",
        capability: Capability.Engineering,
        band: Band.Senior,
        closingDate: new Date("2024-12-31"),
        numberOfOpenPositions: 2,
        status: JobStatus.Open,
        description: "Develop and maintain software applications",
        responsibilities: [
          "Write clean, maintainable code",
          "Collaborate with team members",
          "Participate in code reviews",
        ],
      },
    ];

    // Create mock service
    mockJobRoleService = new JobRoleMemoryService(mockJobRoles);

    // Create mock validator
    mockJobRoleValidator = new JobRoleValidator();

    // Create controller with mock service and validator
    controller = new JobRoleController(
      mockJobRoleService,
      mockJobRoleValidator
    );

    // Setup mock request and response
    mockRequest = {
      query: {}, // Initialize empty query object
      t: vi.fn((key: string) => {
        // Simple mock that returns English translations
        const translations: Record<string, string> = {
          "jobRoles.list": "Available Positions",
        };
        return translations[key] || key;
      }) as (key: string) => string,
    };
    mockResponse = {
      render: vi.fn(),
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  describe("getJobRolesList", () => {
    it("should render job-role-list template with job roles", async () => {
      // Mock getFilteredJobs to return properly structured response
      vi.spyOn(mockJobRoleService, "getFilteredJobs").mockResolvedValue({
        jobs: mockJobRoles,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
        filters: {},
      });

      await controller.getJobRolesList(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.render).toHaveBeenCalledWith("job-role-list", {
        title: "Available Positions",
        jobRoles: mockJobRoles,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
        paginationData: expect.objectContaining({
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          hasNext: false,
          hasPrevious: false,
        }),
        appliedFilters: {},
        currentFilters: { limit: 12 },
        filterOptions: expect.objectContaining({
          capabilities: expect.any(Array),
          bands: expect.any(Array),
          locations: expect.any(Array),
          statuses: expect.any(Array),
        }),
        timestamp: expect.any(String),
        user: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    });

    it("should include timestamp in ISO format", async () => {
      // Mock getFilteredJobs to return properly structured response
      vi.spyOn(mockJobRoleService, "getFilteredJobs").mockResolvedValue({
        jobs: mockJobRoles,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
        },
        filters: {},
      });

      await controller.getJobRolesList(
        mockRequest as Request,
        mockResponse as Response
      );

      const renderMock = vi.mocked(mockResponse.render);
      expect(renderMock).toHaveBeenCalledWith(
        "job-role-list",
        expect.objectContaining({
          title: "Available Positions",
          jobRoles: mockJobRoles,
          pagination: expect.any(Object),
          timestamp: expect.any(String),
        })
      );

      // Extract timestamp for specific validation
      const callArgs = renderMock?.mock.calls[0];
      const templateData = callArgs?.[1] as { timestamp?: string };

      expect(templateData?.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it("should handle service errors gracefully", async () => {
      // Mock service to throw error
      const errorMockService = {
        getAllJobs: vi.fn().mockResolvedValue([]),
        getJobById: vi.fn().mockReturnValue(undefined),
        getJobByName: vi.fn().mockReturnValue(undefined),
        createJob: vi.fn().mockResolvedValue(null),
        deleteJobById: vi.fn().mockResolvedValue(false),
        updateJobById: vi.fn().mockResolvedValue(undefined),
        getFilteredJobs: vi.fn().mockRejectedValue(new Error("Service error")),
      } as JobRoleservice;

      const errorController = new JobRoleController(
        errorMockService,
        mockJobRoleValidator
      );
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create request with query object
      const errorRequest = {
        query: {},
        t: vi.fn((key: string) => key) as (key: string) => string,
      } as Partial<Request>;

      await errorController.getJobRolesList(
        errorRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.render).toHaveBeenCalledWith("error", {
        title: "Error",
        message: "Unable to fetch job roles",
        error: "Service error",
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching job roles:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("dependency injection", () => {
    it("should use the injected service", async () => {
      const serviceSpy = vi
        .spyOn(mockJobRoleService, "getFilteredJobs")
        .mockResolvedValue({
          jobs: mockJobRoles,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 10,
          },
          filters: {},
        });

      await controller.getJobRolesList(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(serviceSpy).toHaveBeenCalledOnce();
      expect(serviceSpy).toHaveBeenCalledWith({ limit: 12 });
    });
  });
});
