# Variables for Terraform configuration
variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "container-registry"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "uksouth"
}

variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "aiacademy25"
}

variable "acr_sku" {
  description = "SKU tier for the Azure Container Registry"
  type        = string
  default     = "Basic"
  
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "ACR SKU must be Basic, Standard, or Premium."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "learning"
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "job-app-frontend"
}
