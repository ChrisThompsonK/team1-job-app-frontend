import axios from "axios";
import { createHeadersWithAuth } from "../utils/cookieUtils.js";

interface ApplicationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    jobRoleID: number;
    applicantID: string;
    cvPath: string;
    applicationStatus: string;
    appliedAt: string;
  };
}

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  whyInterested: string;
  relevantExperience: string;
  additionalComments?: string;
  dataConsent: boolean;
  marketingConsent?: boolean;
}

export class ApplicationApiService {
  private baseURL: string;

  constructor(baseURL: string = "http://localhost:3001/api") {
    this.baseURL = baseURL;
  }

  /**
   * Submit a job application with CV upload
   * @param jobId - The ID of the job to apply for
   * @param formData - The application form data
   * @param cvFile - The CV file to upload
   * @param coverLetterFile - Optional cover letter file
   * @param cookies - Authentication cookies
   * @returns Promise with application response
   */
  async submitApplication(
    jobId: number,
    formData: ApplicationFormData,
    cvFile: File,
    coverLetterFile?: File,
    cookies?: { [key: string]: string }
  ): Promise<ApplicationResponse> {
    try {
      // Create FormData object for multipart/form-data
      const submissionData = new FormData();
      
      // Add job ID
      submissionData.append("jobId", jobId.toString());
      
      // Add CV file (required)
      submissionData.append("cv", cvFile);
      
      // Add cover letter if provided
      if (coverLetterFile) {
        submissionData.append("coverLetter", coverLetterFile);
      }
      
      // Add form data as metadata (optional - for future enhancement)
      submissionData.append("applicationData", JSON.stringify(formData));

      // Create headers with authentication
      const headers = createHeadersWithAuth(cookies);
      // Note: Don't set Content-Type header for FormData, let browser set it with boundary

      const response = await axios.post<ApplicationResponse>(
        `${this.baseURL}/applications`,
        submissionData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error submitting application:", error);
      
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        // Handle API error responses
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
        if (axiosError.response?.status === 401) {
          throw new Error("Authentication required. Please log in.");
        }
        if (axiosError.response?.status === 400) {
          throw new Error("Invalid application data. Please check your form and try again.");
        }
      }
      
      throw new Error("Failed to submit application. Please try again.");
    }
  }

  /**
   * Get user's applications
   * @param cookies - Authentication cookies
   * @returns Promise with user's applications
   */
  async getUserApplications(cookies?: { [key: string]: string }) {
    try {
      const headers = createHeadersWithAuth(cookies);
      
      const response = await axios.get(
        `${this.baseURL}/applications/me`,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw new Error("Failed to fetch applications");
    }
  }
}