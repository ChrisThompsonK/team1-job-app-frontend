variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "team1-job-app-frontend-rg"
}

variable "location" {
  description = "The Azure region where resources will be deployed"
  type        = string
  default     = "uksouth"
}
