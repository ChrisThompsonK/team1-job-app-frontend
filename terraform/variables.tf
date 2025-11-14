# Variables for Terraform configuration

# Environment Configuration
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "project_name" {
  description = "Project name for tagging"
  type        = string
  default     = "job-app-frontend"
}

# Azure Authentication (for CI/CD pipelines)
variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
  default     = "ef1b41f6-e4b2-41d0-a52d-d279af4a77ab"
}

variable "tenant_id" {
  description = "Azure tenant ID"
  type        = string
  default     = "f2ec3ef9-cca6-46ec-be61-845d74fcae94"
}

# Resource Group Configuration
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

# Azure Container Registry Configuration
variable "acr_name_prefix" {
  description = "Prefix for ACR name (environment will be appended)"
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

variable "admin_enabled" {
  description = "Enable admin user for ACR (use service principal in prod)"
  type        = bool
  default     = true
}
