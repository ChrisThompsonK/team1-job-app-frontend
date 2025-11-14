variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
}

variable "location" {
  description = "The Azure region where resources will be deployed"
  type        = string
  default     = "eastus"
}

# Container Registry Variables
variable "container_registry_name" {
  description = "The name of the container registry"
  type        = string
}

variable "container_registry_sku" {
  description = "The SKU of the container registry"
  type        = string
  default     = "Standard"
}

# Log Analytics Variables
variable "log_analytics_workspace_name" {
  description = "The name of the Log Analytics workspace"
  type        = string
}

variable "log_analytics_sku" {
  description = "The SKU of the Log Analytics workspace"
  type        = string
  default     = "PerGB2018"
}

variable "log_retention_days" {
  description = "The number of days to retain logs"
  type        = number
  default     = 30
}

# Container App Environment Variables
variable "container_app_environment_name" {
  description = "The name of the container app environment"
  type        = string
}

# Container App Variables
variable "container_app_name" {
  description = "The name of the container app"
  type        = string
}

variable "container_image_name" {
  description = "The name of the container image (without tag)"
  type        = string
}

variable "container_image_tag" {
  description = "The tag of the container image"
  type        = string
  default     = "latest"
}

variable "container_cpu" {
  description = "The CPU allocation for the container"
  type        = string
  default     = "0.5"
}

variable "container_memory" {
  description = "The memory allocation for the container"
  type        = string
  default     = "1.0Gi"
}

variable "container_port" {
  description = "The port the container listens on"
  type        = string
  default     = "3000"
}

variable "container_min_replicas" {
  description = "The minimum number of container replicas"
  type        = number
  default     = 1
}

variable "container_max_replicas" {
  description = "The maximum number of container replicas"
  type        = number
  default     = 3
}
