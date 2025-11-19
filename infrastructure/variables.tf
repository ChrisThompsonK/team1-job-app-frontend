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

variable "acr_name" {
  description = "The name of the Azure Container Registry"
  type        = string
  default     = "aiacademy25"
}

variable "acr_resource_group" {
  description = "The resource group name where the ACR is located"
  type        = string
  default     = "container-registry"
}

variable "image_name" {
  description = "The name of the container image"
  type        = string
  default     = "team1-job-app-frontend"
}
variable "image_tag" {
  description = "The tag of the container image"
  type        = string
  default     = "v1"
}
variable "existing_container_app_env_name" {
  description = "The name of the existing Container App Environment"
  type        = string
  default     = "team1-job-app-container-app-environment"
}

variable "existing_container_app_env_rg" {
  description = "The resource group name where the Container App Environment exists"
  type        = string
  default     = "team1-job-app-shared-rg"
}
variable "key_vault_name" {
  description = "The name of the Key Vault"
  type        = string
  default     = "team1-job-app-keyvault"
}